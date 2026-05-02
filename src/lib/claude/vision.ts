import Anthropic from "@anthropic-ai/sdk";
import type { ReportCategory } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATEGORIES: ReportCategory[] = [
  "bos_ofis_isigi",
  "reklam_panosu",
  "sokak_lambasi",
  "otopark",
  "diger",
];

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  bos_ofis_isigi: "Boş ofis ışığı",
  reklam_panosu: "Reklam panosu",
  sokak_lambasi: "Sokak lambası",
  otopark: "Otopark aydınlatması",
  diger: "Diğer",
};

export async function classifyImage(
  base64Image: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp"
): Promise<{ category: ReportCategory; description: string }> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Image },
          },
          {
            type: "text",
            text: `Bu görselde gereksiz veya verimsiz kullanılan bir aydınlatma var mı?
Aşağıdaki kategorilerden birini seç: ${CATEGORIES.join(", ")}
Sonra Türkçe kısa bir açıklama yaz (max 1 cümle).
JSON formatında yanıt ver: {"category": "...", "description": "..."}`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
    const category: ReportCategory = CATEGORIES.includes(parsed.category)
      ? parsed.category
      : "diger";
    return {
      category,
      description:
        parsed.description ??
        `${CATEGORY_LABELS[category]} tespit edildi.`,
    };
  } catch {
    return { category: "diger", description: "Aydınlatma israfı tespit edildi." };
  }
}
