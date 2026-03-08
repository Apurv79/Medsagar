import mongoose from "mongoose";

const specializationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        slug: {
            type: String,
            index: true
        },
        icon: String,
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        // Used for popularity rankings
        searchCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Text index for better search
specializationSchema.index({ name: "text" });

export default mongoose.model("Specialization", specializationSchema);