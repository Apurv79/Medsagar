import mongoose from "mongoose";
import { MESSAGE_TYPE, MESSAGE_STATUS } from "./chat.constants.js";

const chatSchema = new mongoose.Schema(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      default: null,
    },

    attachmentUrl: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      enum: Object.values(MESSAGE_TYPE),
      default: MESSAGE_TYPE.TEXT,
    },

    status: {
      type: String,
      enum: Object.values(MESSAGE_STATUS),
      default: MESSAGE_STATUS.SENT,
    },
  },
  { timestamps: true }
);

chatSchema.index({ consultationId: 1, createdAt: -1 });

export default mongoose.model("ChatMessage", chatSchema);