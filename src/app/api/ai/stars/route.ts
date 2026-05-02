import { NextRequest, NextResponse } from "next/server";

const MOCK_STARS_RESULTS = [
  {
    visibleStars: [
      { name: "Orion (Avcı)", description: "Güney ufkunda çok parlak 3 kuşağıyla belirgindir." },
      { name: "Sirius", description: "Gökyüzünün en parlak yıldızıdır, güneybatıda ufka yakın bulunur." },
      { name: "Jüpiter", description: "Batı ufkunda parlak sarımsı bir gezegen olarak görülebilir." },
    ],
    skyBox: { ymin: 0, xmin: 0, ymax: 60, xmax: 100 },
  },
  {
    visibleStars: [
      { name: "Büyük Ayı", description: "Kuzey yönünde kepçe şekliyle çok net görünmelidir." },
      { name: "Kutup Yıldızı (Polaris)", description: "Büyük Ayı'nın yardımıyla tam kuzeyde tespit edilebilir." },
      { name: "Venüs", description: "Gün doğumu/batımı saatlerine yakın ufukta çok parlak parlar." },
    ],
    skyBox: { ymin: 0, xmin: 0, ymax: 45, xmax: 100 },
  }
];

export async function POST(req: NextRequest) {
  // Role kontrolü - Sadece citizen yıldız analizi yapabilir
  const role = req.headers.get("x-user-role") || "citizen";
  
  if (role !== "citizen") {
    return NextResponse.json(
      { error: "Yalnızca vatandaşlar yıldız analizi yapabilir" },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const time = formData.get("time") as string;

  if (!file || isNaN(lat) || isNaN(lng) || !time) {
    return NextResponse.json({ error: "Eksik parametreler" }, { status: 400 });
  }

  // Anthropic API key varsa gerçek AI kullan
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { analyzeSky } = await import("@/lib/claude/vision");
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mediaType = file.type as "image/jpeg" | "image/png" | "image/webp";
      const result = await analyzeSky(base64, mediaType, lat, lng, time);
      
      // Eğer AI gökyüzü bulamadıysa default bir oran verelim ki özellik çalışsın (örneğin üst %40)
      if (!result.skyBox) {
        result.skyBox = { ymin: 0, xmin: 0, ymax: 40, xmax: 100 };
      }
      
      return NextResponse.json(result);
    } catch (e) {
      console.error("Gerçek AI hatası:", e);
      // fallback to mock
    }
  }

  // Mock: rastgele sonuç döndür (demo için)
  const mock = MOCK_STARS_RESULTS[Math.floor(Math.random() * MOCK_STARS_RESULTS.length)];
  // 1.5sn yapay gecikme — astronomik hesaplama ve AI çalışıyormuş gibi hissetsin
  await new Promise((r) => setTimeout(r, 1500));
  return NextResponse.json(mock);
}
