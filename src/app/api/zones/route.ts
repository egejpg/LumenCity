import { NextResponse } from "next/server";

// MOCK DATA — Supabase bağlandığında bu bloğu kaldır
const MOCK_ZONES = [
  {
    id: "z1",
    name: "Moda Mahallesi",
    geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[[29.025, 40.978], [29.042, 40.978], [29.042, 40.989], [29.025, 40.989], [29.025, 40.978]]],
      },
    },
    anomaly_count: 6,         // MOCK
    potential_saving_kwh: 87600, // MOCK
    current_kwh: 450000,         // MOCK
  },
];

export async function GET() {
  // MOCK: Supabase hazır olunca aşağıdaki mock return'ü kaldır, Supabase bloğunu aç
  return NextResponse.json(MOCK_ZONES);

  /* SUPABASE — env ayarlandıktan sonra aktif et
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("zones").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
  */
}
