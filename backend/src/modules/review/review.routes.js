import express from "express";
import * as controller from "./review.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/stats/:targetId", controller.getStats);
router.get("/doctor/:doctorId", controller.getDoctorReviews);
router.get("/clinic/:clinicId", controller.getClinicReviews);

// Protected routes (Patient)
router.use(authMiddleware);

router.post("/", controller.create);
router.patch("/:reviewId", controller.update);
router.delete("/:reviewId", controller.remove);

export default router;