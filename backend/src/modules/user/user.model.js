/**
 * User base identity model
 * Shared by patient, doctor, clinic, admin
 */

import mongoose from "mongoose";
import { generateId } from "../../utils/idGenerator.js";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      index: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },

    password: {
      type: String,
      select: false
    },

    role: {
      type: String,
      enum: [
        "PATIENT",
        "DOCTOR",
        "CLINIC",
        "ADMIN",
        "SUPER_ADMIN"
      ],
      index: true
    },

    avatar: String,

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    authProvider: {
      type: String,
      enum: ["LOCAL", "GOOGLE", "FIREBASE"],
      default: "LOCAL",
      index: true
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

/* important compound index */
userSchema.index({ role: 1, isActive: 1 });

/**
 * Pre-save hook for sequential ID generation
 */
userSchema.pre("save", async function () {
  if (!this.userId) {
    let prefix = "USR";

    switch (this.role) {
      case "PATIENT":
        prefix = "PAT";
        break;
      case "DOCTOR":
        prefix = "DOC";
        break;
      case "CLINIC":
        prefix = "CLI";
        break;
      case "ADMIN":
        prefix = "ADM";
        break;
      case "SUPER_ADMIN":
        prefix = "SAD";
        break;
    }

    this.userId = await generateId(prefix);
  }
});

export default mongoose.model("User", userSchema);