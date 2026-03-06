import Joi from "joi";

/* Email/password or UserId/password login */
export const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required()
});

/* Google login */
export const googleLoginSchema = Joi.object({
  idToken: Joi.string().required()
});

/* Firebase OTP login */
export const otpLoginSchema = Joi.object({
  firebaseToken: Joi.string().required()
});

/* Forgot password */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

/* Reset password */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

/* Change password */
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

/* Verify Email */
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required()
});

/* Resend Verification */
export const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required()
});

/* Link Google */
export const linkGoogleSchema = Joi.object({
  idToken: Joi.string().required()
});

/* Check Email/Phone */
export const checkEmailSchema = Joi.object({
  email: Joi.string().email().required()
});

export const checkPhoneSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
});

/* Admin create user */
export const adminCreateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("DOCTOR", "CLINIC", "ADMIN").required()
});

/* Admin resend credentials */
export const adminResendCredentialsSchema = Joi.object({
  email: Joi.string().email().required()
});