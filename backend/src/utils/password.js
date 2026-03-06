/**
 * utils/password.js
 *
 * Password utilities using Argon2.
 * Used for hashing, verification, and generating random passwords.
 */

import argon2 from "argon2";
import crypto from "crypto";
import logger from "./logger.js";

/**
 * Hash password
 */
export const hashPassword = async (password) => {
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1
    });

    logger.info("Password hashed");

    return hash;
  } catch (error) {
    logger.error("Password hashing failed:", error.message);
    throw error;
  }
};

/**
 * Verify password
 */
export const verifyPassword = async (hash, password) => {
  try {
    const isValid = await argon2.verify(hash, password);

    logger.info("Password verification:", isValid);

    return isValid;
  } catch (error) {
    logger.error("Password verification failed:", error.message);
    throw error;
  }
};

/**
 * Generate secure random password
 * Used for doctor / clinic / admin credentials
 */
export const generateRandomPassword = (length = 10) => {
  const password = crypto
    .randomBytes(length)
    .toString("base64")
    .slice(0, length);

  logger.info("Random password generated");

  return password;
};