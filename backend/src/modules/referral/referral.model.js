import mongoose from "mongoose"
import { REFERRAL_STATUS } from "./referral.constants.js"

const referralSchema = new mongoose.Schema(
  {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },

    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
      required: true
    },

    code: {
      type: String,
      index: true
    },

    status: {
      type: String,
      enum: Object.values(REFERRAL_STATUS),
      default: REFERRAL_STATUS.PENDING
    }
  },
  { timestamps: true }
)

referralSchema.index({ referrerId: 1, createdAt: -1 })

export default mongoose.model("Referral", referralSchema)