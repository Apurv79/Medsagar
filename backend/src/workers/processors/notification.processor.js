import { Worker } from "bullmq";
import { sendFCM, sendSMS } from "../../modules/notification/notification.provider.js";
import User from "../../modules/user/user.model.js";
import logger from "../../utils/logger.js";

const notificationProcessor = async (job) => {
    const { userId, title, message, type, data } = job.data;

    try {
        const user = await User.findById(userId)
            .select("fcmTokens phone notificationPreferences")
            .lean();

        if (!user) {
            logger.warn(`User ${userId} not found for notification`);
            return;
        }

        const prefs = user.notificationPreferences || {
            pushEnabled: true,
            smsEnabled: true
        };

        // Send Push Notification
        if (prefs.pushEnabled && user.fcmTokens?.length > 0) {
            for (const token of user.fcmTokens) {
                try {
                    await sendFCM(token, { title, message, data });
                } catch (err) {
                    logger.error(`FCM failed for token ${token}: ${err.message}`);
                }
            }
        }

        // Send SMS Notification (If it's an SOS alert or critical)
        if (prefs.smsEnabled && user.phone && (type === "SOS_ALERT" || data?.urgent)) {
            try {
                await sendSMS(user.phone, { title, message, ...data });
            } catch (err) {
                logger.error(`SMS failed for ${user.phone}: ${err.message}`);
            }
        }

    } catch (error) {
        logger.error(`Notification processor error: ${error.message}`);
        throw error;
    }
};

export default notificationProcessor;