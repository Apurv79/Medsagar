import * as specService from "./specialization.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const spec = await specService.createSpecialization(req.body);
    return ApiResponse.success(res, "Specialization created", spec);
});

export const list = asyncHandler(async (req, res) => {
    const specs = await specService.listSpecializations();
    return ApiResponse.success(res, "Specializations fetched", specs);
});

/* --- NEW CONTROLLERS --- */

export const getSpecDoctors = asyncHandler(async (req, res) => {
    const result = await specService.getSpecializationDoctors(req.params.id, req.query);
    return ApiResponse.success(res, "Doctors fetched for specialization", result);
});

export const getPopular = asyncHandler(async (req, res) => {
    const result = await specService.getPopularSpecializations();
    return ApiResponse.success(res, "Popular specializations fetched", result);
});

export const search = asyncHandler(async (req, res) => {
    const result = await specService.searchSpecializations(req.query.q);
    return ApiResponse.success(res, "Search results fetched", result);
});

export const update = asyncHandler(async (req, res) => {
    const spec = await specService.updateSpecialization(req.params.id, req.body);
    return ApiResponse.success(res, "Specialization updated", spec);
});

export const remove = asyncHandler(async (req, res) => {
    await specService.deleteSpecialization(req.params.id);
    return ApiResponse.success(res, "Specialization deleted");
});