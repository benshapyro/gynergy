import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "No user ID" }, { status: 400 });
    }

    const body = await req.json();
    const { text } = body as { text: string };

    // Create or update a journal entry for 'today'
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Upsert the journaling text for the user, today's date
    const { data: entryData, error: entryError } = await supabase
      .from("JournalEntry")
      .upsert({
        user_id: userId,
        date: now.toISOString(),
        text,
      })
      .select()
      .single();

    if (entryError) {
      console.error(entryError);
      return NextResponse.json({ error: entryError.message }, { status: 500 });
    }

    // Check if user had an entry for yesterday to keep the streak
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: yData, error: yError } = await supabase
      .from("JournalEntry")
      .select("*")
      .eq("user_id", userId)
      .gte("date", yesterday.toISOString())
      .lt("date", now.toISOString())
      .maybeSingle();

    if (yError) {
      console.error(yError);
    }

    // Fetch user record
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      console.error(userError);
      return NextResponse.json(
        { error: userError?.message || "User not found" },
        { status: 500 }
      );
    }

    let newStreak = 1;
    if (yData) {
      // If there's an entry for yesterday, increment streak
      newStreak = (userData.streak ?? 0) + 1;
    }

    const newPoints = (userData.points ?? 0) + 10;

    // Update user streak & points
    const { error: updateError } = await supabase
      .from("User")
      .update({
        streak: newStreak,
        points: newPoints,
      })
      .eq("id", userId);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Journal saved successfully",
      streak: newStreak,
      points: newPoints,
      entry: entryData,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
