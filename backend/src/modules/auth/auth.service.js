import crypto from "crypto";
import User from "../user/user.model.js";
import { AuthSession, PasswordResetToken, EmailVerificationToken } from "./auth.model.js";

import logger from "../../utils/logger.js";
import { hashPassword, verifyPassword, generateRandomPassword } from "../../utils/password.js";
import { generateTokenPair, verifyRefreshToken } from "../../utils/jwt.js";
import { sendCredentialsEmail, sendResetPasswordEmail, sendMail } from "../../utils/mailer.js";
import { verifyGoogleToken } from "../../configs/oAuth.config.js";
import { verifyFirebaseToken } from "../../configs/firebase.config.js";
import { ApiError } from "../../utils/apiError.js";

/* ================= LOGIN EMAIL ================= */

export const loginWithCredentials = async ({ identifier, password, ip, userAgent }) => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { userId: identifier }],
    isActive: true
  })
    .select("+password role name email userId")
    .lean();

  if (!user) throw new ApiError("Invalid credentials", 401);

  const valid = await verifyPassword(user.password, password);
  if (!valid) throw new ApiError("Invalid credentials", 401);

  const payload = { userId: user._id, role: user.role };
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

  let user = await User.findOne({
    $or: [{ email: googleUser.email }, { googleId: googleUser.googleId }]
  })
    .select("_id role email name googleId")
    .lean();

  if (!user) {
    user = await User.create({
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.googleId,
      role: "PATIENT",
      authProvider: "GOOGLE",
      isVerified: true
    });
  } else if (!user.googleId) {
    await User.updateOne({ _id: user._id }, { googleId: googleUser.googleId, authProvider: "GOOGLE" });
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
  const session = await AuthSession.findOne({ refreshToken, isRevoked: false }).lean();

  if (!session) throw new Error("Session invalid or revoked");

  const tokens = generateTokenPair({ userId: decoded.userId, role: decoded.role });

  await AuthSession.updateOne(
    { _id: session._id },
    { refreshToken: tokens.refreshToken }
  );

  return tokens;
};

/* ================= LOGOUT ================= */

export const logoutService = async (refreshToken) => {
  await AuthSession.updateOne({ refreshToken }, { isRevoked: true });
  logger.info("Session revoked");
};

export const logoutAllSessionsService = async (userId) => {
  await AuthSession.updateMany({ userId }, { isRevoked: true });
  logger.info(`All sessions revoked for user: ${userId}`);
};

/* ================= SESSIONS ================= */

export const getActiveSessionsService = async (userId) => {
  return AuthSession.find({ userId, isRevoked: false, expiresAt: { $gt: new Date() } })
    .select("ipAddress userAgent createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

export const revokeSessionService = async (userId, sessionId) => {
  await AuthSession.updateOne({ _id: sessionId, userId }, { isRevoked: true });
};

/* ================= PASSWORD MANAGEMENT ================= */

export const changePasswordService = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user || user.authProvider !== "LOCAL") throw new Error("Password change not allowed");

  const valid = await verifyPassword(user.password, oldPassword);
  if (!valid) throw new Error("Invalid current password");

  user.password = await hashPassword(newPassword);
  await user.save();
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email }).select("_id email name authProvider").lean();
  if (!user || user.authProvider !== "LOCAL") return;

  const token = crypto.randomBytes(32).toString("hex");
  await PasswordResetToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendResetPasswordEmail({ email, resetLink });
};

export const resetPasswordService = async ({ token, password }) => {
  const record = await PasswordResetToken.findOne({ token, used: false, expiresAt: { $gt: new Date() } }).lean();
  if (!record) throw new Error("Invalid or expired reset token");

  const hashed = await hashPassword(password);
  await User.updateOne({ _id: record.userId }, { password: hashed });
  await PasswordResetToken.updateOne({ _id: record._id }, { used: true });
};

/* ================= EMAIL VERIFICATION ================= */

export const sendVerificationEmailService = async (userId, email) => {
  const token = crypto.randomBytes(32).toString("hex");
  await EmailVerificationToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendMail({
    to: email,
    subject: "Verify Your Medsagar Account",
    html: `<h2>Email Verification</h2><p>Click below to verify your email:</p><a href="${verifyLink}">Verify Email</a>`
  });
};

export const verifyEmailService = async (token) => {
  const record = await EmailVerificationToken.findOne({ token, used: false, expiresAt: { $gt: new Date() } }).lean();
  if (!record) throw new Error("Invalid or expired verification token");

  await User.updateOne({ _id: record.userId }, { isVerified: true });
  await EmailVerificationToken.updateOne({ _id: record._id }, { used: true });
};

/* ================= ADMIN SERVICES ================= */

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

  await sendCredentialsEmail({ email, name, username: email, password, role });
  return { user, password };
};

export const resendCredentialsService = async (email) => {
  const user = await User.findOne({ email }).select("name role authProvider").lean();
  if (!user || user.authProvider !== "LOCAL") throw new Error("User not eligible");

  const newPassword = generateRandomPassword();
  const hashed = await hashPassword(newPassword);

  await User.updateOne({ _id: user._id }, { password: hashed });
  await sendCredentialsEmail({ email, name: user.name, username: email, password: newPassword, role: user.role });

  return { email, password: newPassword };
};

export const adminResetPasswordService = async (userId) => {
  const user = await User.findById(userId).select("email name authProvider role").lean();
  if (!user || user.authProvider !== "LOCAL") throw new Error("Invalid user");
  if (user.role === "SUPER_ADMIN") throw new Error("Restricted");

  const newPassword = generateRandomPassword();
  const hashed = await hashPassword(newPassword);

  await User.updateOne({ _id: userId }, { password: hashed });
  await sendCredentialsEmail({ email: user.email, name: user.name, username: user.email, password: newPassword, role: user.role });

  return { email: user.email, password: newPassword };
};

/* ================= UTILS ================= */

export const checkAvailabilityService = async ({ email, phone }) => {
  const query = {};
  if (email) query.email = email;
  if (phone) query.phone = phone;

  const exists = await User.exists(query);
  return !!exists;
};

export const linkGoogleService = async (userId, idToken) => {
  const googleUser = await verifyGoogleToken(idToken);
  const exists = await User.findOne({ googleId: googleUser.googleId }).lean();
  if (exists) throw new Error("Google account already linked to another user");

  await User.updateOne({ _id: userId }, { googleId: googleUser.googleId });
};

export const unlinkGoogleService = async (userId) => {
  const user = await User.findById(userId).select("authProvider password").lean();
  if (user.authProvider === "GOOGLE") throw new Error("Cannot unlink primary auth provider");

  await User.updateOne({ _id: userId }, { $unset: { googleId: "" } });
};