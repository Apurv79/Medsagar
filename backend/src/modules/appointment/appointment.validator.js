import Joi from "joi";
import { CONSULTATION_TYPES } from "./appointment.constants.js";

export const bookAppointmentValidator = Joi.object({
  doctorId: Joi.string().required(),
  clinicId: Joi.string().optional(),
  consultationType: Joi.string()
    .valid(...Object.values(CONSULTATION_TYPES))
    .required(),
  appointmentDate: Joi.date().required(),
  slotStart: Joi.date().required(),
  paymentId: Joi.string().required(),
});

export const rescheduleValidator = Joi.object({
  slotStart: Joi.date().required(),
});

export const cancelValidator = Joi.object({
  reason: Joi.string().required(),
});

export const slotsValidator = Joi.object({
  doctorId: Joi.string().required(),
  date: Joi.date().required(),
});