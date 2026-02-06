import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";

export async function withRateLimit(
  request: NextRequest,
  limiter: Ratelimit,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  // Get identifier (IP address or user ID)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : (request as any).ip || "anonymous";

  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": new Date(reset).toISOString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      },
    );
  }

  const response = await handler();

  // Add rate limit headers to successful responses
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", new Date(reset).toISOString());

  return response;
}
