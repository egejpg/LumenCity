"use client";

import { Marker, Popup } from "react-leaflet";
import type { Report, ReportCategory } from "@/types";

const CATEGORY_EMOJI: Record<ReportCategory, string> = {
  bos_ofis_isigi: "🏢",
  reklam_panosu: "📢",
  sokak_lambasi: "💡",
  otopark: "🅿️",
  diger: "⚠️",
};

const CATEGORY_LABEL: Record<ReportCategory, string> = {
  bos_ofis_isigi: "Boş Ofis Işığı",
  reklam_panosu: "Reklam Panosu",
  sokak_lambasi: "Sokak Lambası",
  otopark: "Otopark",
  diger: "Diğer",
};

interface ReportPinProps {
  report: Report;
}

export default function ReportPin({ report }: ReportPinProps) {
  return (
    <Marker position={[report.lat, report.lng]}>
      <Popup>
        <div className="text-sm">
          <div className="font-semibold mb-1">
            {CATEGORY_EMOJI[report.category]} {CATEGORY_LABEL[report.category]}
          </div>
          <p className="text-gray-600">{report.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(report.created_at).toLocaleDateString("tr-TR")}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
