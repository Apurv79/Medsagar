import mongoose from "mongoose";

const { Schema } = mongoose;

const availabilitySchema = new Schema(
    {
        day: {
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
            required: true
        },
        start: { type: String, required: true }, // HH:mm
        end: { type: String, required: true }, // HH:mm
        slotDuration: { type: Number, default: 30 }
    },
    { _id: true }
);

const consultationTypesSchema = new Schema(
    {
        video: { type: Boolean, default: true },
        voice: { type: Boolean, default: false },
        chat: { type: Boolean, default: false },
        physical: { type: Boolean, default: false }
    },
    { _id: false }
);

const consultationFeesSchema = new Schema(
    {
        video: { type: Number, default: 0 },
        voice: { type: Number, default: 0 },
        chat: { type: Number, default: 0 },
        physical: { type: Number, default: 0 }
    },
    { _id: false }
);

const leaveSchema = new Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: String
}, { _id: true });

const doctorSchema = new Schema(
    {
        doctorId: {
            type: String,
            unique: true,
            index: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        bio: String,
        experienceYears: {
            type: Number,
            default: 0,
            index: true
        },
        specializationIds: [{
            type: Schema.Types.ObjectId,
            ref: "Specialization",
            index: true
        }],
        clinicIds: [{
            type: Schema.Types.ObjectId,
            ref: "Clinic",
            index: true
        }],
        languages: [{
            type: String,
            index: true
        }],
        consultationTypes: consultationTypesSchema,
        consultationFees: consultationFeesSchema,
        licenseNumber: {
            type: String,
            required: true,
            index: true
        },
        licenseDocument: String,
        licenseVerified: { type: Boolean, default: false },
        degreeDocuments: [String],
        profileImage: String,
        availability: [availabilitySchema],
        leaveCalendar: [leaveSchema],
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
        isOnline: {
            type: Boolean,
            default: false,
            index: true
        },
        isFeatured: {
            type: Boolean,
            default: false,
            index: true
        },
        profileCompleteness: {
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

doctorSchema.index({ location: "2dsphere" });

// Discovery Ranking Index
doctorSchema.index({
    verificationStatus: 1,
    isActive: 1,
    isFeatured: -1,
    ratingAverage: -1
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;