import dotenv from "dotenv";
import path from "path";

const ENV = process.env.NODE_ENV || "development";

const envFile = `.env.${ENV}`;

dotenv.config({
  path: path.resolve(process.cwd(), envFile)
});

const requiredEnv = [
  "PORT",
  "MONGO_URI",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRES",
  "JWT_REFRESH_EXPIRES",
  "MAIL_USER",
  "MAIL_PASS",
  "REDIS_URL",

];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required ENV variable: ${key}`);
    process.exit(1);
  }
});

export default {
  NODE_ENV: ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  FRONTEND_URL: process.env.FRONTEND_URL,
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES
  },
  SUPER_ADMIN: {
    EMAIL: process.env.SUPER_ADMIN_EMAIL,
    PASSWORD: process.env.SUPER_ADMIN_PASSWORD
  },
  MAIL: {
    USER: process.env.MAIL_USER,
    PASS: process.env.MAIL_PASS
  },
  REDIS_URL: process.env.REDIS_URL

};