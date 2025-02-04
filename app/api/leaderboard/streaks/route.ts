import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("auth.users")
      .select("id, raw_user_meta_data")
      .order("raw_user_meta_data->streak_count", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = (data || []).map((u) => {
      const meta = u.raw_user_meta_data || {};
      return {
        id: u.id,
        name: meta.name || meta.first_name || "Anon",
        streak: meta.streak_count || 0,
        points: meta.total_points || 0,
      };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
