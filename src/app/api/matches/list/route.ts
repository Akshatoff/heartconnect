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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all matches for this user
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
      include: {
        user1: {
          include: {
            profile: true,
          },
        },
        user2: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format matches to always show the other user
    const formattedMatches = matches.map((match) => {
      const isUser1 = match.user1Id === user.id;
      const otherUser = isUser1 ? match.user2 : match.user1;

      return {
        id: match.id,
        user: otherUser,
        isMutual: match.isMutual,
        createdAt: match.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      matches: formattedMatches,
    });
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches", details: error.message },
      { status: 500 },
    );
  }
}
