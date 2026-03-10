import express from "express";
import * as controller from "./admin.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validator.middleware.js";
import { configSchema, toggleStatusSchema, rejectDoctorSchema, paginationQuerySchema } from "./admin.validator.js";

const router = express.Router();

// All routes require authentication and at least ADMIN role
router.use(auth);
router.use(role("ADMIN", "SUPER_ADMIN"));

/**
 * DOCTOR & CLINIC ONBOARDING
 */
router.get("/doctors/pending", validate(paginationQuerySchema, "query"), controller.getPendingDoctors);
router.patch("/doctors/:id/approve", controller.approveDoctor);
router.patch("/doctors/:id/reject", validate(rejectDoctorSchema), controller.rejectDoctor);

router.get("/clinics/pending", validate(paginationQuerySchema, "query"), controller.getPendingClinics);
router.patch("/clinics/:id/approve", controller.approveClinic);

/**
 * USER MANAGEMENT
 */
router.get("/users", validate(paginationQuerySchema, "query"), controller.listUsers);
router.get("/users/:id", controller.getUserDetail);
router.patch("/users/:id/status", validate(toggleStatusSchema), controller.toggleUserActive);

/**
 * MONITORING
 */
router.get("/appointments", validate(paginationQuerySchema, "query"), controller.listAppointments);
router.get("/payments", validate(paginationQuerySchema, "query"), controller.listPayments);
router.get("/reports", validate(paginationQuerySchema, "query"), controller.listReports);
router.get("/referrals", validate(paginationQuerySchema, "query"), controller.listReferrals);

/**
 * CONFIG MANAGEMENT (SUPER_ADMIN only)
 */
router.use("/config", role("SUPER_ADMIN"));
router.get("/config", controller.listConfigs);
router.get("/config/:key", controller.getConfig);
router.post("/config", validate(configSchema), controller.upsertConfig);
router.patch("/config/:key", controller.upsertConfig); // reusing upsert as it handles update too
router.delete("/config/:key", controller.removeConfig);

export default router;