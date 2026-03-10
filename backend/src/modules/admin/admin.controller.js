import * as service from "./admin.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * ONBOARDING
 */

export const getPendingDoctors = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await service.getPendingDoctors(Number(page) || 1, Number(limit) || 20);
    return ApiResponse.success(res, "Pending doctors list", result);
});

export const approveDoctor = asyncHandler(async (req, res) => {
    const result = await service.approveDoctor(req.params.id);
    return ApiResponse.success(res, "Doctor approved successfully", result);
});

export const rejectDoctor = asyncHandler(async (req, res) => {
    const result = await service.rejectDoctor(req.params.id, req.body.reason);
    return ApiResponse.success(res, "Doctor rejected", result);
});

export const getPendingClinics = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await service.getPendingClinics(Number(page) || 1, Number(limit) || 20);
    return ApiResponse.success(res, "Pending clinics list", result);
});

export const approveClinic = asyncHandler(async (req, res) => {
    const result = await service.approveClinic(req.params.id);
    return ApiResponse.success(res, "Clinic approved successfully", result);
});

/**
 * USER MANAGEMENT
 */

export const listUsers = asyncHandler(async (req, res) => {
    const { page, limit, role, isActive } = req.query;
    const result = await service.listUsers(
        { role, isActive: isActive !== undefined ? isActive === "true" : undefined },
        Number(page) || 1,
        Number(limit) || 20
    );
    return ApiResponse.success(res, "Users list", result);
});

export const getUserDetail = asyncHandler(async (req, res) => {
    const user = await service.getUserById(req.params.id);
    return ApiResponse.success(res, "User details", user);
});

export const toggleUserActive = asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    if (isActive === undefined) throw new ApiError("isActive field required", 400);
    const user = await service.toggleUserStatus(req.params.id, isActive);
    return ApiResponse.success(res, `User ${isActive ? "activated" : "deactivated"}`, user);
});

/**
 * MONITORING
 */

export const listAppointments = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await service.getAllAppointments(
        status ? { status } : {},
        Number(page) || 1,
        Number(limit) || 20
    );
    return ApiResponse.success(res, "All appointments", result);
});

export const listPayments = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await service.getAllPayments(
        status ? { status } : {},
        Number(page) || 1,
        Number(limit) || 20
    );
    return ApiResponse.success(res, "All payments", result);
});

export const listReports = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await service.getAllReports(Number(page) || 1, Number(limit) || 20);
    return ApiResponse.success(res, "All medical reports", result);
});

export const listReferrals = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await service.getAllReferrals(Number(page) || 1, Number(limit) || 20);
    return ApiResponse.success(res, "All referrals", result);
});

/**
 * CONFIG MANAGEMENT
 */

export const listConfigs = asyncHandler(async (req, res) => {
    const configs = await service.getAllConfigs();
    return ApiResponse.success(res, "System configurations", configs);
});

export const getConfig = asyncHandler(async (req, res) => {
    const config = await service.getConfigByKey(req.params.key);
    return ApiResponse.success(res, "Config found", config);
});

export const upsertConfig = asyncHandler(async (req, res) => {
    const config = await service.createOrUpdateConfig(req.body, req.user.userId);
    return ApiResponse.success(res, "Config saved", config);
});

export const removeConfig = asyncHandler(async (req, res) => {
    await service.deleteConfig(req.params.key);
    return ApiResponse.success(res, "Config deleted");
});