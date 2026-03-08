import mongoose from "mongoose";
import { APPOINTMENT_STATUS, CONSULTATION_TYPES } from "./appointment.constants.js";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      default: null,
    },

    consultationType: {
      type: String,
      enum: Object.values(CONSULTATION_TYPES),
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    slotStart: {
      type: Date,
      required: true,
    },

    slotEnd: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.CONFIRMED,
      index: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      default: null,
    },

    cancelReason: String,

    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1, slotStart: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

export default mongoose.model("Appointment", appointmentSchema);