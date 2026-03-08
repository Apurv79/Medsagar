import * as sosService from "./sos.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// I'll check asyncHandler location. Usually utils/asyncHandler.js
export const trigger = asyncHandler(async (req, res) => {
    const sos = await sosService.createSOS({
        ...req.body,
        patientId: req.user.userId
    });
    return ApiResponse.success(res, "SOS triggered", sos);
});

export const accept = asyncHandler(async (req, res) => {
    const sos = await sosService.acceptSOS(req.params.sosId, req.user.userId);
    return ApiResponse.success(res, "SOS accepted", sos);
});

export const updateStatus = asyncHandler(async (req, res) => {
    const sos = await sosService.updateSOSStatus(req.params.sosId, req.body.status, req.user.userId);
    return ApiResponse.success(res, "SOS status updated", sos);
});

export const getById = asyncHandler(async (req, res) => {
    const sos = await sosService.getSOSById(req.params.sosId);
    return ApiResponse.success(res, "SOS details fetched", sos);
});

export const getHistory = asyncHandler(async (req, res) => {
    const history = await sosService.getSOSHistory(req.user.userId, req.user.role);
    return ApiResponse.success(res, "SOS history fetched", history);
});

export const nearbyDoctors = asyncHandler(async (req, res) => {
    const { lng, lat } = req.query;
    const doctors = await sosService.findNearbySOSDoctors([parseFloat(lng), parseFloat(lat)]);
    return ApiResponse.success(res, "Nearby doctors found", doctors);
});