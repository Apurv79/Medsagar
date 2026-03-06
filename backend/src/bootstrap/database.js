import mongoose from "mongoose";
import logger from "../utils/logger.js";
import env from "../configs/env.config.js";
import User from "../modules/user/user.model.js";
import { hashPassword } from "../utils/password.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // Bootstrap Super Admin
        await bootstrapSuperAdmin();

        return conn;
    } catch (error) {
        logger.error(`Error: ${error.message}`);
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
                isVerified: true,
                isActive: true
            });

            logger.info("Super Admin bootstrapped successfully");
        } else {
            logger.info("Super Admin already exists");
        }
    } catch (error) {
        logger.error("Super Admin bootstrap failed:", error.message);
    }
};

export default connectDB;
