import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all journal entries for the user
    const { data, error } = await supabase
      .from('journal_entries')
      .select(`
        id,
        date,
        morning_completed,
        morning_mood_score,
        morning_mood_factors,
        morning_reflection,
        evening_completed,
        evening_mood_score,
        evening_mood_factors,
        evening_reflection,
        gratitude_action_completed,
        total_points,
        created_at
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 