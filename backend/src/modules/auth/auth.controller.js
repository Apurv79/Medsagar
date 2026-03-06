import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

/* EMAIL LOGIN */
export const login = asyncHandler(async (req, res) => {

  const result = await authService.loginWithEmail({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });

  return ApiResponse.success(res, "Login successful", result);
});

/* GOOGLE LOGIN */
export const googleLogin = asyncHandler(async (req, res) => {

  const result = await authService.loginWithGoogle({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });

  return ApiResponse.success(res, "Google login successful", result);
});

/* OTP LOGIN */
export const otpLogin = asyncHandler(async (req, res) => {

  const result = await authService.loginWithOTP({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });

  return ApiResponse.success(res, "OTP login successful", result);
});

/* REFRESH TOKEN */
export const refreshToken = asyncHandler(async (req, res) => {

  const tokens = await authService.refreshTokenService(req.body.refreshToken);

  return ApiResponse.success(res, "Token refreshed", tokens);
});

/* LOGOUT */
export const logout = asyncHandler(async (req, res) => {

  await authService.logoutService(req.body.refreshToken);

  return ApiResponse.success(res, "Logged out");
});

/* FORGOT PASSWORD */
export const forgotPassword = asyncHandler(async (req, res) => {

  await authService.forgotPasswordService(req.body.email);

  return ApiResponse.success(res, "Reset email sent");
});

/* RESET PASSWORD */
export const resetPassword = asyncHandler(async (req, res) => {

  await authService.resetPasswordService(req.body);

  return ApiResponse.success(res, "Password updated");
});