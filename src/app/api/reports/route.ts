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

      let data: any[] | null = null;
      let hasStatus = false;

      // Migration 005+006 uygulandıysa genişletilmiş sorgu
      const full = await supabase
        .from("reports")
        .select("id, lat, lng, category, description, image_url, created_at, status, user_email")
        .neq("status", "deleted")
        .order("created_at", { ascending: false });

      if (!full.error && full.data) {
        data = full.data;
        hasStatus = true;
      } else {
        // Migration henüz uygulanmamış — temel sorgu
        const basic = await supabase
          .from("reports")
          .select("id, lat, lng, category, description, image_url, created_at")
          .order("created_at", { ascending: false });
        if (!basic.error && basic.data) data = basic.data;
      }

      if (data) {
        const reports = data.map((r: any) => ({
          ...r,
          status: hasStatus ? (r.status ?? "open") : "open",
          user_email: hasStatus ? (r.user_email ?? null) : null,
        }));
        const { runtimeOnlyReports } = await import("@/lib/mock-data");
        const supabaseIds = new Set(data.map((r: any) => r.id));
        const extras = runtimeOnlyReports().filter((r) => !supabaseIds.has(r.id));
        return NextResponse.json([...extras, ...reports]);
      }
    } catch {
      // fallback to mock
    }
  }

  return NextResponse.json(getAllReports());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (hasSupabase()) {
    try {
      const { createSessionSupabaseClient, createServerSupabaseClient } = await import("@/lib/supabase/server");

      const sessionClient = await createSessionSupabaseClient();
      const { data: { user } } = await sessionClient.auth.getUser();

      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("reports")
        .insert({
          lat: body.lat,
          lng: body.lng,
          category: body.category,
          description: body.description,
          image_url: body.image_url ?? null,
          user_id: user?.id ?? null,
          user_email: user?.email ?? null,
        })
        .select("id, lat, lng, category, description, image_url, created_at, status, user_email")
        .single();

      if (!error && data) return NextResponse.json(data, { status: 201 });
      console.error("[reports POST] Supabase hatası:", error?.message);
    } catch (e) {
      console.error("[reports POST] Supabase exception:", e);
    }
  }

  const newReport = {
    id: `r-${Date.now()}`,
    lat: body.lat,
    lng: body.lng,
    category: body.category,
    description: body.description,
    image_url: body.image_url ?? null,
    created_at: new Date().toISOString(),
    status: "open" as const,
    user_email: undefined,
  };
  addRuntimeReport(newReport);
  return NextResponse.json(newReport, { status: 201 });
}
