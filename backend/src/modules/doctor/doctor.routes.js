import express from "express";
import * as controller from "./doctor.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/:doctorId", controller.getOne);
router.get("/:doctorId/profile-score", controller.getProfileScore);

// Protected routes
router.use(authMiddleware);

// Doctor specific routes
router.patch("/:doctorId", roleMiddleware("DOCTOR", "ADMIN"), controller.update);
router.post("/:doctorId/leave", roleMiddleware("DOCTOR"), controller.setLeave);
router.get("/:doctorId/leave", roleMiddleware("DOCTOR", "ADMIN"), controller.getLeave);
router.delete("/:doctorId/leave/:leaveId", roleMiddleware("DOCTOR"), controller.cancelLeave);
router.patch("/:doctorId/online", roleMiddleware("DOCTOR"), controller.setOnline);
router.patch("/:doctorId/offline", roleMiddleware("DOCTOR"), controller.setOffline);
router.get("/:doctorId/stats", roleMiddleware("DOCTOR", "ADMIN"), controller.getStats);

// Additional Doctor updates
router.patch("/:doctorId/fees", roleMiddleware("DOCTOR"), controller.updateFees);
router.patch("/:doctorId/consultation-types", roleMiddleware("DOCTOR"), controller.updateTypes);
router.patch("/:doctorId/languages", roleMiddleware("DOCTOR"), controller.updateLangs);
router.post("/:doctorId/availability", roleMiddleware("DOCTOR"), controller.updateAvailability);

// Admin only routes
router.use(roleMiddleware("ADMIN", "SUPER_ADMIN"));

router.post("/", controller.create);
router.patch("/:doctorId/activate", controller.activate);
router.patch("/:doctorId/deactivate", controller.deactivate);
router.patch("/:doctorId/license/verify", controller.verifyLicense);
router.patch("/:doctorId/feature", controller.feature);

export default router;