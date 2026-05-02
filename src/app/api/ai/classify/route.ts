import { NextRequest, NextResponse } from "next/server";
import { classifyImage } from "@/lib/claude/vision";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Görsel gerekli" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mediaType = file.type as "image/jpeg" | "image/png" | "image/webp";

  const result = await classifyImage(base64, mediaType);

  return NextResponse.json(result);
}
