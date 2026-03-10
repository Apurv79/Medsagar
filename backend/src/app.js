import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import env from "./configs/env.config.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// Module Routes Imports
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import doctorRoutes from "./modules/doctor/doctor.routes.js";
import clinicRoutes from "./modules/clinic/clinic.routes.js";
import specializationRoutes from "./modules/specialization/specialization.routes.js";
import discoveryRoutes from "./modules/discovery/discovery.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import sosRoutes from "./modules/sos/sos.routes.js";
import appointmentRoutes from "./modules/appointment/appointment.routes.js";
import consultationRoutes from "./modules/consultation/consultation.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import prescriptionRoutes from "./modules/prescription/prescription.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import referralRoutes from "./modules/referral/referral.routes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN || "*",
  credentials: true
}));

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/public", express.static(path.join(__dirname, "../public")));

// Test Auth Pages (Temporary for testing)
app.get("/reset-password", (req, res) => res.sendFile(path.join(__dirname, "../public/reset-password.html")));
app.get("/verify-email", (req, res) => res.sendFile(path.join(__dirname, "../public/verify-email.html")));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Medsagar Backend API",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounted Directly
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/specializations", specializationRoutes);
app.use("/api/v1/discover", discoveryRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/sos", sosRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/referral", referralRoutes);

// API info endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Medsagar API v1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      admin: "/api/v1/admin",
      doctors: "/api/v1/doctors",
      clinics: "/api/v1/clinics",
      specializations: "/api/v1/specializations",
      discover: "/api/v1/discover",
      reviews: "/api/v1/reviews",
      sos: "/api/v1/sos"
    }
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorMiddleware);

export default app;