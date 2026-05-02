import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json({ error: "FAL_KEY eksik" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "Fotoğraf eksik" }, { status: 400 });

    // Dosyayı base64'e çevir
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const { fal } = await import("@fal-ai/client");
    fal.config({ credentials: process.env.FAL_KEY });

    // fal.ai storage'a yükle
    const imageBlob = new Blob([arrayBuffer], { type: file.type });
    const uploadedUrl = await fal.storage.upload(imageBlob);

    // Flux img2img ile gökyüzüne gerçekçi yıldız ekle
    const result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
      input: {
        image_url: uploadedUrl,
        prompt:
          "night sky with thousands of bright visible stars, milky way galaxy clearly visible, astrophotography, dark sky observatory quality, stars twinkling, deep blue and purple sky, no light pollution whatsoever, city skyline and buildings unchanged in foreground",
        negative_prompt: "light pollution, orange sky glow, overcast, cloudy, blurry stars, cartoon, painting, no stars, few stars",
        strength: 0.75,
        num_inference_steps: 35,
        guidance_scale: 7,
        num_images: 1,
      },
    }) as any;

    const outputUrl = result?.data?.images?.[0]?.url ?? result?.images?.[0]?.url;
    if (!outputUrl) throw new Error("Sonuç alınamadı");

    return NextResponse.json({ imageUrl: outputUrl });
  } catch (e: any) {
    console.error("[starify]", e);
    return NextResponse.json({ error: e?.message ?? "Bilinmeyen hata" }, { status: 500 });
  }
}
