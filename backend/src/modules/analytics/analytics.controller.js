import * as service from "./analytics.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";

export const dashboardOverview = asyncHandler(async (req, res) => {
    const data = await service.getDashboardOverview();
    return ApiResponse.success(res, "Dashboard overview retrieved", data);
});

export const userGrowth = asyncHandler(async (req, res) => {
    const data = await service.getUserGrowth();
    return ApiResponse.success(res, "User growth statistics", data);
});

export const revenueAnalytics = asyncHandler(async (req, res) => {
    const data = await service.getRevenueAnalytics();
    return ApiResponse.success(res, "Revenue analytics statistics", data);
});

export const doctorEarnings = asyncHandler(async (req, res) => {
    const data = await service.getDoctorEarnings();
    return ApiResponse.success(res, "Doctor earnings report", data);
});

export const appointmentStats = asyncHandler(async (req, res) => {
    const data = await service.getAppointmentStats();
    return ApiResponse.success(res, "Appointment status statistics", data);
});

export const todayMetrics = asyncHandler(async (req, res) => {
    const data = await service.getTodayMetrics();
    return ApiResponse.success(res, "Today's performance metrics", data);
});

export const topDoctors = asyncHandler(async (req, res) => {
    const data = await service.getTopDoctors();
    return ApiResponse.success(res, "Top performing doctors", data);
});

export const consultationModes = asyncHandler(async (req, res) => {
    const data = await service.getConsultationModes();
    return ApiResponse.success(res, "Consultation mode distribution", data);
});

export const referralAnalytics = asyncHandler(async (req, res) => {
    const data = await service.getReferralAnalytics();
    return ApiResponse.success(res, "Referral program analytics", data);
});

export const walletAnalytics = asyncHandler(async (req, res) => {
    const data = await service.getWalletAnalytics();
    return ApiResponse.success(res, "Platform wallet analytics", data);
});