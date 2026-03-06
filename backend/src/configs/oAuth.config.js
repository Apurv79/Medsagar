/**
 * config/googleOAuth.js
 *
 * Google OAuth token verification.
 * Used when patients login with Google.
 */

import { OAuth2Client } from "google-auth-library";
import logger from "../utils/logger.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token
 */

export const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    logger.info("Google token verified:", payload.email);

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub
    };
  } catch (error) {
    logger.error("Google token verification failed:", error.message);
    throw new Error("Invalid Google token");
  }
};