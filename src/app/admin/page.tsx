"use client";

import dynamic from "next/dynamic";
import AdminTopBar from "@/components/dashboard/AdminTopBar";
import AnomalyList from "@/components/dashboard/AnomalyList";
import CitizenReportsList from "@/components/dashboard/CitizenReportsList";
import ReportDetailPanel from "@/components/dashboard/ReportDetailPanel";
import { useState, useRef, useCallback, useEffect } from "react";
import type { Zone, Report } from "@/types";
import type { FlyToFn } from "@/components/map/CityMap";

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
  { key: "reports"   as const, label: "Vatandaş Bildirimleri",    dot: "bg-blue-400"   },
  { key: "anomalies" as const, label: "Anomaliler",               dot: "bg-red-400"    },
  { key: "satellite" as const, label: "NASA Uydu (Black Marble)", dot: "bg-cyan-400"   },
];

type SidebarTab = "anomalies" | "reports";

export default function AdminDashboard() {
  const [selectedZone, setSelectedZone]     = useState<Zone | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [layers, setLayers]                 = useState({ heatmap: false, reports: true, anomalies: true, satellite: false });
  const [sidebarTab, setSidebarTab]         = useState<SidebarTab>("anomalies");
  const [mapRefreshKey, setMapRefreshKey]   = useState(0);
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [rightWidth, setRightWidth]         = useState(420);
  const flyToRef   = useRef<FlyToFn | null>(null);
  const dragging   = useRef(false);
  const startX     = useRef(0);
  const startWidth = useRef(420);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current   = true;
    startX.current     = e.clientX;
    startWidth.current = rightWidth;
    document.body.style.cursor    = "col-resize";
    document.body.style.userSelect = "none";
  }, [rightWidth]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      setRightWidth(Math.min(700, Math.max(280, startWidth.current + delta)));
    }
    function onUp() {
      dragging.current = false;
      document.body.style.cursor    = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  function toggleLayer(key: keyof typeof layers) {
    setLayers((l) => ({ ...l, [key]: !l[key] }));
  }

  function handleReportClick(report: Report) {
    setSelectedReport(report);
    setSelectedZone(null);
    flyToRef.current?.(report.lat, report.lng, 16);
  }

  function handleZoneClick(zone: Zone) {
    setSelectedZone(zone);
    setSelectedReport(null);
  }

  function handleStatusChange(_id: string, _status: "resolved" | "deleted") {
    setMapRefreshKey((k) => k + 1);
    setListRefreshKey((k) => k + 1);
  }

  const rightPanelOpen = !!(selectedZone || selectedReport);

  return (
    <main className="h-screen w-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      <AdminTopBar />

      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Sol Sidebar ── */}
        <aside className="w-[320px] flex-shrink-0 flex flex-col bg-slate-800 border-r border-slate-700">

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
                  <div className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${layers[key] ? "bg-amber-500" : "bg-slate-600"}`}>
                    <div className={`absolute top-[3px] w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${layers[key] ? "translate-x-[17px]" : "translate-x-[3px]"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sekme başlıkları */}
          <div className="flex border-b border-slate-700 shrink-0">
            <button
              onClick={() => setSidebarTab("anomalies")}
              className={`flex-1 py-2 text-[11px] font-medium transition ${sidebarTab === "anomalies" ? "text-amber-400 border-b-2 border-amber-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              Anomaliler
            </button>
            <button
              onClick={() => setSidebarTab("reports")}
              className={`flex-1 py-2 text-[11px] font-medium transition ${sidebarTab === "reports" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              Şikayetler
            </button>
          </div>

          {sidebarTab === "anomalies" ? (
            <AnomalyList
              onSelectZone={handleZoneClick}
              selectedZoneId={selectedZone?.id ?? null}
            />
          ) : (
            <CitizenReportsList
              onSelectReport={handleReportClick}
              selectedReportId={selectedReport?.id ?? null}
              refreshKey={listRefreshKey}
            />
          )}

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
            onZoneClick={handleZoneClick}
            onReportClick={handleReportClick}
            refreshTrigger={mapRefreshKey}
            flyToRef={flyToRef}
          />
        </div>

        {/* ── Sağ Detay Paneli (slide-in, yeniden boyutlandırılabilir) ── */}
        <div
          className={`flex-shrink-0 overflow-hidden flex transition-[width] duration-300 ease-out ${rightPanelOpen ? "" : "w-0"}`}
          style={rightPanelOpen ? { width: rightWidth } : undefined}
        >
          {/* Sürükleme tutacağı */}
          {rightPanelOpen && (
            <div
              onMouseDown={onDragStart}
              className="w-1 shrink-0 cursor-col-resize hover:bg-amber-500/60 active:bg-amber-500 bg-slate-700 transition-colors"
              title="Sürükle"
            />
          )}
          <div className="flex-1 overflow-hidden">
            {selectedZone && (
              <ZoneDetailPanel
                zone={selectedZone}
                onClose={() => setSelectedZone(null)}
              />
            )}
            {selectedReport && (
              <ReportDetailPanel
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
