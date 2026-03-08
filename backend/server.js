import env from "./src/configs/env.config.js";
import http from "http";
import connectDB from "./src/configs/db.config.js";
import app from "./src/app.js";
import { initChatSocket } from "./modules/chat/chat.socket.js";

const startServer = async () => {
  try {
    await connectDB();
   


    const server = http.createServer(app);
     initChatSocket(server);


    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      process.exit(1);
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      process.exit(1);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();