import * as discoveryService from "./discovery.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const search = asyncHandler(async (req, res) => {
    const result = await discoveryService.searchDoctors(req.query);
    return ApiResponse.success(res, "Search results fetched", result);
});

export const getTopRated = asyncHandler(async (req, res) => {
    const result = await discoveryService.getTopRatedDoctors();
    return ApiResponse.success(res, "Top rated doctors fetched", result);
});

export const getTrending = asyncHandler(async (req, res) => {
    const result = await discoveryService.getTrendingDoctors();
    return ApiResponse.success(res, "Trending doctors fetched", result);
});

export const getByClinic = asyncHandler(async (req, res) => {
    const result = await discoveryService.getDoctorsByClinic(req.params.clinicId);
    return ApiResponse.success(res, "Doctors for clinic fetched", result);
});

export const getNearby = asyncHandler(async (req, res) => {
    const { lng, lat, dist } = req.query;
    const result = await discoveryService.findNearbyDoctors(parseFloat(lng), parseFloat(lat), dist ? parseInt(dist) : undefined);
    return ApiResponse.success(res, "Nearby doctors fetched", result);
});