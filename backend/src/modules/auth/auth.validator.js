import { body } from "express-validator";

/* Email/password login */
export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
];

/* Google login */
export const googleLoginValidator = [
  body("idToken").notEmpty().withMessage("Google idToken required")
];

/* Firebase OTP login */
export const otpLoginValidator = [
  body("firebaseToken").notEmpty().withMessage("Firebase token required")
];

/* Forgot password */
export const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Valid email required")
];

/* Reset password */
export const resetPasswordValidator = [
  body("token").notEmpty(),
  body("password").isLength({ min: 6 })
];