import express from "express";
import * as controller from "./sos.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// Patient routes
router.post("/", roleMiddleware("PATIENT"), controller.trigger);
router.get("/history", controller.getHistory);
router.get("/doctors/nearby", controller.nearbyDoctors);
router.get("/:sosId", controller.getById);

// Doctor routes
router.patch("/:sosId/accept", roleMiddleware("DOCTOR"), controller.accept);
router.patch("/:sosId/reject", roleMiddleware("DOCTOR"), controller.updateStatus); // Status rejected
router.patch("/:sosId/close", roleMiddleware("DOCTOR", "ADMIN"), controller.updateStatus); // Status completed/closed

export default router;