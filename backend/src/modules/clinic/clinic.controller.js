import * as clinicService from "./clinic.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const clinic = await clinicService.createClinic({ ...req.body, adminUserId: req.user.userId });
    return ApiResponse.success(res, "Clinic created", clinic);
});

export const getOne = asyncHandler(async (req, res) => {
    const clinic = await clinicService.getClinicById(req.params.clinicId);
    return ApiResponse.success(res, "Clinic fetched", clinic);
});

export const list = asyncHandler(async (req, res) => {
    const clinics = await clinicService.listClinics(req.query);
    return ApiResponse.success(res, "Clinics fetched", clinics);
});

/* --- NEW CONTROLLERS --- */

export const addDoctor = asyncHandler(async (req, res) => {
    const clinic = await clinicService.addDoctorToClinic(req.params.clinicId, req.params.doctorId);
    return ApiResponse.success(res, "Doctor added to clinic", clinic);
});

export const removeDoctor = asyncHandler(async (req, res) => {
    const clinic = await clinicService.removeDoctorFromClinic(req.params.clinicId, req.params.doctorId);
    return ApiResponse.success(res, "Doctor removed from clinic", clinic);
});

export const updateHours = asyncHandler(async (req, res) => {
    const clinic = await clinicService.updateClinicHours(req.params.clinicId, req.body.hours);
    return ApiResponse.success(res, "Operating hours updated", clinic);
});

export const addImage = asyncHandler(async (req, res) => {
    const clinic = await clinicService.addClinicImage(req.params.clinicId, req.body.url, req.body.isPrimary);
    return ApiResponse.success(res, "Image added", clinic);
});

export const removeImage = asyncHandler(async (req, res) => {
    const clinic = await clinicService.removeClinicImage(req.params.clinicId, req.params.imageId);
    return ApiResponse.success(res, "Image removed", clinic);
});

export const manageServices = asyncHandler(async (req, res) => {
    const clinic = await clinicService.manageServices(req.params.clinicId, req.body.services);
    return ApiResponse.success(res, "Services updated", clinic);
});

export const addStaff = asyncHandler(async (req, res) => {
    const clinic = await clinicService.manageStaff(req.params.clinicId, req.body.userId, "add");
    return ApiResponse.success(res, "Staff added", clinic);
});

export const removeStaff = asyncHandler(async (req, res) => {
    const clinic = await clinicService.manageStaff(req.params.clinicId, req.params.userId, "remove");
    return ApiResponse.success(res, "Staff removed", clinic);
});

export const verify = asyncHandler(async (req, res) => {
    const clinic = await clinicService.verifyClinic(req.params.clinicId, req.body.status);
    return ApiResponse.success(res, "Clinic verification updated", clinic);
});

export const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await clinicService.getClinicDoctors(req.params.clinicId);
    return ApiResponse.success(res, "Clinic doctors fetched", doctors);
});

export const getStaff = asyncHandler(async (req, res) => {
    const staff = await clinicService.getClinicStaff(req.params.clinicId);
    return ApiResponse.success(res, "Clinic staff fetched", staff);
});

export const getServices = asyncHandler(async (req, res) => {
    const services = await clinicService.getClinicServices(req.params.clinicId);
    return ApiResponse.success(res, "Clinic services fetched", services);
});

export const getHours = asyncHandler(async (req, res) => {
    const hours = await clinicService.getClinicOperatingHours(req.params.clinicId);
    return ApiResponse.success(res, "Clinic hours fetched", hours);
});

export const getImages = asyncHandler(async (req, res) => {
    const images = await clinicService.getClinicImages(req.params.clinicId);
    return ApiResponse.success(res, "Clinic images fetched", images);
});