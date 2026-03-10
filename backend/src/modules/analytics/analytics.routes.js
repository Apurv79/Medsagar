import express from "express";
import * as controller from "./analytics.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();

// All analytics routes require authentication and at least ADMIN role
router.use(auth);
router.use(role("ADMIN", "SUPER_ADMIN"));

router.get("/dashboard", controller.dashboardOverview);
router.get("/users/growth", controller.userGrowth);
router.get("/revenue", controller.revenueAnalytics);
router.get("/doctor-earnings", controller.doctorEarnings);
router.get("/appointments/stats", controller.appointmentStats);
router.get("/today", controller.todayMetrics);
router.get("/doctors/top", controller.topDoctors);
router.get("/consultations/modes", controller.consultationModes);
router.get("/referrals", controller.referralAnalytics);
router.get("/wallet", controller.walletAnalytics);

export default router;