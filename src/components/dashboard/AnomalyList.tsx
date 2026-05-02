"use client";

import type { Anomaly, Zone } from "@/types";

// MOCK DATA — Supabase bağlandığında bu bloğu kaldır, useAnomalies() hookunu aç
const MOCK_ANOMALIES: Anomaly[] = [
  { id: "a1", zone_id: "z1", lat: 40.9833, lng: 29.0333, score: 92, light_intensity: 0.90, expected_intensity: 0.15, poi_type: "Boş Ofis Binası",     created_at: "2026-05-01T22:00:00Z" },
  { id: "a2", zone_id: "z2", lat: 40.9850, lng: 29.0350, score: 78, light_intensity: 0.80, expected_intensity: 0.25, poi_type: "Kapalı Otopark",       created_at: "2026-05-01T23:00:00Z" },
  { id: "a3", zone_id: "z3", lat: 40.9820, lng: 29.0310, score: 65, light_intensity: 0.75, expected_intensity: 0.35, poi_type: "Reklam Panosu",        created_at: "2026-05-02T00:00:00Z" },
  { id: "a4", zone_id: "z4", lat: 40.9840, lng: 29.0370, score: 51, light_intensity: 0.65, expected_intensity: 0.40, poi_type: "Cadde Aydınlatması",   created_at: "2026-05-02T01:00:00Z" },
  { id: "a5", zone_id: "z5", lat: 40.9860, lng: 29.0320, score: 44, light_intensity: 0.60, expected_intensity: 0.42, poi_type: "AVM Cephesi",          created_at: "2026-05-02T01:30:00Z" },
  { id: "a6", zone_id: "z6", lat: 40.9845, lng: 29.0338, score: 38, light_intensity: 0.55, expected_intensity: 0.43, poi_type: "Park Aydınlatması",    created_at: "2026-05-02T02:00:00Z" },
];

const POI_ICON: Record<string, string> = {
  "Boş Ofis Binası":    "🏢",
  "Kapalı Otopark":     "🅿",
  "Reklam Panosu":      "📢",
  "Cadde Aydınlatması": "💡",
  "AVM Cephesi":        "🏬",
  "Park Aydınlatması":  "🌿",
};

function severity(score: number) {
  if (score >= 70) return { label: "KRİTİK", border: "border-l-red-400",    badge: "text-red-300    bg-red-900/50    border border-red-700/50",    bar: "bg-red-400"    };
  if (score >= 45) return { label: "YÜKSEK",  border: "border-l-orange-400", badge: "text-orange-300 bg-orange-900/50 border border-orange-700/50", bar: "bg-orange-400" };
  return              { label: "ORTA",   border: "border-l-yellow-400", badge: "text-yellow-300 bg-yellow-900/50 border border-yellow-700/50", bar: "bg-yellow-400" };
}

interface AnomalyListProps {
  onSelectZone: (zone: Zone) => void;
  selectedZoneId: string | null;
}

export default function AnomalyList({ onSelectZone, selectedZoneId }: AnomalyListProps) {
  // const { anomalies, loading } = useAnomalies(); // MOCK: Supabase hazır olunca aç
  const anomalies = MOCK_ANOMALIES; // MOCK
  const loading = false;            // MOCK

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Başlık */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Anomaliler
        </span>
        <span className="text-[10px] font-bold text-red-300 bg-red-900/50 border border-red-700/50 px-2 py-0.5 rounded-full">
          {anomalies.length} aktif
        </span>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-xs">Yükleniyor...</div>
        ) : (
          anomalies.map((a) => {
            const s = severity(a.score);
            const isSelected = selectedZoneId === a.zone_id;

            return (
              <button
                key={a.id}
                onClick={() =>
                  onSelectZone({
                    id: a.zone_id,
                    name: a.poi_type,
                    geojson: {} as GeoJSON.Feature,
                    anomaly_count: 1,
                    potential_saving_kwh: (a.light_intensity - a.expected_intensity) * 8760,
                    current_kwh: a.light_intensity * 8760,
                  })
                }
                className={`w-full text-left rounded-lg border-l-2 ${s.border} px-3 py-2.5 transition-all duration-150
                  ${isSelected
                    ? "bg-slate-600/60 ring-1 ring-slate-500/50"
                    : "bg-slate-700/40 hover:bg-slate-700 ring-1 ring-transparent"
                  }`}
              >
                {/* Üst satır: isim + skor */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm leading-none">{POI_ICON[a.poi_type] ?? "📍"}</span>
                    <span className="text-[11px] font-medium text-slate-100 truncate">{a.poi_type}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-1 ${s.badge}`}>
                    {a.score}
                  </span>
                </div>

                {/* Alt satır: koordinat + etiket */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-slate-500 font-mono tabular-nums">
                    {a.lat.toFixed(4)}, {a.lng.toFixed(4)}
                  </span>
                  <span className={`text-[9px] font-bold tracking-wide ${s.badge.split(" ")[0]}`}>
                    {s.label}
                  </span>
                </div>

                {/* Skor çubuğu */}
                <div className="h-[3px] bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.bar}`}
                    style={{ width: `${a.score}%` }}
                  />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
