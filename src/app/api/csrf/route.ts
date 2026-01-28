import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/utils/csrf";

export async function GET() {
  const token = generateCsrfToken();

  const response = NextResponse.json({ token });

  // Set CSRF token in httpOnly cookie
  response.cookies.set("csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
