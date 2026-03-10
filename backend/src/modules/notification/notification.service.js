import Notification from "./notification.model.js";
import User from "../user/user.model.js";
import { addNotificationJob } from "../../workers/queue/notification.queue.js";

export const createNotification = async ({
    userId,
    title,
    message,
    type,
    data
}) => {
    const notification = await Notification.create({
        userId,
        title,
        message,
        type,
        data
    });

    await addNotificationJob({
        userId,
        title,
        message,
        type,
        data
    });

    return notification;
};

export const getUserNotifications = async (userId, { page, limit }) => {
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
        .select("title message type read createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return notifications;
};

export const getUnreadCount = async (userId) => {
    return Notification.countDocuments({
        userId,
        read: false
    });
};

export const markAsRead = async (id, userId) => {
    return Notification.findOneAndUpdate(
        { _id: id, userId },
        { read: true },
        { new: true }
    ).lean();
};

export const markAllRead = async (userId) => {
    await Notification.updateMany(
        { userId, read: false },
        { read: true }
    );
};

export const registerDevice = async (userId, token) => {
    await User.updateOne(
        { _id: userId },
        { $addToSet: { fcmTokens: token } }
    );
};

export const removeDevice = async (userId, token) => {
    await User.updateOne(
        { _id: userId },
        { $pull: { fcmTokens: token } }
    );
};

export const getPreferences = async (userId) => {
    const user = await User.findById(userId)
        .select("notificationPreferences")
        .lean();

    return user?.notificationPreferences || {
        pushEnabled: true,
        smsEnabled: true,
        appointmentReminders: true,
        chatNotifications: true,
        walletUpdates: true
    };
};

export const updatePreferences = async (userId, prefs) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { notificationPreferences: prefs },
        { new: true }
    )
        .select("notificationPreferences")
        .lean();

    return user.notificationPreferences;
};