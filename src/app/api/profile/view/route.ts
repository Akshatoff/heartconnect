import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profileViewRateLimit } from "@/lib/rate-limit";
import { withRateLimit } from "@/lib/utils/rate-limit-helper";
import { z } from "zod";

const viewSchema = z.object({
  viewed_id: z.string().uuid("Invalid user ID"),
});

export async function POST(request: NextRequest) {
  return withRateLimit(request, profileViewRateLimit, async () => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { viewed_id } = viewSchema.parse(body);

      // Don't track viewing own profile
      if (user.id === viewed_id) {
        return NextResponse.json({ tracked: false }, { status: 200 });
      }

      // Record profile view
      const { error } = await supabase.from("profile_views").insert({
        viewer_id: user.id,
        viewed_id: viewed_id,
      });

      if (error) {
        console.error("Profile view tracking error:", error);
        // Don't fail the request if tracking fails
      }

      // Create notification (limit to once per day per viewer)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: recentView } = await supabase
        .from("profile_views")
        .select("id")
        .eq("viewer_id", user.id)
        .eq("viewed_id", viewed_id)
        .gte("created_at", today.toISOString())
        .limit(1);

      if (!recentView || recentView.length === 0) {
        await supabase.from("notifications").insert({
          user_id: viewed_id,
          type: "profile_view",
          title: "Profile View",
          content: "Someone viewed your profile",
          related_user_id: user.id,
        });
      }

      return NextResponse.json({ tracked: true }, { status: 201 });
    } catch (error) {
      console.error("Profile view error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  });
}
