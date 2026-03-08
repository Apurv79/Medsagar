import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./chat.redis.js";
import * as chatService from "./chat.service.js";

export const initChatSocket = async (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-consultation", async (consultationId) => {
      await chatService.validateConsultationAccess(
        consultationId,
        socket.user._id
      );

      socket.join(consultationId);
    });

    socket.on("send-message", async (data) => {
      const message = await chatService.saveMessage({
        consultationId: data.consultationId,
        senderId: socket.user._id,
        receiverId: data.receiverId,
        message: data.message,
        attachmentUrl: data.attachmentUrl,
      });

      io.to(data.consultationId).emit("receive-message", message);
    });

    socket.on("message-read", async (messageId) => {
      const msg = await chatService.markRead(messageId);

      io.to(msg.consultationId.toString()).emit("message-read", msg);
    });

    socket.on("message-delivered", async (messageId) => {
      const msg = await chatService.markDelivered(messageId);

      io.to(msg.consultationId.toString()).emit("message-delivered", msg);
    });
  });

  return io;
};