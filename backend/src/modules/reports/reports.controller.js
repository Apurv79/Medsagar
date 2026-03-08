import * as service from "./reports.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const uploadReport = asyncHandler(async (req, res) => {
  const data = await service.createReport({
    patientId: req.user.userId || req.user._id,
    uploadedBy: req.user.userId || req.user._id,
    title: req.body.title,
    description: req.body.description,
    fileUrl: req.file?.path || "default.pdf",
  });
  return ApiResponse.success(res, "Report uploaded", data);
});

export const getMyReports = asyncHandler(async (req, res) => {
  const data = await service.getPatientReports(req.user.userId || req.user._id);
  return ApiResponse.success(res, "Reports fetched", data);
});

export const getReport = asyncHandler(async (req, res) => {
  const data = await service.getReport(req.params.id);
  return ApiResponse.success(res, "Report details fetched", data);
});

export const deleteReport = asyncHandler(async (req, res) => {
  const data = await service.deleteReport(req.params.id);
  return ApiResponse.success(res, "Report deleted", data);
});

export const requestAccess = asyncHandler(async (req, res) => {
  const data = await service.requestAccess(req.params.id, req.user.userId || req.user._id);
  return ApiResponse.success(res, "Access requested", data);
});

export const approveAccess = asyncHandler(async (req, res) => {
  const data = await service.approveAccess(req.params.id, req.body.doctorId);
  return ApiResponse.success(res, "Access approved", data);
});