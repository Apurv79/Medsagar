import * as service from "./notification.service.js";
import apiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const notifications = await service.getUserNotifications(
        req.user.userId,
        { page: Number(page), limit: Number(limit) }
    );

    return apiResponse.success(res, notifications);
});

export const unreadCount = asyncHandler(async (req, res) => {
    const count = await service.getUnreadCount(req.user.userId);
    return apiResponse.success(res, { count });
});

export const markRead = asyncHandler(async (req, res) => {
    await service.markAsRead(req.params.id, req.user.userId);
    return apiResponse.success(res, "Notification updated");
});

export const markAllRead = asyncHandler(async (req, res) => {
    await service.markAllRead(req.user.userId);
    return apiResponse.success(res, "All notifications marked read");
});

export const registerDevice = asyncHandler(async (req, res) => {
    const { token } = req.body;
    await service.registerDevice(req.user.userId, token);
    return apiResponse.success(res, "Device registered");
});

export const removeDevice = asyncHandler(async (req, res) => {
    const { token } = req.body;
    await service.removeDevice(req.user.userId, token);
    return apiResponse.success(res, "Device removed");
});

export const getPreferences = asyncHandler(async (req, res) => {
    const prefs = await service.getPreferences(req.user.userId);
    return apiResponse.success(res, prefs);
});

export const updatePreferences = asyncHandler(async (req, res) => {
    const prefs = await service.updatePreferences(req.user.userId, req.body);
    return apiResponse.success(res, prefs);
});