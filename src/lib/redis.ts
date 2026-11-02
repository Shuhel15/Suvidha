import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in the environment variables.");
}

export const redis = new Redis(redisUrl,{
  maxRetriesPerRequest:null,
  retryStrategy(times) {
    return Math.min(times * 500, 3000);
  }
})