import mongoose from "mongoose";

const storageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        fileName: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            enum: ["IMAGE", "PDF"],
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        s3Key: {
            type: String,
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fileHash: {
            type: String,
            index: true
        },
        sharedWith: [
            {
                doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
                grantedAt: { type: Date, default: Date.now },
                expiresAt: { type: Date }
            }
        ]
    },
    {
        timestamps: true
    }
);

storageSchema.index({ userId: 1, createdAt: -1 });
storageSchema.index({ "sharedWith.doctorId": 1, "sharedWith.expiresAt": 1 });

export default mongoose.model("Storage", storageSchema);