import ChatMessage from "./chat.model.js";
import Consultation from "../consultation/consultation.model.js";
import { DEFAULT_HISTORY_LIMIT } from "./chat.constants.js";
import eventBus from "../../utils/eventBus.js";
import User from "../user/user.model.js";

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
  const message = await ChatMessage.create(payload);

  // Fetch sender name for notification
  const sender = await User.findById(payload.senderId).select("name").lean();

  // Emit event (listener handles filtering out if user is online in socket)
  eventBus.emit("chat.message", {
    senderId: payload.senderId,
    receiverId: payload.receiverId,
    senderName: sender?.name || "Someone",
    message: payload.message,
    chatId: payload.consultationId
  });

  return message;
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