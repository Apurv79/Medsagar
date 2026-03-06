/**
 * utils/idGenerator.js
 * Generates sequential IDs like PAT001 DOC001
 */

/**
 * utils/idGenerator.js
 *
 * Generates sequential IDs using MongoDB atomic counters.
 */

import Counter from "../modules/user/counter.model.js";
import logger from "./logger.js";

export const generateId = async (prefix) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { key: prefix },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    ).lean();

    const id = String(counter.sequence).padStart(3, "0");

    const finalId = `${prefix}${id}`;

    logger.info("Generated ID:", finalId);

    return finalId;
  } catch (error) {
    logger.error("ID generation failed:", error.message);
    throw error;
  }
};