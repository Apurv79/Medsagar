import express from "express";
import * as controller from "./notification.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.get("/", controller.getNotifications);
router.get("/unread-count", controller.unreadCount);

router.patch("/:id/read", controller.markRead);
router.patch("/read-all", controller.markAllRead);

/* device token routes */

router.post("/register-device", controller.registerDevice);
router.delete("/remove-device", controller.removeDevice);

/* preferences */

router.get("/preferences", controller.getPreferences);
router.patch("/preferences", controller.updatePreferences);

export default router;