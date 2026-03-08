import * as doctorService from "./doctor.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";

// Helper to ensure doctor only updates their own profile
const checkOwnership = (req) => {
    if (req.user.role === "DOCTOR" && req.params.doctorId !== req.user.userId && req.params.doctorId !== req.user._id) {
        // We will allow the service to handle the ID query, but we still want to ensure they aren't spoofing another doctor's DOC ID
        // Simplified: The service will find the doctor by doctorId, _id or userId. 
        // We will trust the service's getIdQuery for search, but for ownership, we'll check if the found doctor belongs to the logged in user.
    }
};

export const create = asyncHandler(async (req, res) => {
    const doctor = await doctorService.createDoctor(req.body);
    return ApiResponse.success(res, "Doctor profile created", doctor);
});

export const getOne = asyncHandler(async (req, res) => {
    const doctor = await doctorService.getDoctorById(req.params.doctorId);
    return ApiResponse.success(res, "Doctor fetched", doctor);
});

export const update = asyncHandler(async (req, res) => {
    const doctor = await doctorService.updateDoctor(req.params.doctorId, req.body);
    return ApiResponse.success(res, "Doctor updated", doctor);
});

export const activate = asyncHandler(async (req, res) => {
    const doctor = await doctorService.toggleActivation(req.params.doctorId, true);
    return ApiResponse.success(res, "Doctor activated", doctor);
});

export const deactivate = asyncHandler(async (req, res) => {
    const doctor = await doctorService.toggleActivation(req.params.doctorId, false);
    return ApiResponse.success(res, "Doctor deactivated", doctor);
});

export const setLeave = asyncHandler(async (req, res) => {
    const doctor = await doctorService.manageLeave(req.params.doctorId, req.body, "add");
    return ApiResponse.success(res, "Leave added", doctor);
});

export const cancelLeave = asyncHandler(async (req, res) => {
    const doctor = await doctorService.manageLeave(req.params.doctorId, { leaveId: req.params.leaveId }, "remove");
    return ApiResponse.success(res, "Leave cancelled", doctor);
});

export const setOnline = asyncHandler(async (req, res) => {
    const doctor = await doctorService.updateOnlineStatus(req.params.doctorId, true);
    return ApiResponse.success(res, "Doctor is now online", doctor);
});

export const setOffline = asyncHandler(async (req, res) => {
    const doctor = await doctorService.updateOnlineStatus(req.params.doctorId, false);
    return ApiResponse.success(res, "Doctor is now offline", doctor);
});

export const getStats = asyncHandler(async (req, res) => {
    const stats = await doctorService.getDoctorStats(req.params.doctorId);
    return ApiResponse.success(res, "Doctor stats fetched", stats);
});

export const verifyLicense = asyncHandler(async (req, res) => {
    const doctor = await doctorService.verifyLicense(req.params.doctorId, req.body.status);
    return ApiResponse.success(res, "License verification updated", doctor);
});

export const feature = asyncHandler(async (req, res) => {
    const doctor = await doctorService.toggleFeatured(req.params.doctorId, req.body.featured);
    return ApiResponse.success(res, "Doctor featured status updated", doctor);
});

export const getProfileScore = asyncHandler(async (req, res) => {
    const doctor = await doctorService.getDoctorById(req.params.doctorId);
    return ApiResponse.success(res, "Profile score fetched", {
        score: doctor?.profileCompleteness || 0
    });
});

export const updateFees = asyncHandler(async (req, res) => {
    const doctor = await doctorService.updateFees(req.params.doctorId, req.body.fees);
    return ApiResponse.success(res, "Fees updated", doctor);
});

export const updateTypes = asyncHandler(async (req, res) => {
    const doctor = await doctorService.updateConsultationTypes(req.params.doctorId, req.body.types);
    return ApiResponse.success(res, "Consultation types updated", doctor);
});

export const updateLangs = asyncHandler(async (req, res) => {
    const doctor = await doctorService.updateLanguages(req.params.doctorId, req.body.languages);
    return ApiResponse.success(res, "Languages updated", doctor);
});

export const updateAvailability = asyncHandler(async (req, res) => {
    const doctor = await doctorService.updateAvailability(req.params.doctorId, req.body.availability);
    return ApiResponse.success(res, "Availability updated", doctor);
});

export const getLeave = asyncHandler(async (req, res) => {
    const leaves = await doctorService.getLeaveCalendar(req.params.doctorId);
    return ApiResponse.success(res, "Leave calendar fetched", leaves);
});