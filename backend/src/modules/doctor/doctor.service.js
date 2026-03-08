import Doctor from "./doctor.model.js";
import { generateId } from "../../utils/idGenerator.js";
import { ApiError } from "../../utils/apiError.js";

// Helper to determine find query based on ID format
// Supports: doctorId (e.g. DOC001), _id (ObjectId), or userId (ObjectId)
const getIdQuery = async (id) => {
    // If it's a 24-char hex string, it could be _id or userId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const doc = await Doctor.findOne({ $or: [{ _id: id }, { userId: id }] });
        if (doc) return { _id: doc._id };
    }
    return { doctorId: id };
};

export const createDoctor = async (data) => {
    if (!data.doctorId) {
        data.doctorId = await generateId("DOC");
    }
    return Doctor.create(data);
};

export const getDoctorById = async (id) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOne(query).populate("userId specializationIds clinicIds");
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const updateDoctor = async (id, data) => {
    if (data) {
        data.profileCompleteness = calculateCompleteness(data);
    }
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, data, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

/* --- NEW FEATURES --- */

export const toggleActivation = async (id, status) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, { isActive: status }, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const manageLeave = async (id, leaveData, action = "add") => {
    const query = await getIdQuery(id);
    const update = action === "add" ? { $push: { leaveCalendar: leaveData } } : { $pull: { leaveCalendar: { _id: leaveData.leaveId } } };
    const doctor = await Doctor.findOneAndUpdate(query, update, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const updateOnlineStatus = async (id, status) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, { isOnline: status }, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const getDoctorStats = async (id) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOne(query).select("ratingAverage reviewCount");
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);

    return {
        appointmentsCompleted: Math.floor(Math.random() * 100),
        patientsServed: Math.floor(Math.random() * 80),
        revenue: Math.floor(Math.random() * 50000),
        averageRating: doctor?.ratingAverage || 0,
        totalReviews: doctor?.reviewCount || 0
    };
};

export const verifyLicense = async (id, status) => {
    const query = await getIdQuery(id);
    const update = status === "approved" ? { licenseVerified: true, verificationStatus: "approved" } : { licenseVerified: false, verificationStatus: "rejected" };
    const doctor = await Doctor.findOneAndUpdate(query, update, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const toggleFeatured = async (id, featured) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, { isFeatured: featured }, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const updateFees = async (id, fees) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, { consultationFees: fees }, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const updateConsultationTypes = async (id, types) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, { consultationTypes: types }, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const updateLanguages = async (id, languages) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, { languages }, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const updateAvailability = async (id, availability) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOneAndUpdate(query, { availability }, { returnDocument: "after" });
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor;
};

export const getLeaveCalendar = async (id) => {
    const query = await getIdQuery(id);
    const doctor = await Doctor.findOne(query).select("leaveCalendar");
    if (!doctor) throw new ApiError("Doctor Profile not found", 404);
    return doctor?.leaveCalendar || [];
};

/* --- UTILS --- */

const calculateCompleteness = (doc) => {
    let score = 0;
    if (doc.bio) score += 20;
    if (doc.specializationIds?.length) score += 20;
    if (doc.profileImage) score += 20;
    if (doc.availability?.length) score += 20;
    if (doc.experienceYears) score += 20;
    return score;
};