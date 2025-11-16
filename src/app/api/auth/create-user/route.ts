import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, supabaseId, firstName, lastName } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (existingUser) {
      return NextResponse.json({ success: true, userId: existingUser.id });
    }

    // Create user in database with USER role (from UserRole enum)
    const user = await prisma.user.create({
      data: {
        email,
        supabaseId,
        role: "USER", // This matches the UserRole enum: USER | CAREGIVER | ADMIN
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 },
    );
  }
}
