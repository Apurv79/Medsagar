import mongoose from "mongoose";
import { CONSULTATION_STATUS } from "./consultation.constants.js";

const consultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    agoraChannel: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(CONSULTATION_STATUS),
      default: CONSULTATION_STATUS.SCHEDULED,
      index: true,
    },

    startedAt: Date,
    endedAt: Date,

    recordingUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

consultationSchema.index({ doctorId: 1, status: 1 });
consultationSchema.index({ patientId: 1, status: 1 });

export default mongoose.model("Consultation", consultationSchema);