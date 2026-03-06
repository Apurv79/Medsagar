import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import env from "./configs/env.config.js";
import moduleRoutes from "./modules/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

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

// API Routes
app.use("/api/v1", moduleRoutes);

// API info endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Medsagar API v1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      admin: "/api/v1/admin"
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