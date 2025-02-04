import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase-server';
import { openAIVisionOCR } from "@/lib/ocrService";
import { writeFile, unlink } from "fs/promises";
import { randomBytes } from "node:crypto";

// Constants for validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_UPLOADS_PER_WINDOW = 10;

// Simple in-memory rate limiting (replace with Redis in production)
const uploadCounts = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userUploads = uploadCounts.get(userId);

  if (!userUploads) {
    uploadCounts.set(userId, { count: 1, timestamp: now });
    return false;
  }

  if (now - userUploads.timestamp > RATE_LIMIT_WINDOW) {
    uploadCounts.set(userId, { count: 1, timestamp: now });
    return false;
  }

  if (userUploads.count >= MAX_UPLOADS_PER_WINDOW) {
    return true;
  }

  userUploads.count++;
  return false;
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting check
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Maximum ${MAX_UPLOADS_PER_WINDOW} uploads per hour.` },
        { status: 429 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    // Validate file
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Write the file to /tmp
    const tempFileName = `temp-${randomBytes(6).toString("hex")}.jpg`;
    const tempFilePath = `/tmp/${tempFileName}`;

    try {
      // Convert File to Buffer and write to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(tempFilePath, buffer);

      // OCR
      const text = await openAIVisionOCR(tempFilePath);

      // Return recognized text
      return NextResponse.json({ text });
    } finally {
      // Clean up temporary file
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError);
      }
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
