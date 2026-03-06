import crypto from "crypto";
import User from "../user/user.model.js";
import { AuthSession, PasswordResetToken } from "./auth.model.js";

import logger from "../../utils/logger.js";
import { hashPassword, verifyPassword, generateRandomPassword } from "../../utils/password.js";
import { generateTokenPair, verifyRefreshToken } from "../../utils/jwt.js";
import { sendCredentialsEmail, sendResetPasswordEmail } from "../../utils/mailer.js";
import { verifyGoogleToken } from "../../configs/oAuth.config.js";
import { verifyFirebaseToken } from "../../configs/firebase.config.js";

/* ================= LOGIN EMAIL ================= */

export const loginWithEmail = async ({ email, password, ip, userAgent }) => {

  const user = await User.findOne({ email, isActive: true })
    .select("+password role name email")
    .lean();

  if (!user) throw new Error("Invalid credentials");

  const valid = await verifyPassword(user.password, password);
  if (!valid) throw new Error("Invalid credentials");

  const payload = {
    userId: user._id,
    role: user.role
  };

  const tokens = generateTokenPair(payload);

  await AuthSession.create({
    userId: user._id,
    refreshToken: tokens.refreshToken,
    ipAddress: ip,
    userAgent,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  logger.info("User logged in:", user.email);

  return { user, tokens };
};

/* ================= GOOGLE LOGIN ================= */

export const loginWithGoogle = async ({ idToken, ip, userAgent }) => {

  const googleUser = await verifyGoogleToken(idToken);

  let user = await User.findOne({ email: googleUser.email })
    .select("_id role email name")
    .lean();

  if (!user) {
    user = await User.create({
      email: googleUser.email,
      name: googleUser.name,
      role: "PATIENT",
      authProvider: "GOOGLE",
      isVerified: true
    });
  }

  const payload = { userId: user._id, role: user.role };

  const tokens = generateTokenPair(payload);

  await AuthSession.create({
    userId: user._id,
    refreshToken: tokens.refreshToken,
    ipAddress: ip,
    userAgent,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  return { user, tokens };
};

/* ================= OTP LOGIN ================= */

export const loginWithOTP = async ({ firebaseToken, ip, userAgent }) => {

  const decoded = await verifyFirebaseToken(firebaseToken);

  const phone = decoded.phone_number;

  let user = await User.findOne({ phone })
    .select("_id role phone")
    .lean();

  if (!user) {
    user = await User.create({
      phone,
      role: "PATIENT",
      authProvider: "FIREBASE",
      isVerified: true
    });
  }

  const payload = { userId: user._id, role: user.role };

  const tokens = generateTokenPair(payload);

  await AuthSession.create({
    userId: user._id,
    refreshToken: tokens.refreshToken,
    ipAddress: ip,
    userAgent,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  return { user, tokens };
};

/* ================= REFRESH TOKEN ================= */

export const refreshTokenService = async (refreshToken) => {

  const decoded = verifyRefreshToken(refreshToken);

  const session = await AuthSession.findOne({
    refreshToken,
    isRevoked: false
  }).lean();

  if (!session) throw new Error("Session invalid");

  const tokens = generateTokenPair({
    userId: decoded.userId,
    role: decoded.role
  });

  await AuthSession.updateOne(
    { _id: session._id },
    { refreshToken: tokens.refreshToken }
  );

  return tokens;
};

/* ================= LOGOUT ================= */

export const logoutService = async (refreshToken) => {

  await AuthSession.updateOne(
    { refreshToken },
    { isRevoked: true }
  );

  logger.info("Session revoked");
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPasswordService = async (email) => {

  const user = await User.findOne({ email })
    .select("_id email name authProvider")
    .lean();

  if (!user) return;

  if (user.authProvider !== "LOCAL") {
    throw new Error(`Password reset not allowed for ${user.authProvider} accounts`);
  }

  const token = crypto.randomBytes(32).toString("hex");

  await PasswordResetToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 15)
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendResetPasswordEmail({
    email,
    resetLink
  });
};

/* ================= RESET PASSWORD ================= */

export const resetPasswordService = async ({ token, password }) => {

  const record = await PasswordResetToken.findOne({
    token,
    used: false
  }).lean();

  if (!record) throw new Error("Invalid reset token");

  const hashed = await hashPassword(password);

  await User.updateOne(
    { _id: record.userId },
    { password: hashed }
  );

  await PasswordResetToken.updateOne(
    { _id: record._id },
    { used: true }
  );
};

/* ================= ADMIN CREATE USER ================= */

export const createUserCredentialsService = async ({ name, email, role }) => {

  const password = generateRandomPassword();

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    role,
    password: hashed,
    authProvider: "LOCAL",
    isVerified: true
  });

  await sendCredentialsEmail({
    email,
    name,
    username: email,
    password,
    role
  });

  return user;
};

/* ================= ADMIN RESET PASSWORD ================= */

export const adminResetPasswordService = async (userId) => {
  const user = await User.findById(userId).select("email name authProvider role");

  if (!user) throw new Error("User not found");

  if (user.authProvider !== "LOCAL") {
    throw new Error(`Cannot reset password for ${user.authProvider} accounts`);
  }

  if (user.role === "SUPER_ADMIN") {
    throw new Error("Super Admin password cannot be reset via API");
  }

  const newPassword = generateRandomPassword();
  const hashed = await hashPassword(newPassword);

  await User.updateOne({ _id: userId }, { password: hashed });

  await sendCredentialsEmail({
    email: user.email,
    name: user.name,
    username: user.email,
    password: newPassword,
    role: "User" // Or generic
  });

  return true;
};