import * as service from "./storage.service.js";
import apiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import Appointment from "../appointment/appointment.model.js";

/**
 * Patient: Upload File
 */
export const upload = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError("No file uploaded", 400);

    const { folder } = req.body;
    const result = await service.uploadFile({
        userId: req.user.userId,
        file: req.file,
        folder: folder || "reports/"
    });

    return apiResponse.success(res, result, "File uploaded successfully");
});

/**
 * General: List Own Files
 */
export const list = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await service.getUserFiles(req.user.userId, {
        page: Number(page),
        limit: Number(limit)
    });
    return apiResponse.success(res, result);
});

/**
 * General: Get File Details
 */
export const getById = asyncHandler(async (req, res) => {
    const file = await service.getFileById(req.params.id, req.user.userId);
    return apiResponse.success(res, file);
});

/**
 * Patient: Delete File
 */
export const remove = asyncHandler(async (req, res) => {
    await service.deleteFile(req.params.id, req.user.userId);
    return apiResponse.success(res, null, "File deleted successfully");
});

/**
 * Patient: Grant Access to Doctor
 */
export const grantAccess = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId).lean();

    if (!appointment) throw new ApiError("Appointment not found", 404);
    if (appointment.patientId.toString() !== req.user.userId) {
        throw new ApiError("Unauthorized to grant access for this appointment", 403);
    }

    await service.grantReportAccess(appointmentId, req.user.userId, appointment.doctorId);
    return apiResponse.success(res, null, "Access granted to doctor");
});

/**
 * Patient: Revoke Access
 */
export const revokeAccess = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    await service.revokeReportAccess(appointmentId);
    return apiResponse.success(res, null, "Access revoked");
});

/**
 * Doctor: List Patient Reports (Consented)
 */
export const doctorListReports = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const reports = await service.getDoctorAccessibleReports(req.user.userId, appointmentId);
    return apiResponse.success(res, reports);
});

/**
 * Doctor: Get Consensus File
 */
export const doctorGetReport = asyncHandler(async (req, res) => {
    const file = await service.checkReportAccess(req.params.id, req.user.userId, req.user.role);
    return apiResponse.success(res, file);
});

/**
 * Downloads: Get Signed URL
 */
export const downloadFile = asyncHandler(async (req, res) => {
    const url = await service.getDownloadUrl(req.params.id, req.user.userId, req.user.role);
    return apiResponse.success(res, { downloadUrl: url });
});