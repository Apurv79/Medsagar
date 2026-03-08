import mongoose from "mongoose";

const { Schema } = mongoose;

const operatingHoursSchema = new Schema({
    day: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    },
    open: String,
    close: String,
    isOpen: { type: Boolean, default: true }
}, { _id: false });

const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: Number
}, { _id: true });

const clinicSchema = new Schema(
    {
        clinicId: {
            type: String,
            unique: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        adminUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        email: String,
        phone: String,
        address: String,
        city: {
            type: String,
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
                default: [0, 0]
            }
        },
        doctorIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Doctor"
            }
        ],
        staffIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        operatingHours: [operatingHoursSchema],
        services: [serviceSchema],
        images: [{
            url: String,
            isPrimary: { type: Boolean, default: false }
        }],
        documents: [String],
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true
        },
        ratingAverage: {
            type: Number,
            default: 0,
            index: true
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        }
    },
    { timestamps: true }
);

clinicSchema.index({ location: "2dsphere" });

export default mongoose.model("Clinic", clinicSchema);