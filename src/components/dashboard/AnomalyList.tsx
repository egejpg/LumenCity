"use client";

import { useAnomalies } from "@/hooks/useAnomalies";
import type { Zone } from "@/types";

interface AnomalyListProps {
  onSelectZone: (zone: Zone) => void;
}

export default function AnomalyList({ onSelectZone }: AnomalyListProps) {
  const { anomalies, loading } = useAnomalies();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
        Anomaliler ({anomalies.length})
      </p>
      {loading ? (
        <div className="text-gray-500 text-sm">Yükleniyor...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {anomalies.map((a) => (
            <button
              key={a.id}
              onClick={() =>
                onSelectZone({
                  id: a.zone_id,
                  name: a.poi_type,
                  geojson: {} as GeoJSON.Feature,
                  anomaly_count: 1,
                  potential_saving_kwh:
                    (a.light_intensity - a.expected_intensity) * 8760,
                  current_kwh: a.light_intensity * 8760,
                })
              }
              className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">{a.poi_type}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    a.score > 70
                      ? "bg-red-900/50 text-red-400"
                      : a.score > 40
                      ? "bg-orange-900/50 text-orange-400"
                      : "bg-yellow-900/50 text-yellow-400"
                  }`}
                >
                  {a.score}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {a.lat.toFixed(4)}, {a.lng.toFixed(4)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
