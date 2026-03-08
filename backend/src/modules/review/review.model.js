import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            index: true,
            sparse: true
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            index: true,
            sparse: true
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            unique: true, // Prevent duplicate reviews for same appointment
            sparse: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            index: true
        },
        review: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        }
    },
    { timestamps: true }
);

// Compound index for faster filtering
reviewSchema.index({ doctorId: 1, rating: -1 });
reviewSchema.index({ clinicId: 1, rating: -1 });

export default mongoose.model("Review", reviewSchema);
