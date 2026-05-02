import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const zoneId = searchParams.get("zone_id");
  const minScore = searchParams.get("min_score");

  // "location" kolonu PostGIS geometry — JSON'a serialize edilmez, hariç tut
  let query = supabase
    .from("anomalies")
    .select("id, lat, lng, score, light_intensity, expected_intensity, zone_id, poi_type, created_at")
    .order("score", { ascending: false });

  if (zoneId) query = query.eq("zone_id", zoneId);
  if (minScore) query = query.gte("score", parseInt(minScore));

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
