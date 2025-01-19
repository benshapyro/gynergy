import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { openAIVisionOCR } from "@/lib/ocrService";
import { createWriteStream } from "node:fs";
import { randomBytes } from "node:crypto";
import { promisify } from "util";
import { pipeline } from "stream";

const pump = promisify(pipeline);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("journalImage") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Write the file to /tmp
    const tempFileName = `temp-${randomBytes(6).toString("hex")}.jpg`;
    const tempFilePath = `/tmp/${tempFileName}`;

    const fileStream = file.stream();
    const outStream = createWriteStream(tempFilePath);
    await pump(fileStream, outStream);

    // OCR
    const text = await openAIVisionOCR(tempFilePath);

    // Return recognized text
    return NextResponse.json({ text });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
