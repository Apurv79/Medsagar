import mongoose from "mongoose"
import { PAYMENT_STATUS } from "./payment.constants.js"

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },

    orderId: {
      type: String,
      index: true,
      required: true
    },

    paymentId: {
      type: String,
      index: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      index: true
    },

    receipt: {
      type: String,
      index: true
    },

    metadata: {
      type: Object
    }
  },
  { timestamps: true }
)

paymentSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model("Payment", paymentSchema)