"use client";

import dynamic from "next/dynamic";
import AdminTopBar from "@/components/dashboard/AdminTopBar";
import AnomalyList from "@/components/dashboard/AnomalyList";
import { useState } from "react";
import type { Zone } from "@/types";

const CityMap = dynamic(() => import("@/components/map/CityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 tracking-wide">Harita yükleniyor...</span>
      </div>
    </div>
  ),
});

const ZoneDetailPanel = dynamic(
  () => import("@/components/dashboard/ZoneDetailPanel"),
  { ssr: false }
);

const LAYER_CONFIG = [
  { key: "heatmap"   as const, label: "NASA Heatmap",          dot: "bg-amber-400"  },
  { key: "reports"   as const, label: "Vatandaş Bildirimleri", dot: "bg-blue-400"   },
  { key: "anomalies" as const, label: "AI Anomalileri",        dot: "bg-red-400"    },
  { key: "satellite" as const, label: "NASA Uydu (Black Marble)", dot: "bg-cyan-400" },
];

export default function AdminDashboard() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [layers, setLayers] = useState({ heatmap: true, reports: true, anomalies: true, satellite: false });

  function toggleLayer(key: keyof typeof layers) {
    setLayers((l) => ({ ...l, [key]: !l[key] }));
  }

  return (
    <main className="h-screen w-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      <AdminTopBar />

      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Sol Sidebar ── */}
        <aside className="w-[272px] flex-shrink-0 flex flex-col bg-slate-800 border-r border-slate-700">

          {/* Katman Toggleları */}
          <div className="px-3 pt-4 pb-3 border-b border-slate-700">
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase px-1 mb-2.5">
              Harita Katmanları
            </p>
            <div className="space-y-0.5">
              {LAYER_CONFIG.map(({ key, label, dot }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer"
                  onClick={() => toggleLayer(key)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${layers[key] ? dot : "bg-slate-600"}`} />
                    <span className={`text-xs transition-colors duration-200 ${layers[key] ? "text-slate-200" : "text-slate-500"}`}>
                      {label}
                    </span>
                  </div>
                  {/* Toggle switch */}
                  <div className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${layers[key] ? "bg-amber-500" : "bg-slate-600"}`}>
                    <div className={`absolute top-[3px] w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${layers[key] ? "translate-x-[17px]" : "translate-x-[3px]"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomali Listesi */}
          <AnomalyList
            onSelectZone={setSelectedZone}
            selectedZoneId={selectedZone?.id ?? null}
          />

          {/* Pilot bölge footer */}
          <div className="px-4 py-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[10px] text-slate-400">Moda Mahallesi · 1.2 km²</span>
            </div>
          </div>
        </aside>

        {/* ── Harita ── */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <CityMap
            mode="admin"
            layers={layers}
            onZoneClick={setSelectedZone}
          />
        </div>

        {/* ── Sağ Detay Paneli (slide-in) ── */}
        <div className={`flex-shrink-0 overflow-hidden transition-all duration-300 ease-out ${selectedZone ? "w-[400px]" : "w-0"}`}>
          {selectedZone && (
            <ZoneDetailPanel
              zone={selectedZone}
              onClose={() => setSelectedZone(null)}
            />
          )}
        </div>

      </div>
    </main>
  );
}
