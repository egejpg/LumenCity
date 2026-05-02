import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Scenario } from "@/types";

// 3 hard-coded senaryo — runtime'da hesaplama yok, demo için yeterli
function buildScenarios(currentKwh: number): Scenario[] {
  return [
    {
      key: "current",
      label: "Mevcut Durum",
      kwh_per_year: currentKwh,
      saving_percent: 0,
      cost_saving_tl: 0,
    },
    {
      key: "recommended",
      label: "Önerilen (Hareket Sensörü)",
      kwh_per_year: Math.round(currentKwh * 0.65),
      saving_percent: 35,
      cost_saving_tl: Math.round(currentKwh * 0.35 * 2.8), // 2.8 TL/kWh ortalama
    },
    {
      key: "aggressive",
      label: "Agresif (Tam Optimizasyon)",
      kwh_per_year: Math.round(currentKwh * 0.45),
      saving_percent: 55,
      cost_saving_tl: Math.round(currentKwh * 0.55 * 2.8),
    },
  ];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();

  const { data: zone, error } = await supabase
    .from("zones")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: anomalies } = await supabase
    .from("anomalies")
    .select("*")
    .eq("zone_id", params.id)
    .order("score", { ascending: false });

  return NextResponse.json({
    ...zone,
    anomalies: anomalies ?? [],
    scenarios: buildScenarios(zone.current_kwh),
  });
}
