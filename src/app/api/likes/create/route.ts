import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { likeRateLimit } from "@/lib/rate-limit";
import { withRateLimit } from "@/lib/utils/rate-limit-helper";
import { z } from "zod";

const likeSchema = z.object({
  to_user_id: z.string().uuid("Invalid user ID"),
});

export async function POST(request: NextRequest) {
  return withRateLimit(request, likeRateLimit, async () => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { to_user_id } = likeSchema.parse(body);

      // Check if already liked
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("from_user_id", user.id)
        .eq("to_user_id", to_user_id)
        .single();

      if (existingLike) {
        return NextResponse.json(
          { error: "Already liked this profile" },
          { status: 400 },
        );
      }

      // Create like
      const { data, error } = await supabase
        .from("likes")
        .insert({
          from_user_id: user.id,
          to_user_id: to_user_id,
        })
        .select()
        .single();

      if (error) {
        console.error("Like creation error:", error);
        return NextResponse.json(
          { error: "Failed to like profile" },
          { status: 400 },
        );
      }

      // Check for mutual match
      const { data: reverseLike } = await supabase
        .from("likes")
        .select("id")
        .eq("from_user_id", to_user_id)
        .eq("to_user_id", user.id)
        .single();

      let matchCreated = false;
      if (reverseLike) {
        // Create match
        const { error: matchError } = await supabase.from("matches").insert({
          user1_id: user.id,
          user2_id: to_user_id,
        });

        if (!matchError) {
          matchCreated = true;

          // Create notifications for both users
          await supabase.from("notifications").insert([
            {
              user_id: user.id,
              type: "match",
              title: "New Match!",
              content: "You have a new match. Start chatting now!",
              related_user_id: to_user_id,
            },
            {
              user_id: to_user_id,
              type: "match",
              title: "New Match!",
              content: "You have a new match. Start chatting now!",
              related_user_id: user.id,
            },
          ]);
        }
      } else {
        // Create like notification
        await supabase.from("notifications").insert({
          user_id: to_user_id,
          type: "like",
          title: "Someone liked you!",
          content: "You have a new like on your profile.",
          related_user_id: user.id,
        });
      }

      return NextResponse.json(
        {
          liked: true,
          matchCreated,
          message: matchCreated
            ? "It's a match!"
            : "Profile liked successfully",
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Like error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
