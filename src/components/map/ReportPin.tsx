"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import type { Report } from "@/types";

const CATEGORY_COLOR: Record<string, string> = {
  sokak_lambasi:  "#f59e0b",
  bos_ofis_isigi: "#a78bfa",
  reklam_panosu:  "#fb923c",
  otopark:        "#38bdf8",
  diger:          "#94a3b8",
};

const CATEGORY_ICON: Record<string, string> = {
  sokak_lambasi:  "🔦",
  bos_ofis_isigi: "💡",
  reklam_panosu:  "📋",
  otopark:        "🅿",
  diger:          "⚠",
};

function makeIcon(category: string, status?: string) {
  const color = status === "resolved" ? "#22c55e" : (CATEGORY_COLOR[category] ?? "#94a3b8");
  const emoji = CATEGORY_ICON[category] ?? "⚠";
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;
      background:${color};
      border:2.5px solid rgba(255,255,255,0.7);
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 0 0 3px ${color}44,0 3px 10px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:14px;line-height:1;">${emoji}</span></div>`,
    className: "",
    iconAnchor: [18, 36],
    iconSize: [36, 36],
  });
}

interface ReportPinProps {
  report: Report;
  onReportClick: (report: Report) => void;
}

export default function ReportPin({ report, onReportClick }: ReportPinProps) {
  return (
    <Marker
      position={[report.lat, report.lng]}
      icon={makeIcon(report.category, report.status)}
      eventHandlers={{ click: () => onReportClick(report) }}
    />
  );
}
