/**
 * config/firebase.js
 *
 * Firebase Admin SDK initialization.
 * Used to verify Firebase ID tokens sent from client after OTP login.
 */

import admin from "firebase-admin";
import logger from "../utils/logger.js";

/**
 * Initialize Firebase Admin
 */

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
      })
    });

    logger.info("Firebase Admin initialized");
  } catch (error) {
    logger.error("Firebase initialization failed:", error.message);
  }
}

/**
 * Verify Firebase ID Token
 */

export const verifyFirebaseToken = async (idToken) => {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    logger.info("Firebase token verified:", decoded.uid);

    return decoded;
  } catch (error) {
    logger.error("Firebase token verification failed:", error.message);
    throw new Error("Invalid Firebase token");
  }
};