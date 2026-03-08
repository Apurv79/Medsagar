import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // The doctor user
            index: true
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        status: {
            type: String,
            enum: ["active", "accepted", "completed", "cancelled", "rejected"],
            default: "active",
            index: true
        },
        emergencyType: String,
        notes: String,
        resolvedAt: Date
    },
    { timestamps: true }
);

sosSchema.index({ location: "2dsphere" });

export default mongoose.model("SOS", sosSchema);