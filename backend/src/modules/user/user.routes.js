import express from "express";
import * as controller from "./user.controller.js";
import * as validator from "./user.validator.js";
import validate from "../../middlewares/validator.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import rateLimiter from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

/* PROFILE */

router.get("/me", authMiddleware, controller.getProfile);

router.patch(
  "/me",
  rateLimiter,
  authMiddleware,
  validate(validator.updateProfileSchema),
  controller.updateProfile
);

/* ADMIN USER MANAGEMENT */

router.get(
  "/",
  rateLimiter,
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  controller.listUsers
);

router.get(
  "/search",
  rateLimiter,
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.searchUsers
);

router.patch(
  "/:id/activate",
  rateLimiter,
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.activateUser
);

router.patch(
  "/:id/deactivate",
  rateLimiter,
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.deactivateUser
);

export default router;