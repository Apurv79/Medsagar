import Doctor from "../doctor/doctor.model.js";
import Clinic from "../clinic/clinic.model.js";
import { ApiError } from "../../utils/apiError.js";

export const searchDoctors = async (filters) => {
    const {
        city,
        specialization,
        consultationType,
        maxFee,
        minRating,
        q,
        page = 1,
        limit = 10
    } = filters;

    const query = {
        isActive: true,
        verificationStatus: "approved"
    };

    // Geo / City filter
    if (city) {
        query["location"] = { $exists: true }; // Simplified for now, or use specific city field if added
    }

    if (specialization) {
        query.specializationIds = specialization;
    }

    if (consultationType) {
        query[`consultationTypes.${consultationType}`] = true;
    }

    if (maxFee) {
        query[`consultationFees.${consultationType || 'video'}`] = { $lte: Number(maxFee) };
    }

    if (minRating) {
        query.ratingAverage = { $gte: Number(minRating) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const doctors = await Doctor.find(query)
        .populate("userId", "name avatar bio")
        .populate("specializationIds", "name icon")
        .sort({ isFeatured: -1, ratingAverage: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    const total = await Doctor.countDocuments(query);

    return { doctors, total, page: Number(page), limit: Number(limit) };
};

export const getTopRatedDoctors = async () => {
    return Doctor.find({ isActive: true, verificationStatus: "approved" })
        .populate("userId", "name avatar")
        .populate("specializationIds", "name")
        .sort({ ratingAverage: -1, reviewCount: -1 })
        .limit(10)
        .lean();
};

export const getTrendingDoctors = async () => {
    // Logic: recently joined or high booking frequency (mocked for now)
    return Doctor.find({ isActive: true, verificationStatus: "approved" })
        .populate("userId", "name avatar")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
};

export const findNearbyDoctors = async (lng, lat, maxDistance = 10000) => {
    if (!lng || !lat) throw new ApiError("Coordinates are required", 400);

    return Doctor.find({
        isActive: true,
        verificationStatus: "approved",
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                $maxDistance: Number(maxDistance)
            }
        }
    })
        .populate("userId", "name avatar")
        .limit(20)
        .lean();
};

export const getDoctorsByClinic = async (clinicId) => {
    const clinic = await Clinic.findOne({ $or: [{ _id: clinicId }, { clinicId }] });
    if (!clinic) throw new ApiError("Clinic not found", 404);

    return Doctor.find({
        clinicIds: clinic._id,
        isActive: true
    })
        .populate("userId", "name avatar")
        .populate("specializationIds", "name")
        .lean();
};