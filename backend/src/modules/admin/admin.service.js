import User from "../user/user.model.js";
import Doctor from "../doctor/doctor.model.js";
import Clinic from "../clinic/clinic.model.js";
import Appointment from "../appointment/appointment.model.js";
import Payment from "../payment/payment.model.js";
import Referral from "../referral/referral.model.js";
import Storage from "../file-storage/storage.model.js";
import AdminConfig from "./admin.config.model.js";
import { hashPassword, generateRandomPassword } from "../../utils/password.js";
import { sendMail } from "../../utils/mailer.js";
import { ApiError } from "../../utils/apiError.js";

/** 
 * DOCTOR & CLINIC ONBOARDING 
 */

export const getPendingDoctors = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const doctors = await Doctor.find({ verificationStatus: "pending" })
        .populate("userId", "name email phone")
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await Doctor.countDocuments({ verificationStatus: "pending" });
    return { doctors, total, page, limit };
};

export const approveDoctor = async (doctorId) => {
    const doctor = await Doctor.findById(doctorId).populate("userId");
    if (!doctor) throw new ApiError("Doctor not found", 404);
    if (doctor.verificationStatus === "approved") throw new ApiError("Doctor already approved", 400);

    const user = doctor.userId;
    const tempPassword = generateRandomPassword(10);
    const hashedPassword = await hashPassword(tempPassword);

    // Update user with credentials and verify
    user.password = hashedPassword;
    user.isVerified = true;
    user.isActive = true;
    await user.save();

    // Update doctor status
    doctor.verificationStatus = "approved";
    doctor.isActive = true;
    await doctor.save();

    // Send Email (Async)
    try {
        await sendMail({
            to: user.email,
            subject: "Welcome to Medsagar - Your Doctor Account is Approved",
            html: `
        <h1>Congratulations Dr. ${user.name}!</h1>
        <p>Your profile has been approved by our medical board.</p>
        <p><strong>Username:</strong> ${user.userId}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please login and change your password immediately.</p>
      `
        });
    } catch (err) {
        console.error("Failed to send approval email:", err.message);
    }

    return { userId: user.userId, status: "approved" };
};

export const rejectDoctor = async (doctorId, reason) => {
    const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { verificationStatus: "rejected", isActive: false },
        { new: true }
    );
    if (!doctor) throw new ApiError("Doctor not found", 404);
    return doctor;
};

export const getPendingClinics = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const clinics = await Clinic.find({ verificationStatus: "pending" })
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await Clinic.countDocuments({ verificationStatus: "pending" });
    return { clinics, total, page, limit };
};

export const approveClinic = async (clinicId) => {
    const clinic = await Clinic.findByIdAndUpdate(
        clinicId,
        { verificationStatus: "approved", isActive: true },
        { new: true }
    );
    if (!clinic) throw new ApiError("Clinic not found", 404);
    return clinic;
};

/**
 * USER MANAGEMENT
 */

export const listUsers = async ({ role, isActive }, page = 1, limit = 20) => {
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const skip = (page - 1) * limit;
    const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await User.countDocuments(query);
    return { users, total, page, limit };
};

export const getUserById = async (id) => {
    const user = await User.findById(id).select("-password").lean();
    if (!user) throw new ApiError("User not found", 404);
    return user;
};

export const toggleUserStatus = async (id, isActive) => {
    const user = await User.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
    ).select("-password").lean();
    if (!user) throw new ApiError("User not found", 404);
    return user;
};

/**
 * MONITORING
 */

export const getAllAppointments = async (filters, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const appointments = await Appointment.find(filters)
        .populate("patientId", "name phone")
        .populate("doctorId", "userId") // Assuming Doctor ref links to a profile, we might need more joins
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await Appointment.countDocuments(filters);
    return { appointments, total, page, limit };
};

export const getAllPayments = async (filters, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const payments = await Payment.find(filters)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await Payment.countDocuments(filters);
    return { payments, total, page, limit };
};

export const getAllReports = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const reports = await Storage.find()
        .populate("userId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await Storage.countDocuments();
    return { reports, total, page, limit };
};

export const getAllReferrals = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const referrals = await Referral.find()
        .populate("referrerId", "name email")
        .populate("referredUserId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await Referral.countDocuments();
    return { referrals, total, page, limit };
};

/**
 * CONFIG MANAGEMENT
 */

export const getAllConfigs = async () => {
    return AdminConfig.find().lean();
};

export const getConfigByKey = async (key) => {
    const config = await AdminConfig.findOne({ key: key.toUpperCase() }).lean();
    if (!config) throw new ApiError("Config not found", 404);
    return config;
};

export const createOrUpdateConfig = async (data, adminId) => {
    const key = data.key.toUpperCase();
    const config = await AdminConfig.findOneAndUpdate(
        { key },
        { ...data, key, updatedBy: adminId },
        { upsert: true, new: true }
    ).lean();
    return config;
};

export const deleteConfig = async (key) => {
    const result = await AdminConfig.deleteOne({ key: key.toUpperCase() });
    if (!result.deletedCount) throw new ApiError("Config not found", 404);
    return true;
};