/**
 * modules/user/counter.model.js
 *
 * Maintains counters for generating sequential IDs
 * Example:
 * PAT001
 * DOC001
 * CLI001
 */

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    sequence: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: false
  }
);

export default mongoose.model("Counter", counterSchema);