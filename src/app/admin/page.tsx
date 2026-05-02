"use client";

import dynamic from "next/dynamic";
import AnomalyList from "@/components/dashboard/AnomalyList";
import StatsBar from "@/components/shared/StatsBar";
import { useState } from "react";
import type { Zone } from "@/types";

const CityMap = dynamic(() => import("@/components/map/CityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <span className="text-gray-400">Harita yükleniyor...</span>
    </div>
  ),
});

const ZoneDetailPanel = dynamic(
  () => import("@/components/dashboard/ZoneDetailPanel"),
  { ssr: false }
);

export default function AdminDashboard() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [layers, setLayers] = useState({
    heatmap: true,
    reports: true,
    anomalies: true,
  });

  return (
    <main className="h-screen w-screen bg-gray-950 text-white flex flex-col">
      <StatsBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sol panel */}
        <div className="w-80 flex-shrink-0 border-r border-gray-800 flex flex-col overflow-y-auto">
          {/* Katman toggle'ları */}
          <div className="p-4 border-b border-gray-800">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
              Katmanlar
            </p>
            {(Object.entries(layers) as [keyof typeof layers, boolean][]).map(([key, val]) => (
              <label key={key} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={val}
                  onChange={() => setLayers((l) => ({ ...l, [key]: !l[key] }))}
                  className="accent-amber-500"
                />
                <span className="text-sm capitalize">
                  {key === "heatmap"
                    ? "NASA Heatmap"
                    : key === "reports"
                    ? "Vatandaş Bildirimleri"
                    : "AI Anomalileri"}
                </span>
              </label>
            ))}
          </div>

          <AnomalyList onSelectZone={setSelectedZone} />
        </div>

        {/* Harita */}
        <div className="flex-1 relative">
          <CityMap
            mode="admin"
            layers={layers}
            onZoneClick={setSelectedZone}
          />
        </div>

        {/* Sağ detay paneli */}
        {selectedZone && (
          <ZoneDetailPanel
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
          />
        )}
      </div>
    </main>
  );
}
