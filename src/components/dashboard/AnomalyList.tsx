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
  "Sokak Lambası":      "🔦",
  "Spor Kompleksi":     "🏟",
  "Tarihi Bina":        "🏛",
  "AVM Dış Cephesi":    "🏬",
};

function severity(score: number) {
  if (score >= 70) return {
    label: "KRİTİK", border: "border-l-red-400",
    badge: "text-red-300 bg-red-900/50 border border-red-700/50",
    bar: "bg-red-400", text: "text-red-300",
  };
  if (score >= 45) return {
    label: "YÜKSEK", border: "border-l-orange-400",
    badge: "text-orange-300 bg-orange-900/50 border border-orange-700/50",
    bar: "bg-orange-400", text: "text-orange-300",
  };
  return {
    label: "ORTA", border: "border-l-yellow-400",
    badge: "text-yellow-300 bg-yellow-900/50 border border-yellow-700/50",
    bar: "bg-yellow-400", text: "text-yellow-300",
  };
}

interface AnomalyListProps {
  onSelectZone: (zone: Zone) => void;
  selectedZoneId: string | null;
}

export default function AnomalyList({ onSelectZone, selectedZoneId }: AnomalyListProps) {
  const { anomalies, loading } = useAnomalies();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Anomaliler</span>
        <span className="text-xs font-bold text-red-300 bg-red-900/50 border border-red-700/50 px-2.5 py-0.5 rounded-full">
          {anomalies.length} aktif
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-2.5 px-2.5 space-y-2">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Yükleniyor...</div>
        ) : (
          anomalies.map((a) => {
            const s = severity(a.score);
            const isSelected = selectedZoneId === a.zone_id;
            const wasteKwh = Math.round((a.light_intensity - a.expected_intensity) * 8760);

            return (
              <button
                key={a.id}
                onClick={() => onSelectZone({
                  id: a.zone_id,
                  name: a.poi_type,
                  geojson: {} as GeoJSON.Feature,
                  anomaly_count: 1,
                  current_kwh: Math.round(a.light_intensity * 8760),
                  potential_saving_kwh: wasteKwh,
                })}
                className={`w-full text-left rounded-xl border-l-[3px] ${s.border} px-4 py-3.5 transition-all duration-150 ${
                  isSelected
                    ? "bg-slate-600/70 ring-1 ring-slate-500/60"
                    : "bg-slate-700/40 hover:bg-slate-700"
                }`}
              >
                {/* İsim + skor */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl leading-none shrink-0">{POI_ICON[a.poi_type] ?? "📍"}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-100 leading-tight">{a.poi_type}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{a.lat.toFixed(4)}, {a.lng.toFixed(4)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`text-xl font-bold leading-none ${s.text}`}>{a.score}</span>
                    <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${s.badge}`}>{s.label}</span>
                  </div>
                </div>

                {/* İstatistik kutuları */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <div className="bg-slate-800/70 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-slate-500">Mevcut</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{Math.round(a.light_intensity * 100)}%</p>
                  </div>
                  <div className="bg-slate-800/70 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-slate-500">Beklenen</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{Math.round(a.expected_intensity * 100)}%</p>
                  </div>
                  <div className="bg-slate-800/70 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[10px] text-slate-500">İsraf</p>
                    <p className="text-xs font-bold text-orange-300 mt-0.5">
                      {Math.round((a.light_intensity - a.expected_intensity) * 100)}%
                    </p>
                  </div>
                </div>

                {/* Tasarruf */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs text-slate-400">Yıllık tasarruf potansiyeli</span>
                  <span className="text-xs font-semibold text-emerald-400">~{wasteKwh.toLocaleString("tr")} kWh</span>
                </div>

                {/* Skor çubuğu */}
                <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${a.score}%` }} />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
