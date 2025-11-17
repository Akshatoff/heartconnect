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

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    // Get all users that current user has already matched with
    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    // Extract user IDs that should be excluded
    const excludedUserIds = existingMatches
      .flatMap((match) => [match.user1Id, match.user2Id])
      .filter((id) => id !== user.id);

    // Find potential matches based on preferences
    const potentialMatches = await prisma.profile.findMany({
      where: {
        userId: {
          notIn: [...excludedUserIds, user.id], // Exclude already matched users and self
        },
        status: "APPROVED", // Only show approved profiles
        // Filter by gender preference if specified
        ...(user.profile.lookingForGender && {
          gender: user.profile.lookingForGender,
        }),
      },
      take: 50, // Limit to 50 profiles at a time
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      profiles: potentialMatches,
    });
  } catch (error: any) {
    console.error("Error discovering matches:", error);
    return NextResponse.json(
      { error: "Failed to discover matches", details: error.message },
      { status: 500 },
    );
  }
}
