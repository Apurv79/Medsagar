import mongoose from "mongoose";
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from "./wallet.constants.js";

const walletTransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
      index: true
    },

    amount: {
      type: Number,
      required: true
    },

    referenceId: {
      type: String,
      index: true
    },

    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.COMPLETED
    },

    metadata: {
      type: Object
    }
  },
  { timestamps: true }
);

walletTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("WalletTransaction", walletTransactionSchema);