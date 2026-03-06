import express from "express";

import * as controller from "./auth.controller.js";
import * as validator from "./auth.validator.js";

import validatorMiddleware from "../../middlewares/validator.middleware.js";
import rateLimiter from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

/* PUBLIC AUTH ROUTES */

router.post(
  "/login",
  rateLimiter,
  validator.loginValidator,
  validatorMiddleware,
  controller.login
);

router.post(
  "/google",
  rateLimiter,
  validator.googleLoginValidator,
  validatorMiddleware,
  controller.googleLogin
);

router.post(
  "/otp",
  rateLimiter,
  validator.otpLoginValidator,
  validatorMiddleware,
  controller.otpLogin
);

router.post("/refresh", rateLimiter, controller.refreshToken);

router.post("/logout", rateLimiter, controller.logout);

/* PASSWORD */

router.post(
  "/forgot-password",
  rateLimiter,
  validator.forgotPasswordValidator,
  validatorMiddleware,
  controller.forgotPassword
);

router.post(
  "/reset-password",
  rateLimiter,
  validator.resetPasswordValidator,
  validatorMiddleware,
  controller.resetPassword
);

export default router;