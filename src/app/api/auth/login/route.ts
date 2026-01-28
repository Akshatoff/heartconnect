import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";
import { loginRateLimit } from "@/lib/rate-limit";
import { withRateLimit } from "@/lib/utils/rate-limit-helper";
import { ZodError } from "zod";
import { logger } from "@/lib/utils/logger"; // ✅ ADD THIS

export async function POST(request: NextRequest) {
  return withRateLimit(request, loginRateLimit, async () => {
    try {
      const body = await request.json();

      // Validate input
      const validatedData = loginSchema.parse(body);
      logger.info("Login attempt", { email: validatedData.email }); // ✅ ADD LOGGING

      const supabase = await createClient();

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        logger.warn("Login failed", {
          email: validatedData.email,
          error: error.message,
        }); // ✅ LOG FAILURE
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      logger.info("Login successful", { userId: data.user?.id }); // ✅ LOG SUCCESS

      if (!data.user) {
        return NextResponse.json({ error: "Login failed" }, { status: 401 });
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        return NextResponse.json(
          { error: "Please verify your email before logging in" },
          { status: 403 },
        );
      }

      return NextResponse.json(
        {
          message: "Login successful",
          user: {
            id: data.user.id,
            email: data.user.email,
          },
        },
        { status: 200 },
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }
      logger.error("Login error", { error }); // ✅ LOG ERROR
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
