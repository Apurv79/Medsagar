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
  "JWT_REFRESH_EXPIRES",
  "MAIL_USER",
  "MAIL_PASS",
  "REDIS_BULLMQ_URL",
  "REDIS_CACHE_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_BUCKET_NAME"
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
  REDIS_BULLMQ_URL: process.env.REDIS_BULLMQ_URL,
  REDIS_CACHE_URL: process.env.REDIS_CACHE_URL,
  AGORA_APP_ID: process.env.AGORA_APP_ID,
  AGORA_APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE,
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    REGION: process.env.AWS_REGION,
    BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    S3_PREFIX: process.env.AWS_S3_PREFIX
  }
};