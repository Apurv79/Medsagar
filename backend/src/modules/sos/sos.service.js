import SOS from "./sos.model.js";
import User from "../user/user.model.js";
import Doctor from "../doctor/doctor.model.js";
import { ApiError } from "../../utils/apiError.js";
import eventBus from "../../utils/eventBus.js";

export const createSOS = async (data) => {
    const sos = await SOS.create(data);

    // Emit event for notification
    eventBus.emit("sos.triggered", {
        userId: data.patientId, // Patient who triggered
        location: data.address || "Unknown Location",
        sosId: sos._id
    });

    return sos;
};

export const acceptSOS = async (sosId, userId) => {
    // Check if doctor profile exists for this user
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) throw new ApiError("Only verified doctors can accept SOS calls", 403);

    const sos = await SOS.findOne({ _id: sosId, status: "active" });
    if (!sos) throw new ApiError("SOS already accepted, cancelled or unavailable", 400);

    sos.doctorId = doctor._id;
    sos.status = "accepted";
    await sos.save();

    return sos;
};

export const updateSOSStatus = async (sosId, status, userId) => {
    const doctor = await Doctor.findOne({ userId });
    const query = { _id: sosId };

    // If not admin, verify it's the assigned doctor
    if (doctor) {
        query.doctorId = doctor._id;
    }

    const sos = await SOS.findOneAndUpdate(
        query,
        { status, resolvedAt: status === "completed" ? new Date() : null },
        { returnDocument: "after" }
    );

    if (!sos) throw new ApiError("SOS not found or unauthorized", 404);
    return sos;
};

export const getSOSById = async (id) => {
    const sos = await SOS.findById(id)
        .populate("patientId", "name phone avatar")
        .populate("doctorId", "userId name phone avatar");

    if (!sos) throw new ApiError("SOS not found", 404);
    return sos;
};

export const getSOSHistory = async (userId, role) => {
    let query = {};
    if (role === "PATIENT") {
        query.patientId = userId;
    } else if (role === "DOCTOR") {
        const doctor = await Doctor.findOne({ userId });
        if (!doctor) return [];
        query.doctorId = doctor._id;
    }

    return SOS.find(query)
        .populate("patientId", "name phone")
        .populate("doctorId", "name")
        .sort({ createdAt: -1 })
        .lean();
};

export const findNearbySOSDoctors = async (coordinates) => {
    if (!coordinates || coordinates.length !== 2) {
        throw new ApiError("Valid coordinates [lng, lat] required", 400);
    }

    // Find DOCTOR profiles with 2dsphere index compatibility
    return Doctor.find({
        isActive: true,
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: coordinates.map(Number) },
                $maxDistance: 5000 // 5km radius
            }
        }
    }).populate("userId", "name phone avatar").select("location");
};