import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import * as provider from "./storage.provider.js";
import Storage from "./storage.model.js";
import Appointment from "../appointment/appointment.model.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * Convert Image Buffer to PDF Buffer
 */
const convertImageToPDF = async (imageBuffer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ autoFirstPage: false });
            const chunks = [];

            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", (err) => reject(err));

            const image = sharp(imageBuffer);
            const metadata = await image.metadata();

            doc.addPage({ size: [metadata.width, metadata.height] });
            doc.image(imageBuffer, 0, 0, { width: metadata.width, height: metadata.height });
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Calculate SHA256 Hash
 */
const calculateHash = (buffer) => {
    return crypto.createHash("sha256").update(buffer).digest("hex");
};

/**
 * Handle File Upload
 */
export const uploadFile = async ({ userId, file, folder }) => {
    const hash = calculateHash(file.buffer);

    // 1. File Deduplication
    const existingFile = await Storage.findOne({ userId, fileHash: hash }).lean();
    if (existingFile) {
        return existingFile;
    }

    // 2. Storage Limit Check (100MB)
    const totalUsed = await Storage.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$size" } } }
    ]);
    const usedBytes = totalUsed.length > 0 ? totalUsed[0].total : 0;
    if (usedBytes + file.size > 100 * 1024 * 1024) {
        throw new ApiError("Storage limit of 100MB exceeded", 400);
    }

    let buffer = file.buffer;
    let mimeType = file.mimetype;
    let fileName = `${Date.now()}_${uuidv4().substring(0, 8)}_${file.originalname}`;
    let finalFileName = fileName;

    // 3. Auto-convert images to PDF
    if (mimeType.startsWith("image/")) {
        try {
            buffer = await convertImageToPDF(file.buffer);
            mimeType = "application/pdf";
            finalFileName = fileName.replace(/\.(jpg|jpeg|png)$/i, ".pdf");
            if (!finalFileName.endsWith(".pdf")) finalFileName += ".pdf";
        } catch (error) {
            throw new ApiError("Failed to convert image to PDF", 500);
        }
    }

    const s3Key = `${folder}${finalFileName}`;

    const fileUrl = await provider.uploadToS3({
        buffer,
        key: s3Key,
        contentType: mimeType
    });

    const storageRecord = await Storage.create({
        userId,
        fileName: finalFileName,
        fileType: mimeType === "application/pdf" ? "PDF" : "IMAGE",
        mimeType,
        size: buffer.length,
        s3Key: `medsagar/${s3Key}`,
        fileUrl,
        uploadedBy: userId,
        fileHash: hash
    });

    return storageRecord;
};

/**
 * Consent: Grant Access
 */
export const grantReportAccess = async (appointmentId, patientId, doctorId) => {
    const appointment = await Appointment.findById(appointmentId).lean();
    if (!appointment) throw new ApiError("Appointment not found", 404);

    // expiresAt = slotEnd + 2 hours
    const expiresAt = new Date(appointment.slotEnd.getTime() + 2 * 60 * 60 * 1000);

    await Storage.updateMany(
        { userId: patientId },
        {
            $addToSet: {
                sharedWith: {
                    doctorId,
                    appointmentId,
                    expiresAt
                }
            }
        }
    );
};

/**
 * Consent: Revoke Access
 */
export const revokeReportAccess = async (appointmentId) => {
    await Storage.updateMany(
        { "sharedWith.appointmentId": appointmentId },
        {
            $pull: {
                sharedWith: { appointmentId }
            }
        }
    );
};

/**
 * Get Doctor Accessible Reports
 */
export const getDoctorAccessibleReports = async (doctorId, appointmentId) => {
    return Storage.find({
        sharedWith: {
            $elemMatch: {
                doctorId,
                appointmentId,
                expiresAt: { $gt: new Date() }
            }
        }
    })
        .select("fileName fileType fileUrl createdAt size")
        .lean();
};

/**
 * Check Access (for Download/View Internal)
 */
export const checkReportAccess = async (reportId, userId, role) => {
    const file = await Storage.findById(reportId).lean();
    if (!file) throw new ApiError("File not found", 404);

    if (role === "SUPER_ADMIN" || role === "ADMIN") return file;

    if (file.userId.toString() === userId) return file;

    // Check if shared with doctor and not expired
    const isShared = file.sharedWith.some(share =>
        share.doctorId.toString() === userId && share.expiresAt > new Date()
    );

    if (!isShared) throw new ApiError("Access denied or consent expired", 403);

    return file;
};

/**
 * Generate Download Link
 */
export const getDownloadUrl = async (reportId, userId, role) => {
    const file = await checkReportAccess(reportId, userId, role);
    return await provider.generateSignedDownloadUrl(file.s3Key, 300);
};

/**
 * Basic Service Exports (Already present but kept for consistency)
 */
export const getUserFiles = async (userId, { page = 1, limit = 20 }) => {
    return Storage.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
};

export const deleteFile = async (id, userId) => {
    const file = await Storage.findOne({ _id: id, userId });
    if (!file) throw new ApiError("File not found or unauthorized", 404);
    await provider.deleteFromS3(file.s3Key);
    await Storage.deleteOne({ _id: id });
    return true;
};