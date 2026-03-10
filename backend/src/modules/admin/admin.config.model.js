import mongoose from "mongoose";

const adminConfigSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("AdminConfig", adminConfigSchema);