/**
 * utils/jwt.js
 *
 * JWT utility for Medsagar authentication.
 * Handles access token + refresh token generation and verification.
 */

import jwt from "jsonwebtoken";
import logger from "./logger.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES
    });

    logger.info("Access token generated");

    return token;
  } catch (error) {
    logger.error("Access token generation failed:", error.message);
    throw error;
  }
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES
    });

    logger.info("Refresh token generated");

    return token;
  } catch (error) {
    logger.error("Refresh token generation failed:", error.message);
    throw error;
  }
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    logger.error("Access token verification failed:", error.message);
    throw error;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    logger.error("Refresh token verification failed:", error.message);
    throw error;
  }
};

/**
 * Generate full token pair
 */
export const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken
  };
};