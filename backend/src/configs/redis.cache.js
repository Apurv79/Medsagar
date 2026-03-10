import Redis from "ioredis";

const cacheRedis = new Redis(process.env.REDIS_CACHE_URL, {
  maxRetriesPerRequest: null,
});

cacheRedis.on("connect", () => {
  console.log("Cache Redis connected");
});

cacheRedis.on("error", (err) => {
  console.error("Cache Redis error:", err);
});

export default cacheRedis;