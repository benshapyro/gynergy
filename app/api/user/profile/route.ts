import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase-server';

// Constants for rate limiting
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_PROFILE_UPDATES = 5;

// Simple in-memory rate limiting (replace with Redis in production)
const updateCounts = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userUpdates = updateCounts.get(userId);

  if (!userUpdates) {
    updateCounts.set(userId, { count: 1, timestamp: now });
    return false;
  }

  if (now - userUpdates.timestamp > RATE_LIMIT_WINDOW) {
    updateCounts.set(userId, { count: 1, timestamp: now });
    return false;
  }

  if (userUpdates.count >= MAX_PROFILE_UPDATES) {
    return true;
  }

  userUpdates.count++;
  return false;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// GET to fetch user profile
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return user information from auth metadata
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || "",
        profilePicture: user.user_metadata?.profilePicture || "",
        streak: user.user_metadata?.streak_count ?? 0,
        points: user.user_metadata?.total_points ?? 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT to update profile
export async function PUT(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting check
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Maximum ${MAX_PROFILE_UPDATES} updates per ${RATE_LIMIT_WINDOW / 1000 / 60} minutes.` },
        { status: 429 }
      );
    }

    const { name, email, profilePicture } = await req.json();

    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Update user metadata and email if provided
    const { data, error } = await supabase.auth.updateUser({
      email: email || undefined,
      data: {
        name,
        profilePicture,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
        profilePicture: data.user.user_metadata?.profilePicture || "",
        streak: data.user.user_metadata?.streak_count ?? 0,
        points: data.user.user_metadata?.total_points ?? 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
