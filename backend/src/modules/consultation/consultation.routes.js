import { Router } from "express";
import * as controller from "./consultation.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validator.middleware.js";

import {
  startConsultationValidator,
  joinConsultationValidator,
  endConsultationValidator,
} from "./consultation.validator.js";

const router = Router();

router.post(
  "/start",
  auth,
  role("DOCTOR"),
  validate(startConsultationValidator),
  controller.startConsultation
);

router.post(
  "/join",
  auth,
  validate(joinConsultationValidator),
  controller.joinConsultation
);

router.post(
  "/end",
  auth,
  role("DOCTOR"),
  validate(endConsultationValidator),
  controller.endConsultation
);

router.get("/appointment/:appointmentId", auth, controller.getConsultationByAppointment);

router.get("/doctor", auth, role("DOCTOR"), controller.getDoctorConsultations);

router.get("/my", auth, controller.getPatientConsultations);

router.get("/:id", auth, controller.getConsultation);

router.get("/", auth, role("ADMIN"), controller.listConsultations);

export default router;