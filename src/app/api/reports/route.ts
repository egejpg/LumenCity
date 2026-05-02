import { NextRequest, NextResponse } from "next/server";

// MOCK DATA — Supabase bağlandığında bu bloğu kaldır
const MOCK_REPORTS = [
  { id: "r1", lat: 40.9835, lng: 29.0338, category: "bos_ofis_isigi",  description: "Gece boyunca tüm katlar aydınlık, içeride kimse yok.",         image_url: null, created_at: "2026-05-01T23:15:00Z" },
  { id: "r2", lat: 40.9852, lng: 29.0355, category: "otopark",          description: "Gece 2 sonrası tamamen boş otopark tam güçte yanıyor.",          image_url: null, created_at: "2026-05-02T00:10:00Z" },
  { id: "r3", lat: 40.9822, lng: 29.0315, category: "reklam_panosu",    description: "Saat 3'te kimse görmüyor ama billboard tüm gece açık.",          image_url: null, created_at: "2026-05-02T00:45:00Z" },
  { id: "r4", lat: 40.9842, lng: 29.0372, category: "sokak_lambasi",    description: "Sabah 9'a kadar yanmaya devam ediyor.",                          image_url: null, created_at: "2026-05-02T01:20:00Z" },
  { id: "r5", lat: 40.9862, lng: 29.0325, category: "bos_ofis_isigi",   description: "Hafta sonu ofis boş ama tüm ışıklar açık.",                      image_url: null, created_at: "2026-05-02T02:05:00Z" },
];

export async function GET() {
  // MOCK: Supabase hazır olunca aşağıdaki mock return'ü kaldır, Supabase bloğunu aç
  return NextResponse.json(MOCK_REPORTS);

  /* SUPABASE — env ayarlandıktan sonra aktif et
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
  */
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // MOCK: Supabase hazır olunca bu bloğu kaldır, Supabase bloğunu aç
  const mockCreated = {
    id: `r${Date.now()}`,
    lat: body.lat,
    lng: body.lng,
    category: body.category,
    description: body.description,
    image_url: body.image_url ?? null,
    created_at: new Date().toISOString(),
  };
  return NextResponse.json(mockCreated, { status: 201 });

  /* SUPABASE — env ayarlandıktan sonra aktif et
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reports")
    .insert({ lat: body.lat, lng: body.lng, category: body.category, description: body.description, image_url: body.image_url ?? null })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
  */
}
