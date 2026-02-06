import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/validations/auth";
import { signupRateLimit } from "@/lib/rate-limit";
import { withRateLimit } from "@/lib/utils/rate-limit-helper";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  return withRateLimit(request, signupRateLimit, async () => {
    try {
      const body = await request.json();

      // Validate input
      const validatedData = signupSchema.parse(body);

      const supabase = await createClient();

      // Create user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.fullName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        },
      });

      if (signUpError) {
        return NextResponse.json(
          { error: signUpError.message },
          { status: 400 },
        );
      }

      if (!data.user) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 },
        );
      }

      // Create profile entry
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: validatedData.email,
        full_name: validatedData.fullName,
        is_approved: false,
        is_verified: false,
        is_active: true,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Note: User is created but profile failed - needs admin intervention
        return NextResponse.json(
          {
            error:
              "Account created but profile setup failed. Please contact support.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          message:
            "Account created successfully. Please check your email to verify your account.",
          userId: data.user.id,
        },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.issues },
          { status: 400 },
        );
      }

      console.error("Signup error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
