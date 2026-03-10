import { Queue } from "bullmq";

export const notificationQueue = new Queue(
    "notificationQueue",
    { connection: { url: process.env.REDIS_BULLMQ_URL } }
);

export const addNotificationJob = async (data) => {
    await notificationQueue.add(
        "sendNotification",
        data,
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    );
};