import { NextRequest, NextResponse } from "next/server";

const MOCK_RESULTS = [
  { category: "bos_ofis_isigi", description: "Gece saatlerinde boş ofis binasında tüm katlar aydınlatılmış görünüyor." },
  { category: "reklam_panosu", description: "Reklam panosu gece geç saatlerde gereksiz yere aydınlatılıyor." },
  { category: "sokak_lambasi", description: "Sokak lambası gündüz saatlerinde yanmaya devam ediyor." },
  { category: "otopark", description: "Boş otopark alanı tam güçle aydınlatılıyor." },
  { category: "diger", description: "Aydınlatma israfı tespit edildi." },
];

export async function POST(req: NextRequest) {
  // Role kontrolü - Sadece citizen sınıflandırma yapabilir
  const role = req.headers.get("x-user-role") || "citizen";
  
  if (role !== "citizen") {
    return NextResponse.json(
      { error: "Yalnızca vatandaşlar resim sınıflandırması yapabilir" },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Görsel gerekli" }, { status: 400 });
  }

  // Anthropic API key varsa gerçek AI kullan
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { classifyImage } = await import("@/lib/claude/vision");
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mediaType = file.type as "image/jpeg" | "image/png" | "image/webp";
      const result = await classifyImage(base64, mediaType);
      return NextResponse.json(result);
    } catch {
      // fallback to mock
    }
  }

  // Mock: rastgele kategori döndür (demo için)
  const mock = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
  // 1sn yapay gecikme — AI çalışıyormuş gibi hissetsin
  await new Promise((r) => setTimeout(r, 1000));
  return NextResponse.json(mock);
}
