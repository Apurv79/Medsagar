import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import * as controller from "./chat.controller.js";

const router = Router();

router.get("/history/:consultationId", auth, controller.getChatHistory);

export default router;