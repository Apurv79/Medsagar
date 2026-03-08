import { Router } from "express";
import * as controller from "./appointment.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validator.middleware.js";

import {
  bookAppointmentValidator,
  cancelValidator,
  rescheduleValidator,
} from "./appointment.validator.js";

const router = Router();

router.post("/book", auth, validate(bookAppointmentValidator), controller.bookAppointment);

router.get("/my", auth, controller.getMyAppointments);

router.get("/doctor", auth, controller.getDoctorAppointments);

router.get("/upcoming", auth, controller.upcomingAppointments);

router.get("/history", auth, controller.historyAppointments);

router.get("/:id", auth, controller.getAppointment);

router.patch("/:id/cancel", auth, validate(cancelValidator), controller.cancelAppointment);

router.patch("/:id/reschedule", auth, validate(rescheduleValidator), controller.rescheduleAppointment);

router.patch("/:id/status", auth, controller.updateStatus);

export default router;