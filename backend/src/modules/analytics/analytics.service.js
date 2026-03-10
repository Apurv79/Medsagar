import User from "../user/user.model.js";
import Appointment from "../appointment/appointment.model.js";
import WalletTransaction from "../wallet/walletTransaction.model.js";
import Referral from "../referral/referral.model.js";
import { TRANSACTION_TYPES } from "../wallet/wallet.constants.js";

/**
 * Platform Overview Metrics
 */
export const getDashboardOverview = async () => {
    const [totalUsers, totalAppointments, completedConsultations, revenueRes] = await Promise.all([
        User.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: "completed" }),
        WalletTransaction.aggregate([
            { $match: { type: TRANSACTION_TYPES.CONSULTATION_PAYMENT } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
    ]);

    return {
        totalUsers,
        totalAppointments,
        completedConsultations,
        totalRevenue: revenueRes[0]?.total || 0
    };
};

/**
 * User Growth over time
 */
export const getUserGrowth = async () => {
    return User.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
};

/**
 * Revenue Analytics (Monthly)
 */
export const getRevenueAnalytics = async () => {
    return WalletTransaction.aggregate([
        { $match: { type: TRANSACTION_TYPES.CONSULTATION_PAYMENT } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                revenue: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
};

/**
 * Doctor Earnings from Appointments
 */
export const getDoctorEarnings = async () => {
    return Appointment.aggregate([
        { $match: { status: "completed" } },
        {
            $group: {
                _id: "$doctorId",
                consultations: { $sum: 1 }
                // Note: Actual earning logic might involve fee * %
            }
        }
    ]);
};

/**
 * Appointment Status Breakdown
 */
export const getAppointmentStats = async () => {
    return Appointment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
};

/**
 * Metrics for the Current Day
 */
export const getTodayMetrics = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [newUsers, appointments, consultations, revenue] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: today } }),
        Appointment.countDocuments({ createdAt: { $gte: today } }),
        Appointment.countDocuments({ status: "completed", updatedAt: { $gte: today } }),
        WalletTransaction.aggregate([
            {
                $match: {
                    type: TRANSACTION_TYPES.CONSULTATION_PAYMENT,
                    createdAt: { $gte: today }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
    ]);

    return {
        newUsers,
        appointments,
        consultations,
        revenue: revenue[0]?.total || 0
    };
};

/**
 * Top Performing Doctors
 */
export const getTopDoctors = async () => {
    return Appointment.aggregate([
        { $match: { status: "completed" } },
        {
            $group: {
                _id: "$doctorId",
                consultations: { $sum: 1 }
            }
        },
        { $sort: { consultations: -1 } },
        { $limit: 10 }
    ]);
};

/**
 * Breakdown by Consultation Mode
 */
export const getConsultationModes = async () => {
    return Appointment.aggregate([
        {
            $group: {
                _id: "$consultationType",
                count: { $sum: 1 }
            }
        }
    ]);
};

/**
 * Referral Metrics
 */
export const getReferralAnalytics = async () => {
    const [total, successful] = await Promise.all([
        Referral.countDocuments(),
        Referral.countDocuments({ status: "completed" })
    ]);

    return {
        totalReferrals: total,
        successfulReferrals: successful
    };
};

/**
 * Platform Wallet Metrics
 */
export const getWalletAnalytics = async () => {
    const [topups, refunds] = await Promise.all([
        WalletTransaction.countDocuments({ type: TRANSACTION_TYPES.WALLET_TOPUP }),
        WalletTransaction.countDocuments({ type: TRANSACTION_TYPES.REFUND })
    ]);

    return {
        topups,
        refunds
    };
};