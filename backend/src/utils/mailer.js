/**
 * utils/mailer.js
 *
 * Central email service using Nodemailer
 * Used for:
 * - Doctor credentials
 * - Clinic credentials
 * - Admin credentials
 * - Password reset links
 * - Account verification
 */

import nodemailer from "nodemailer";
import logger from "./logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

/**
 * Send generic email
 */
export const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Medsagar" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html
    });

    logger.info("Mail sent:", info.messageId);

    return true;
  } catch (error) {
    logger.error("Mail sending failed:", error.message);
    throw error;
  }
};

/**
 * Send login credentials
 */
export const sendCredentialsEmail = async ({
  email,
  name,
  username,
  password,
  role
}) => {
  const html = `
  <h2>Welcome to Medsagar</h2>
  <p>Hello ${name},</p>

  <p>Your ${role} account has been created.</p>

  <p><strong>Username:</strong> ${username}</p>
  <p><strong>Password:</strong> ${password}</p>

  <p>Please change your password after first login.</p>

  <p>Medsagar Team</p>
  `;

  return sendMail({
    to: email,
    subject: "Your Medsagar Account Credentials",
    html
  });
};

/**
 * Send password reset email
 */
export const sendResetPasswordEmail = async ({
  email,
  resetLink
}) => {
  const html = `
  <h2>Password Reset</h2>

  <p>You requested a password reset.</p>

  <a href="${resetLink}">Reset Password</a>

  <p>If you did not request this, ignore this email.</p>
  `;

  return sendMail({
    to: email,
    subject: "Reset Your Medsagar Password",
    html
  });
};