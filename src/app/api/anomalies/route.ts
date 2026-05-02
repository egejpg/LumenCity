import { NextResponse } from "next/server";

// MOCK DATA — Supabase bağlandığında bu bloğu kaldır, alttaki Supabase kodunu aç
const MOCK_ANOMALIES = [
  { id: "a1", zone_id: "z1", lat: 40.9833, lng: 29.0333, score: 92, light_intensity: 0.90, expected_intensity: 0.15, poi_type: "Boş Ofis Binası",     created_at: "2026-05-01T22:00:00Z" },
  { id: "a2", zone_id: "z2", lat: 40.9850, lng: 29.0350, score: 78, light_intensity: 0.80, expected_intensity: 0.25, poi_type: "Kapalı Otopark",       created_at: "2026-05-01T23:00:00Z" },
  { id: "a3", zone_id: "z3", lat: 40.9820, lng: 29.0310, score: 65, light_intensity: 0.75, expected_intensity: 0.35, poi_type: "Reklam Panosu",        created_at: "2026-05-02T00:00:00Z" },
  { id: "a4", zone_id: "z4", lat: 40.9840, lng: 29.0370, score: 51, light_intensity: 0.65, expected_intensity: 0.40, poi_type: "Cadde Aydınlatması",   created_at: "2026-05-02T01:00:00Z" },
  { id: "a5", zone_id: "z5", lat: 40.9860, lng: 29.0320, score: 44, light_intensity: 0.60, expected_intensity: 0.42, poi_type: "AVM Cephesi",          created_at: "2026-05-02T01:30:00Z" },
  { id: "a6", zone_id: "z6", lat: 40.9845, lng: 29.0338, score: 38, light_intensity: 0.55, expected_intensity: 0.43, poi_type: "Park Aydınlatması",    created_at: "2026-05-02T02:00:00Z" },
];

export async function GET() {
  // MOCK: Supabase hazır olunca aşağıdaki mock return'ü kaldır, Supabase bloğunu aç
  return NextResponse.json(MOCK_ANOMALIES);

  /* SUPABASE — env ayarlandıktan sonra aktif et
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("anomalies")
    .select("*")
    .order("score", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
  */
}
