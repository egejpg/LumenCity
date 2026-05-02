import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();

  // "location" kolonu PostGIS geometry — JSON'a serialize edilmez, hariç tut
  const { data, error } = await supabase
    .from("reports")
    .select("id, lat, lng, category, description, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const body = await req.json();

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
