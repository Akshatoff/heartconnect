// src/app/api/profile/get/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabaseId = searchParams.get("supabaseId");

    if (!supabaseId) {
      return NextResponse.json(
        { error: "Supabase ID is required" },
        { status: 400 },
      );
    }

    // Find user by supabaseId
    const user = await prisma.user.findUnique({
      where: { supabaseId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: user.profile,
    });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 },
    );
  }
}
