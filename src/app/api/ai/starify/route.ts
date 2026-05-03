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
          "Replace only the sky in this photo with a realistic unpolluted night sky. Show natural star visibility as seen from a dark rural area — hundreds of clearly visible stars with realistic brightness variation, a faint hint of the Milky Way band barely visible, deep dark blue-black sky. No over-the-top galaxy effects. The stars should look like what the human eye would actually see without light pollution. Match the ambient lighting and color temperature of the original foreground. Keep everything below the horizon completely untouched. Photorealistic, natural, subtle.",
        negative_prompt: "light pollution, sky glow, orange haze, yellow sky, glowing horizon, artificial light, streetlight glow, overexposed sky, washed out sky, cloudy, overcast, hazy, foggy, blurry, few stars, no stars, cartoon, illustration, painting, drawing, CGI, unrealistic, changed buildings, altered foreground, different architecture",
        strength: 0.82,
        num_inference_steps: 40,
        guidance_scale: 9,
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
