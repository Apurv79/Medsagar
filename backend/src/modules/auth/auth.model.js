/**
 * modules/auth/auth.model.js
 *
 * Authentication related schemas:
 * 1. AuthSession (refresh tokens)
 * 2. PasswordResetToken
 * 3. EmailVerificationToken
 *
 * Designed for high performance:
 * - Indexed queries
 * - Token lookup
 * - Fast revocation
 */

import mongoose from "mongoose";

/**
 * Auth Session Schema
 * Stores refresh tokens and device sessions
 */

const authSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    refreshToken: {
      type: String,
      required: true,
      index: true
    },

    userAgent: {
      type: String
    },

    ipAddress: {
      type: String
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true
    },

    isRevoked: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Indexes for faster session queries
 */

authSessionSchema.index({ userId: 1, isRevoked: 1 });
authSessionSchema.index({ refreshToken: 1 });

export const AuthSession = mongoose.model(
  "AuthSession",
  authSessionSchema
);

/**
 * Password Reset Token Schema
 */

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    token: {
      type: String,
      required: true,
      index: true
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true
    },

    used: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

passwordResetSchema.index({ token: 1, used: 1 });

export const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  passwordResetSchema
);

/**
 * Email Verification Token Schema
 */

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    token: {
      type: String,
      required: true,
      index: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    used: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

emailVerificationSchema.index({ token: 1 });

export const EmailVerificationToken = mongoose.model(
  "EmailVerificationToken",
  emailVerificationSchema
);