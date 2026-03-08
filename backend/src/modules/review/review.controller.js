import * as reviewService from "./review.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview({
        ...req.body,
        patientId: req.user.userId
    });
    return ApiResponse.success(res, "Review submitted", review);
});

export const update = asyncHandler(async (req, res) => {
    const review = await reviewService.updateReview(req.params.reviewId, req.user.userId, req.body);
    if (!review) return ApiResponse.error(res, "Review not found or unauthorized", 404);
    return ApiResponse.success(res, "Review updated", review);
});

export const remove = asyncHandler(async (req, res) => {
    const result = await reviewService.deleteReview(req.params.reviewId, req.user.userId);
    if (!result) return ApiResponse.error(res, "Review not found or unauthorized", 404);
    return ApiResponse.success(res, "Review deleted");
});

export const getStats = asyncHandler(async (req, res) => {
    const { targetId } = req.params;
    const result = await reviewService.getReviewStats(targetId);
    return ApiResponse.success(res, "Stats fetched", result);
});

export const getDoctorReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getDoctorReviews(req.params.doctorId);
    return ApiResponse.success(res, "Doctor reviews fetched", reviews);
});

export const getClinicReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getClinicReviews(req.params.clinicId);
    return ApiResponse.success(res, "Clinic reviews fetched", reviews);
});