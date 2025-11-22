// src/app/api/messages/typing/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { supabaseId, conversationId, isTyping } = await request.json();

    if (!supabaseId || !conversationId || typeof isTyping !== "boolean") {
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

    // Get conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Update typing status
    const isUser1 = conversation.user1Id === user.id;
    await prisma.conversation.update({
      where: { id: conversationId },
      data: isUser1 ? { user1Typing: isTyping } : { user2Typing: isTyping },
    });

    return NextResponse.json({
      success: true,
      isTyping,
    });
  } catch (error: any) {
    console.error("Error updating typing status:", error);
    return NextResponse.json(
      { error: "Failed to update typing status", details: error.message },
      { status: 500 },
    );
  }
}
