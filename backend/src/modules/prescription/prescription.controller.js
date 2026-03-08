import * as service from "./prescription.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const createPrescription = asyncHandler(async (req, res) => {
  const data = await service.createPrescription(req.body, req.user.userId || req.user._id);
  return ApiResponse.success(res, "Prescription created", data);
});

export const updatePrescription = asyncHandler(async (req, res) => {
  const data = await service.updateDraftPrescription(
    req.params.id,
    req.body,
    req.user.userId || req.user._id
  );
  return ApiResponse.success(res, "Prescription updated", data);
});

export const finalizePrescription = asyncHandler(async (req, res) => {
  const data = await service.finalizePrescription(req.params.id, req.user.userId || req.user._id);
  return ApiResponse.success(res, "Prescription finalized", data);
});

export const getMyPrescriptions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);

  const data = await service.getPatientPrescriptions(
    req.user.userId || req.user._id,
    page,
    limit
  );
  return ApiResponse.success(res, "Prescriptions fetched", data);
});

export const getPrescription = asyncHandler(async (req, res) => {
  const data = await service.getPrescription(req.params.id);
  return ApiResponse.success(res, "Prescription fetched", data);
});