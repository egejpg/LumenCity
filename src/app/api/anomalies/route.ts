import { NextRequest, NextResponse } from "next/server";
import { MOCK_ANOMALIES } from "@/lib/mock-data";

function hasSupabase() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(req: NextRequest) {
  // Role kontrolü - Sadece municipality anormalilikleri görebilir
  const role = req.headers.get("x-user-role") || "citizen";
  
  if (role !== "municipality") {
    return NextResponse.json(
      { error: "Yalnızca belediye yetkililer anomali verilerine erişebilir" },
      { status: 403 }
    );
  }

  if (hasSupabase()) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase/server");
      const supabase = createServerSupabaseClient();
      const { searchParams } = new URL(req.url);
      const zoneId = searchParams.get("zone_id");
      const minScore = searchParams.get("min_score");

      let query = supabase
        .from("anomalies")
        .select("id, lat, lng, score, light_intensity, expected_intensity, zone_id, poi_type, created_at")
        .order("score", { ascending: false });

      if (zoneId) query = query.eq("zone_id", zoneId);
      if (minScore) query = query.gte("score", parseInt(minScore));

      const { data, error } = await query;

      if (!error && data) return NextResponse.json(data);
    } catch {
      // fallback to mock
    }
  }

  return NextResponse.json(MOCK_ANOMALIES);
}
    } catch {
      // fallback to mock
    }
  }

  return NextResponse.json(MOCK_ANOMALIES);
>>>>>>> feature/image
}
