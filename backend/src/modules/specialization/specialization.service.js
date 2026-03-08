import Specialization from "./specialization.model.js";
import Doctor from "../doctor/doctor.model.js";
import { ApiError } from "../../utils/apiError.js";

export const createSpecialization = async (data) => {
    const exists = await Specialization.findOne({ name: data.name });
    if (exists) throw new ApiError("Specialization already exists", 400);
    return Specialization.create(data);
};

export const listSpecializations = async () => {
    return Specialization.find({ isActive: true }).sort({ name: 1 }).lean();
};

export const updateSpecialization = async (id, data) => {
    const spec = await Specialization.findByIdAndUpdate(id, data, { returnDocument: "after" });
    if (!spec) throw new ApiError("Specialization not found", 404);
    return spec;
};

export const deleteSpecialization = async (id) => {
    const spec = await Specialization.findByIdAndDelete(id);
    if (!spec) throw new ApiError("Specialization not found", 404);
    return spec;
};

/* --- FEATURES --- */

export const getSpecializationDoctors = async (id, query = {}) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const doctors = await Doctor.find({
        specializationIds: id,
        isActive: true,
        verificationStatus: "approved"
    })
        .populate("userId", "name avatar")
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Doctor.countDocuments({
        specializationIds: id,
        isActive: true,
        verificationStatus: "approved"
    });

    return { doctors, total, page: Number(page), limit: Number(limit) };
};

export const getPopularSpecializations = async () => {
    return Specialization.find({ isActive: true })
        .sort({ searchCount: -1 })
        .limit(8)
        .lean();
};

export const searchSpecializations = async (q) => {
    if (!q) return [];

    // Update search count for popularity tracking (background)
    Specialization.updateMany(
        { name: { $regex: q, $options: "i" } },
        { $inc: { searchCount: 1 } }
    ).catch(err => console.error("Spec search count error:", err));

    return Specialization.find({
        name: { $regex: q, $options: "i" },
        isActive: true
    }).limit(10).lean();
};