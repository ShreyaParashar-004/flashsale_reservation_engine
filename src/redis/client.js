const Redis = require("ioredis");
require("dotenv").config();

// One shared client for the whole process.
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  // Reconnect with growing delay, capped at 2s.
  retryStrategy: (times) => Math.min(times * 200, 2000),
  // Fail a command fast if Redis is down instead of queueing forever.
  maxRetriesPerRequest: 1,
});

redis.on("error", (error) => {
  console.error("[redis] error:", error.message);
});

module.exports = redis;
