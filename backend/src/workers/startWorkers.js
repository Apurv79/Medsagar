import { Worker } from "bullmq";
import { connection } from "../configs/redis.bullmq.js";
import paymentProcessor from "./processors/payment.processor.js";
import referralProcessor from "./processors/referral.processor.js";
import notificationProcessor from "./processors/notification.processor.js";

new Worker("paymentQueue", paymentProcessor, { connection });

new Worker("referralQueue", referralProcessor, { connection });

new Worker("notificationQueue", notificationProcessor, { connection });

console.log("Workers started");