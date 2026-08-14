import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "No key provided" }, { status: 400 });
  }

  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to public/uploads
    const filepath = join(process.cwd(), "public", "uploads", key);
    
    // Ensure directory exists
    await mkdir(dirname(filepath), { recursive: true });

    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Local upload error:", error);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
