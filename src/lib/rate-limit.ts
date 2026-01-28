import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis instance
const redis = Redis.fromEnv();

// Rate limiters for different actions
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
  analytics: true,
  prefix: "ratelimit:login",
});

export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 signups per hour per IP
  analytics: true,
  prefix: "ratelimit:signup",
});

export const messageRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 messages per minute
  analytics: true,
  prefix: "ratelimit:message",
});

export const likeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"), // 50 likes per hour
  analytics: true,
  prefix: "ratelimit:like",
});

export const profileViewRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 profile views per hour
  analytics: true,
  prefix: "ratelimit:profile_view",
});

// Generic rate limit checker
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    remaining,
    reset,
  };
}
