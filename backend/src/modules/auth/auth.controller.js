import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

/* LOGIN */
export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginWithCredentials({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });
  return ApiResponse.success(res, "Login successful", result);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const result = await authService.loginWithGoogle({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });
  return ApiResponse.success(res, "Google login successful", result);
});

export const otpLogin = asyncHandler(async (req, res) => {
  const result = await authService.loginWithOTP({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });
  return ApiResponse.success(res, "OTP login successful", result);
});

/* TOKENS & LOGOUT */
export const refreshToken = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshTokenService(req.body.refreshToken);
  return ApiResponse.success(res, "Token refreshed", tokens);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutService(req.body.refreshToken);
  return ApiResponse.success(res, "Logged out");
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAllSessionsService(req.user.userId);
  return ApiResponse.success(res, "Logged out from all devices");
});

/* SESSIONS */
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await authService.getActiveSessionsService(req.user.userId);
  return ApiResponse.success(res, "Sessions fetched", sessions);
});

export const revokeSession = asyncHandler(async (req, res) => {
  await authService.revokeSessionService(req.user.userId, req.params.id);
  return ApiResponse.success(res, "Session revoked");
});

/* PASSWORD */
export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePasswordService(req.user.userId, req.body);
  return ApiResponse.success(res, "Password changed successfully");
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPasswordService(req.body.email);
  return ApiResponse.success(res, "If email is registered, a reset link has been sent");
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPasswordService(req.body);
  return ApiResponse.success(res, "Password updated successfully");
});

/* EMAIL VERIFICATION */
export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmailService(req.body.token);
  return ApiResponse.success(res, "Email verified successfully");
});

export const resendVerification = asyncHandler(async (req, res) => {
  await authService.sendVerificationEmailService(req.user.userId, req.user.email);
  return ApiResponse.success(res, "Verification email sent");
});

/* ADMIN */
export const adminCreateUser = asyncHandler(async (req, res) => {
  const result = await authService.createUserCredentialsService(req.body);
  return ApiResponse.success(res, "Account created and credentials emailed", result);
});

export const adminResendCredentials = asyncHandler(async (req, res) => {
  const result = await authService.resendCredentialsService(req.body.email);
  return ApiResponse.success(res, "New credentials generated and emailed", result);
});

/* UTILS */
export const checkEmail = asyncHandler(async (req, res) => {
  const isAvailable = await authService.checkAvailabilityService({ email: req.body.email });
  return ApiResponse.success(res, "Check complete", { exists: isAvailable });
});

export const checkPhone = asyncHandler(async (req, res) => {
  const isAvailable = await authService.checkAvailabilityService({ phone: req.body.phone });
  return ApiResponse.success(res, "Check complete", { exists: isAvailable });
});

/* SOCIAL LINKING */
export const linkGoogle = asyncHandler(async (req, res) => {
  await authService.linkGoogleService(req.user.userId, req.body.idToken);
  return ApiResponse.success(res, "Google account linked");
});

export const unlinkGoogle = asyncHandler(async (req, res) => {
  await authService.unlinkGoogleService(req.user.userId);
  return ApiResponse.success(res, "Google account unlinked");
});