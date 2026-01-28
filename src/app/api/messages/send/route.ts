import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validations/message";
import { messageRateLimit } from "@/lib/rate-limit";
import { withRateLimit } from "@/lib/utils/rate-limit-helper";
import { sanitizeText } from "@/lib/utils/sanitize"; // ✅ ADD THIS

export async function POST(request: NextRequest) {
  return withRateLimit(request, messageRateLimit, async () => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const validatedData = messageSchema.parse(body);

      const sanitizedContent = sanitizeText(validatedData.content, 5000);

      // Insert message (RLS will check if users are matched)
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: validatedData.receiver_id,
          content: sanitizedContent, // ✅ USE SANITIZED CONTENT
          message_type: validatedData.message_type,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Failed to send message" },
          { status: 400 },
        );
      }

      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error("Message send error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
