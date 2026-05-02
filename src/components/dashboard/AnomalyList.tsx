"use client";

import type { Zone } from "@/types";
import { useAnomalies } from "@/hooks/useAnomalies";

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
  const { anomalies, loading } = useAnomalies();

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
                onClick={() => {
                  onSelectZone({
                    id: a.zone_id,
                    name: a.poi_type,
                    geojson: {} as GeoJSON.Feature,
                    anomaly_count: 1,
                    current_kwh: Math.round(a.light_intensity * 8760),
                    potential_saving_kwh: Math.round((a.light_intensity - a.expected_intensity) * 8760),
                  });
                }}
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
