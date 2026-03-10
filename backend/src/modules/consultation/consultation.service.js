import Consultation from "./consultation.model.js";
import Appointment from "../appointment/appointment.model.js";
import { CONSULTATION_STATUS } from "./consultation.constants.js";
import { generateChannelName } from "./consultation.utils.js";
import { generateAgoraToken } from "./agora.service.js";
import eventBus from "../../utils/eventBus.js";
import User from "../user/user.model.js";

export const startConsultation = async (appointmentId, doctorId) => {
  const appointment = await Appointment.findById(appointmentId).lean();

  if (!appointment) throw new Error("Appointment not found");

  const channel = generateChannelName(appointmentId);

  const consultation = await Consultation.create({
    appointmentId,
    doctorId,
    patientId: appointment.patientId,
    agoraChannel: channel,
  });

  const token = generateAgoraToken(
    channel,
    doctorId,
    "doctor"
  );

  // Fetch doctor name for notification
  const doctor = await User.findById(doctorId).select("name").lean();

  // Emit event for patient to join
  eventBus.emit("consultation.started", {
    userId: appointment.patientId,
    doctorName: doctor?.name || "Doctor",
    consultationId: consultation._id,
    callToken: generateAgoraToken(channel, appointment.patientId, "patient")
  });

  return {
    consultationId: consultation._id,
    channelName: channel,
    agoraToken: token
  };
};

export const joinConsultation = async (consultationId, userId, role) => {
  const consultation = await Consultation.findById(consultationId).lean();

  if (!consultation) throw new Error("Consultation not found");

  const token = generateAgoraToken(
    consultation.agoraChannel,
    userId,
    role
  );

  return {
    consultationId: consultation._id,
    channelName: consultation.agoraChannel,
    agoraToken: token
  };
};

import * as referralService from "../referral/referral.service.js";

export const endConsultation = async (consultationId) => {
  const consultation = await Consultation.findByIdAndUpdate(
    consultationId,
    {
      status: CONSULTATION_STATUS.COMPLETED,
      endedAt: new Date(),
    },
    { new: true }
  ).lean();

  if (consultation && consultation.patientId) {
    try {
      await referralService.completeReferral(consultation.patientId);
    } catch (err) {
      console.error("Failed to complete referral reward:", err.message);
    }
  }

  return consultation;
};

export const getConsultationById = (id) => {
  return Consultation.findById(id).lean();
};

export const getConsultationByAppointment = (appointmentId) => {
  return Consultation.findOne({ appointmentId }).lean();
};

export const getDoctorConsultations = (doctorId) => {
  return Consultation.find({ doctorId }).sort({ createdAt: -1 }).lean();
};

export const getPatientConsultations = (patientId) => {
  return Consultation.find({ patientId }).sort({ createdAt: -1 }).lean();
};

export const listConsultations = () => {
  return Consultation.find().sort({ createdAt: -1 }).lean();
};