import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis(process.env.REDIS_BULLMQ_URL, {
  maxRetriesPerRequest: null,
});

export { Queue, Worker };