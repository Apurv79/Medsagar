import express from "express";
import * as controller from "./auth.controller.js";
import * as validator from "./auth.validator.js";
import validate from "../../middlewares/validator.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import rateLimiter from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

/* PUBLIC ROUTES */

router.post("/login", rateLimiter, validate(validator.loginSchema), controller.login);
router.post("/google", rateLimiter, validate(validator.googleLoginSchema), controller.googleLogin);
router.post("/otp", rateLimiter, validate(validator.otpLoginSchema), controller.otpLogin);
router.post("/refresh", rateLimiter, controller.refreshToken);

/* PASSWORD RECOVERY */

router.post("/forgot-password", rateLimiter, validate(validator.forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", rateLimiter, validate(validator.resetPasswordSchema), controller.resetPassword);

/* VERIFICATION */

router.post("/verify-email", rateLimiter, validate(validator.verifyEmailSchema), controller.verifyEmail);

/* UTILS */

router.post("/check-email", rateLimiter, validate(validator.checkEmailSchema), controller.checkEmail);
router.post("/check-phone", rateLimiter, validate(validator.checkPhoneSchema), controller.checkPhone);

/* PROTECTED ROUTES (Requires Login) */

router.use(authMiddleware);

router.post("/logout", controller.logout);
router.post("/logout-all", controller.logoutAll);
router.get("/sessions", controller.getSessions);
router.delete("/session/:id", controller.revokeSession);

router.post("/change-password", rateLimiter, validate(validator.changePasswordSchema), controller.changePassword);
router.post("/resend-verification", rateLimiter, controller.resendVerification);

/* SOCIAL LINKING */

router.post("/link-google", rateLimiter, validate(validator.linkGoogleSchema), controller.linkGoogle);
router.post("/unlink-google", rateLimiter, controller.unlinkGoogle);

/* ADMIN ONLY (Requires ADMIN or SUPER_ADMIN) */

router.use(roleMiddleware("ADMIN", "SUPER_ADMIN"));

router.post("/admin/create-user-credentials", rateLimiter, validate(validator.adminCreateUserSchema), controller.adminCreateUser);
router.post("/admin/resend-credentials", rateLimiter, validate(validator.adminResendCredentialsSchema), controller.adminResendCredentials);

export default router;