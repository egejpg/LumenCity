import { NextRequest, NextResponse } from "next/server";
import { getAllReports, addRuntimeReport } from "@/lib/mock-data";

function hasSupabase() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET() {
  if (hasSupabase()) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase/server");
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("reports")
        .select("id, lat, lng, category, description, image_url, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) {
        // Runtime mock raporları (Supabase'e yazılamayanlar) ile birleştir
        const supabaseIds = new Set(data.map((r: any) => r.id));
        const { runtimeOnlyReports } = await import("@/lib/mock-data");
        const extras = runtimeOnlyReports().filter((r) => !supabaseIds.has(r.id));
        return NextResponse.json([...extras, ...data]);
      }
    } catch {
      // fallback to mock
    }
  }

  return NextResponse.json(getAllReports());
}

export async function POST(req: NextRequest) {
  const role = req.headers.get("x-user-role") || "citizen";

  if (role !== "citizen") {
    return NextResponse.json(
      { error: "Yalnızca vatandaşlar rapor gönderebilir" },
      { status: 403 }
    );
  }

  const body = await req.json();

  if (hasSupabase()) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase/server");
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("reports")
        .insert({
          lat: body.lat,
          lng: body.lng,
          category: body.category,
          description: body.description,
          image_url: body.image_url ?? null,
        })
        .select()
        .single();
      if (!error && data) return NextResponse.json(data, { status: 201 });
      console.error("[reports POST] Supabase hatası:", error?.message);
    } catch (e) {
      console.error("[reports POST] Supabase exception:", e);
    }
  }

  // Supabase yoksa veya başarısız olduysa mock'a kaydet
  const newReport = {
    id: `r-${Date.now()}`,
    lat: body.lat,
    lng: body.lng,
    category: body.category,
    description: body.description,
    image_url: body.image_url ?? null,
    created_at: new Date().toISOString(),
  };
  addRuntimeReport(newReport);
  return NextResponse.json(newReport, { status: 201 });
}
