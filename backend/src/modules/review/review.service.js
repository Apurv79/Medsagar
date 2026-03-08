import Review from "./review.model.js";
import Doctor from "../doctor/doctor.model.js";
import Clinic from "../clinic/clinic.model.js";
import { ApiError } from "../../utils/apiError.js";

export const createReview = async (reviewData) => {
    const { doctorId, clinicId, patientId, rating } = reviewData;

    // Verify target existence
    if (doctorId) {
        const dQuery = doctorId.match(/^[0-9a-fA-F]{24}$/) ? { _id: doctorId } : { doctorId };
        const doc = await Doctor.findOne(dQuery);
        if (!doc) throw new ApiError("Doctor not found", 404);
        reviewData.doctorId = doc._id;
    }

    if (clinicId) {
        const cQuery = clinicId.match(/^[0-9a-fA-F]{24}$/) ? { _id: clinicId } : { clinicId };
        const cl = await Clinic.findOne(cQuery);
        if (!cl) throw new ApiError("Clinic not found", 404);
        reviewData.clinicId = cl._id;
    }


    const review = await Review.create(reviewData);

    // Async recalculate ratings (don't block)
    if (doctorId) updateTargetStats(doctorId, "DOCTOR").catch(console.error);
    if (clinicId) updateTargetStats(clinicId, "CLINIC").catch(console.error);

    return review;
};

export const updateReview = async (reviewId, patientId, data) => {
    const review = await Review.findOneAndUpdate(
        { _id: reviewId, patientId },
        data,
        { returnDocument: "after" }
    );

    if (!review) throw new ApiError("Review not found or unauthorized", 404);

    if (review.doctorId) updateTargetStats(review.doctorId, "DOCTOR").catch(console.error);
    if (review.clinicId) updateTargetStats(review.clinicId, "CLINIC").catch(console.error);

    return review;
};

export const deleteReview = async (reviewId, patientId) => {
    const review = await Review.findOneAndDelete({ _id: reviewId, patientId });
    if (!review) throw new ApiError("Review not found or unauthorized", 401);

    if (review.doctorId) updateTargetStats(review.doctorId, "DOCTOR").catch(console.error);
    if (review.clinicId) updateTargetStats(review.clinicId, "CLINIC").catch(console.error);

    return review;
};

export const getReviewStats = async (targetId) => {
    let internalId = targetId;
    if (!targetId.match(/^[0-9a-fA-F]{24}$/)) {
        const doc = await Doctor.findOne({ doctorId: targetId });
        if (doc) internalId = doc._id;
        else {
            const cl = await Clinic.findOne({ clinicId: targetId });
            if (cl) internalId = cl._id;
            else throw new ApiError("Target not found", 404);
        }
    }

    const stats = await Review.aggregate([
        { $match: { $or: [{ doctorId: internalId }, { clinicId: internalId }] } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 }
            }
        }
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalCount = 0;
    let sumRating = 0;

    stats.forEach(s => {
        distribution[s._id] = s.count;
        totalCount += s.count;
        sumRating += s._id * s.count;
    });

    return {
        averageRating: totalCount > 0 ? (sumRating / totalCount).toFixed(1) : 0,
        totalReviews: totalCount,
        distribution
    };
};

export const getDoctorReviews = async (doctorId) => {
    const dQuery = doctorId.match(/^[0-9a-fA-F]{24}$/) ? { _id: doctorId } : { doctorId };
    const doc = await Doctor.findOne(dQuery);
    if (!doc) throw new ApiError("Doctor not found", 404);

    return Review.find({ doctorId: doc._id })
        .populate("patientId", "name avatar")
        .sort({ createdAt: -1 })
        .lean();
};

export const getClinicReviews = async (clinicId) => {
    const cQuery = clinicId.match(/^[0-9a-fA-F]{24}$/) ? { _id: clinicId } : { clinicId };
    const cl = await Clinic.findOne(cQuery);
    if (!cl) throw new ApiError("Clinic not found", 404);

    return Review.find({ clinicId: cl._id })
        .populate("patientId", "name avatar")
        .sort({ createdAt: -1 })
        .lean();
};

/* --- UTILS --- */

async function updateTargetStats(targetId, type) {
    const match = type === "DOCTOR" ? { doctorId: targetId } : { clinicId: targetId };
    const stats = await Review.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                avg: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);

    const avg = stats.length > 0 ? stats[0].avg : 0;
    const count = stats.length > 0 ? stats[0].count : 0;

    if (type === "DOCTOR") {
        await Doctor.updateOne({ _id: targetId }, { ratingAverage: avg, reviewCount: count });
    } else {
        await Clinic.updateOne({ _id: targetId }, { ratingAverage: avg, reviewCount: count });
    }
}