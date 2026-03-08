import ChatMessage from "./chat.model.js";
import Consultation from "../consultation/consultation.model.js";
import { DEFAULT_HISTORY_LIMIT } from "./chat.constants.js";

export const validateConsultationAccess = async (consultationId, userId) => {
  const consultation = await Consultation.findById(consultationId).lean();

  if (!consultation) throw new Error("Consultation not found");

  const isParticipant =
    consultation.patientId.toString() === userId ||
    consultation.doctorId.toString() === userId;

  if (!isParticipant) throw new Error("Unauthorized consultation access");

  return consultation;
};

export const saveMessage = async (payload) => {
  return ChatMessage.create(payload);
};

export const getChatHistory = async (consultationId, limit, cursor) => {
  const query = { consultationId };

  if (cursor) query._id = { $lt: cursor };

  return ChatMessage.find(query)
    .sort({ _id: -1 })
    .limit(limit || DEFAULT_HISTORY_LIMIT)
    .lean();
};

export const markDelivered = async (messageId) => {
  return ChatMessage.findByIdAndUpdate(
    messageId,
    { status: "DELIVERED" },
    { new: true }
  ).lean();
};

export const markRead = async (messageId) => {
  return ChatMessage.findByIdAndUpdate(
    messageId,
    { status: "READ" },
    { new: true }
  ).lean();
};