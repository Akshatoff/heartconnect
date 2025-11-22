// src/app/api/messages/mark-read/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { supabaseId, conversationId } = await request.json();

    if (!supabaseId || !conversationId) {
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

    // Mark all messages in this conversation as read where user is the receiver
    const result = await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      messagesMarkedRead: result.count,
    });
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read", details: error.message },
      { status: 500 },
    );
  }
}
