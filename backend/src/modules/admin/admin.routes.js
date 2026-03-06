import express from "express";
import * as controller from "./admin.controller.js";
import * as validator from "./admin.validator.js";
import validate from "../../middlewares/validator.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import rateLimiter from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * Admin Routes
 * Only accessible by ADMIN and SUPER_ADMIN
 */

router.post(
    "/users",
    rateLimiter,
    authMiddleware,
    roleMiddleware("ADMIN", "SUPER_ADMIN"),
    validate(validator.createUserSchema),
    controller.createUser
);

router.patch(
    "/reset-password",
    rateLimiter,
    authMiddleware,
    roleMiddleware("ADMIN", "SUPER_ADMIN"),
    validate(validator.adminResetPasswordSchema),
    controller.resetUserPassword
);

export default router;
