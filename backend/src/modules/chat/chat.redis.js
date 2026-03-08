import Redis from "ioredis";

export const pubClient = new Redis(process.env.REDIS_URL);
export const subClient = pubClient.duplicate();