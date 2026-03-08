import express from "express";
import * as controller from "./clinic.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/", controller.list);
router.get("/:clinicId", controller.getOne);
router.get("/:clinicId/doctors", controller.getDoctors);
router.get("/:clinicId/hours", controller.getHours);
router.get("/:clinicId/images", controller.getImages);
router.get("/:clinicId/services", controller.getServices);
router.get("/:clinicId/staff", controller.getStaff);

// Protected routes
router.use(authMiddleware);

// Clinic Admin / Admin routes
router.post("/", roleMiddleware("ADMIN", "CLINIC"), controller.create);

// Manage Doctors
router.post("/:clinicId/doctors/:doctorId", roleMiddleware("ADMIN", "CLINIC"), controller.addDoctor);
router.delete("/:clinicId/doctors/:doctorId", roleMiddleware("ADMIN", "CLINIC"), controller.removeDoctor);

// Manage Hours
router.patch("/:clinicId/hours", roleMiddleware("ADMIN", "CLINIC"), controller.updateHours);

// Manage Images
router.post("/:clinicId/images", roleMiddleware("ADMIN", "CLINIC"), controller.addImage);
router.delete("/:clinicId/images/:imageId", roleMiddleware("ADMIN", "CLINIC"), controller.removeImage);

// Manage Services
router.patch("/:clinicId/services", roleMiddleware("ADMIN", "CLINIC"), controller.manageServices);

// Manage Staff
router.post("/:clinicId/staff", roleMiddleware("ADMIN", "CLINIC"), controller.addStaff);
router.delete("/:clinicId/staff/:userId", roleMiddleware("ADMIN", "CLINIC"), controller.removeStaff);
router.get("/:clinicId/staff", roleMiddleware("ADMIN", "CLINIC"), controller.getStaff);

// Verify Clinic (Admin only)
router.patch("/:clinicId/verify", roleMiddleware("ADMIN", "SUPER_ADMIN"), controller.verify);

export default router;