/**
 * Admin Configuration Constants
 */

export const ADMIN_CONFIG_KEYS = {
    DOCTOR_COMMISSION_PERCENT: "DOCTOR_COMMISSION_PERCENT",
    REFERRAL_REWARD_AMOUNT: "REFERRAL_REWARD_AMOUNT",
    APPOINTMENT_CANCELLATION_HOURS: "APPOINTMENT_CANCELLATION_HOURS",
    MAX_REPORT_STORAGE_MB: "MAX_REPORT_STORAGE_MB",
    SOS_RADIUS_KM: "SOS_RADIUS_KM",
    FEATURE_CHAT_ENABLED: "FEATURE_CHAT_ENABLED",
    FEATURE_VIDEO_CONSULTATION_ENABLED: "FEATURE_VIDEO_CONSULTATION_ENABLED"
};

export const DEFAULT_CONFIGS = [
    { key: "DOCTOR_COMMISSION_PERCENT", value: 20, description: "Commission percentage for platform" },
    { key: "REFERRAL_REWARD_AMOUNT", value: 50, description: "Wallet credit for each successful referral" },
    { key: "APPOINTMENT_CANCELLATION_HOURS", value: 24, description: "Hours before appointment to allow free cancellation" },
    { key: "MAX_REPORT_STORAGE_MB", value: 100, description: "Maximum storage per patient for medical reports" },
    { key: "SOS_RADIUS_KM", value: 5, description: "Radius to search for doctors during SOS" },
    { key: "FEATURE_CHAT_ENABLED", value: true, description: "Enable/Disable consultation chat" },
    { key: "FEATURE_VIDEO_CONSULTATION_ENABLED", value: true, description: "Enable/Disable video consultation" }
];
