"use client";

import { Marker } from "react-leaflet";
import type { Report } from "@/types";

interface ReportPinProps {
  report: Report;
  onReportClick: (report: Report) => void;
}

export default function ReportPin({ report, onReportClick }: ReportPinProps) {
  return (
    <Marker
      position={[report.lat, report.lng]}
      eventHandlers={{ click: () => onReportClick(report) }}
    />
  );
}
