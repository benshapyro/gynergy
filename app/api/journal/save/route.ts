import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    // 1) Get current user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse request body
    const { text } = await req.json() as { text: string };
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Missing or invalid text" }, { status: 400 });
    }

    // 3) Upsert into journal_entries for today's date
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dateStr = now.toISOString().split("T")[0];

    const { data: entry, error: entryError } = await supabase
      .from("journal_entries")
      .upsert(
        {
          user_id: user.id,
          date: dateStr,
          morning_completed: true,
          morning_reflection: text,
          morning_points: 5,
        },
        {
          onConflict: "user_id, date",
        }
      )
      .select("*")
      .single();

    if (entryError) {
      throw entryError;
    }

    // 4) Check for streak continuity
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const { data: yEntry, error: yError } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", yesterdayStr)
      .maybeSingle();

    if (yError) {
      console.error("Error checking yesterday entry:", yError);
    }

    // 5) Retrieve current user metadata, increment streak if yesterday was completed
    const { data: userCheck } = await supabase.auth.getUser();
    const oldMeta = userCheck?.user?.user_metadata || {};
    const oldStreak = oldMeta.streak_count || 0;
    const oldPoints = oldMeta.total_points || 0;

    let newStreak = yEntry ? (oldStreak + 1) : 1;
    let newPoints = oldPoints + 5; // awarding 5 points for the morning entry

    // 6) Update user's streak_count and total_points in user_metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        streak_count: newStreak,
        total_points: newPoints,
      },
    });

    if (updateError) {
      console.error("Error updating user metadata:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Journal saved successfully",
      entry,
      streak: newStreak,
      points: newPoints,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
