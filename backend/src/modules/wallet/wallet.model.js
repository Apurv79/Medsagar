import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true
    },

    balance: {
      type: Number,
      default: 0
    },

    currency: {
      type: String,
      default: "INR"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", walletSchema);