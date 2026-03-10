import eventBus from "../../utils/eventBus.js";
import * as notificationService from "./notification.service.js";
import { NOTIFICATION_TYPES } from "./notification.constants.js";
import logger from "../../utils/logger.js";

const initNotificationListener = () => {
    logger.info("Notification Listener Initialized");

    // Appointment Booked
    eventBus.on("appointment.booked", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.userId,
                title: "Appointment Booked",
                message: `Your appointment with Dr. ${data.doctorName} has been booked for ${data.date} at ${data.time}.`,
                type: NOTIFICATION_TYPES.APPOINTMENT_BOOKED,
                data: { appointmentId: data.appointmentId }
            });
        } catch (error) {
            logger.error("Error in appointment.booked listener:", error);
        }
    });

    // Appointment Reminder
    eventBus.on("appointment.reminder", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.userId,
                title: "Appointment Reminder",
                message: `Reminder: Your appointment with Dr. ${data.doctorName} is scheduled for today at ${data.time}.`,
                type: NOTIFICATION_TYPES.APPOINTMENT_REMINDER,
                data: { appointmentId: data.appointmentId }
            });
        } catch (error) {
            logger.error("Error in appointment.reminder listener:", error);
        }
    });

    // Consultation Started
    eventBus.on("consultation.started", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.userId,
                title: "Consultation Started",
                message: `Your consultation with Dr. ${data.doctorName} has started. Click to join.`,
                type: NOTIFICATION_TYPES.CONSULTATION_STARTED,
                data: { consultationId: data.consultationId, callToken: data.callToken }
            });
        } catch (error) {
            logger.error("Error in consultation.started listener:", error);
        }
    });

    // Prescription Created
    eventBus.on("prescription.created", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.userId,
                title: "Prescription Uploaded",
                message: `Dr. ${data.doctorName} has uploaded a new prescription for your consultation.`,
                type: NOTIFICATION_TYPES.PRESCRIPTION_CREATED,
                data: { prescriptionId: data.prescriptionId }
            });
        } catch (error) {
            logger.error("Error in prescription.created listener:", error);
        }
    });

    // Wallet Credit
    eventBus.on("wallet.credit", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.userId,
                title: "Wallet Credited",
                message: `Your wallet has been credited with ₹${data.amount}. Total balance: ₹${data.balance}.`,
                type: NOTIFICATION_TYPES.WALLET_CREDIT,
                data: { transactionId: data.transactionId }
            });
        } catch (error) {
            logger.error("Error in wallet.credit listener:", error);
        }
    });

    // Wallet Debit
    eventBus.on("wallet.debit", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.userId,
                title: "Wallet Debited",
                message: `₹${data.amount} has been debited from your wallet. Total balance: ₹${data.balance}.`,
                type: NOTIFICATION_TYPES.WALLET_DEBIT,
                data: { transactionId: data.transactionId }
            });
        } catch (error) {
            logger.error("Error in wallet.debit listener:", error);
        }
    });

    // Referral Rewarded
    eventBus.on("referral.rewarded", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.userId,
                title: "Referral Reward!",
                message: `Congratulations! You've received ₹${data.reward} for referring ${data.refereeName}.`,
                type: NOTIFICATION_TYPES.REFERRAL_REWARDED,
                data: { refereeId: data.refereeId }
            });
        } catch (error) {
            logger.error("Error in referral.rewarded listener:", error);
        }
    });

    // SOS Triggered
    eventBus.on("sos.triggered", async (data) => {
        try {
            // Typically SOS alerts might go to multiple users (nearby doctors)
            // For now, we assume data.userId is the target (e.g., patient or doctor)
            await notificationService.createNotification({
                userId: data.userId,
                title: "⚠️ SOS Emergency Alert",
                message: `An emergency alert has been triggered near ${data.location}. Urgent assistance may be needed.`,
                type: NOTIFICATION_TYPES.SOS_ALERT,
                data: { sosId: data.sosId, urgent: true }
            });
        } catch (error) {
            logger.error("Error in sos.triggered listener:", error);
        }
    });

    // Chat Message
    eventBus.on("chat.message", async (data) => {
        try {
            await notificationService.createNotification({
                userId: data.receiverId,
                title: `New message from ${data.senderName}`,
                message: data.message,
                type: NOTIFICATION_TYPES.CHAT_MESSAGE,
                data: { chatId: data.chatId, senderId: data.senderId }
            });
        } catch (error) {
            logger.error("Error in chat.message listener:", error);
        }
    });
};

export default initNotificationListener;
