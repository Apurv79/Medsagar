import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: String,
    description: String,

    fileUrl: String,

    size: Number,

    accessRequests: [
      {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        approved: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);