import { NextRequest, NextResponse } from "next/server";
import { MOCK_ZONES } from "@/lib/mock-data";

function hasSupabase() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(req: NextRequest) {
  // Role kontrolü - Sadece municipality bölge verilerine erişebilir
  const role = req.headers.get("x-user-role") || "citizen";
  
  if (role !== "municipality") {
    return NextResponse.json(
      { error: "Yalnızca belediye yetkililer bölge verilerine erişebilir" },
      { status: 403 }
    );
  }

  if (hasSupabase()) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase/server");
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from("zones").select("*");
      if (!error && data) return NextResponse.json(data);
    } catch {
      // fallback to mock
    }
  }

  return NextResponse.json(MOCK_ZONES);
}
