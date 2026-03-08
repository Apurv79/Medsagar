import * as service from "./consultation.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const startConsultation = asyncHandler(async (req, res) => {
  const data = await service.startConsultation(
    req.body.appointmentId,
    req.user.userId || req.user._id
  );
  return ApiResponse.success(res, "Consultation started", data);
});

export const joinConsultation = asyncHandler(async (req, res) => {
  const role = req.user.role === "DOCTOR" ? "doctor" : "patient";

  const data = await service.joinConsultation(
    req.body.consultationId,
    req.user.userId || req.user._id,
    role
  );
  return ApiResponse.success(res, "Joined consultation", data);
});

export const endConsultation = asyncHandler(async (req, res) => {
  const data = await service.endConsultation(req.body.consultationId);
  return ApiResponse.success(res, "Consultation ended", data);
});

export const getConsultation = asyncHandler(async (req, res) => {
  const data = await service.getConsultationById(req.params.id);
  return ApiResponse.success(res, "Consultation details fetched", data);
});

export const getConsultationByAppointment = asyncHandler(async (req, res) => {
  const data = await service.getConsultationByAppointment(
    req.params.appointmentId
  );
  return ApiResponse.success(res, "Consultation fetched", data);
});

export const getDoctorConsultations = asyncHandler(async (req, res) => {
  const data = await service.getDoctorConsultations(req.user.userId || req.user._id);
  return ApiResponse.success(res, "Doctor consultations fetched", data);
});

export const getPatientConsultations = asyncHandler(async (req, res) => {
  const data = await service.getPatientConsultations(req.user.userId || req.user._id);
  return ApiResponse.success(res, "Patient consultations fetched", data);
});

export const listConsultations = asyncHandler(async (req, res) => {
  const data = await service.listConsultations();
  return ApiResponse.success(res, "All consultations fetched", data);
});