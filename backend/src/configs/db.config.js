import mongoose from "mongoose";
import env from "./env.config.js";
import User from "../modules/user/user.model.js";
import { hashPassword } from "../utils/password.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });

    console.log("🟢 MongoDB Connected");

    // Bootstrap Super Admin
    await bootstrapSuperAdmin();

    return conn;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

const bootstrapSuperAdmin = async () => {
  try {
    const superAdminEmail = env.SUPER_ADMIN.EMAIL;
    const superAdminPassword = env.SUPER_ADMIN.PASSWORD;

    const existingAdmin = await User.findOne({ email: superAdminEmail });

    if (!existingAdmin) {
      const hashedPassword = await hashPassword(superAdminPassword);

      await User.create({
        name: "Super Admin",
        email: superAdminEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        authProvider: "LOCAL",
        isVerified: true,
        isActive: true
      });

      console.log("🚀 Super Admin bootstrapped successfully");
    } else {
      console.log("ℹ️ Super Admin already exists");
    }
  } catch (error) {
    console.error("❌ Super Admin bootstrap failed:", error.message);
  }
};

export default connectDB;