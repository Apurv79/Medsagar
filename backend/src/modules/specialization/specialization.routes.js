import express from "express";
import * as controller from "./specialization.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/", controller.list);
router.get("/popular", controller.getPopular);
router.get("/search", controller.search);
router.get("/:id/doctors", controller.getSpecDoctors);

// Protected routes (Admin only)
router.use(authMiddleware, roleMiddleware("ADMIN", "SUPER_ADMIN"));

router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;