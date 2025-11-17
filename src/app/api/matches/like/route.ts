import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { supabaseId, targetUserId } = await request.json();

    if (!supabaseId || !targetUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Find user by supabaseId
    const user = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if there's already a match from the other user
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: targetUserId, user2Id: user.id },
          { user1Id: user.id, user2Id: targetUserId },
        ],
      },
    });

    if (existingMatch) {
      // If the other user already liked us, make it mutual
      if (existingMatch.user1Id === targetUserId && !existingMatch.isMutual) {
        const updatedMatch = await prisma.match.update({
          where: { id: existingMatch.id },
          data: { isMutual: true },
        });

        return NextResponse.json({
          success: true,
          mutual: true,
          match: updatedMatch,
          message: "It's a match! 🎉",
        });
      }

      return NextResponse.json({
        success: true,
        mutual: false,
        message: "Already liked this profile",
      });
    }

    // Create new match
    const newMatch = await prisma.match.create({
      data: {
        user1Id: user.id,
        user2Id: targetUserId,
        isLiked: true,
        isMutual: false,
      },
    });

    return NextResponse.json({
      success: true,
      mutual: false,
      match: newMatch,
      message: "Profile liked successfully",
    });
  } catch (error: any) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Failed to like profile", details: error.message },
      { status: 500 },
    );
  }
}
