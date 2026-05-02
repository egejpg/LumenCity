"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import { useReports } from "@/hooks/useReports";
import { useAnomalies } from "@/hooks/useAnomalies";
import ReportPin from "./ReportPin";
import AnomalyMarker from "./AnomalyMarker";
import HeatmapLayer from "./HeatmapLayer";
import type { LayerConfig, Zone } from "@/types";

// Moda Mahallesi merkezi
const PILOT_CENTER: [number, number] = [40.9833, 29.0333];
const PILOT_ZOOM = 15;

interface CityMapProps {
  mode: "citizen" | "admin";
  layers?: LayerConfig;
  onZoneClick?: (zone: Zone) => void;
}

function LeafletIconFix() {
  const map = useMap();
  useEffect(() => {
    // Leaflet default icon path fix for Next.js
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
    void map;
  }, [map]);
  return null;
}

export default function CityMap({ mode, layers, onZoneClick }: CityMapProps) {
  const { reports } = useReports();
  const { anomalies } = useAnomalies();

  const showHeatmap = mode === "admin" ? (layers?.heatmap ?? true) : false;
  const showReports = layers?.reports ?? true;
  const showAnomalies = mode === "admin" ? (layers?.anomalies ?? true) : false;

  return (
    <MapContainer
      center={PILOT_CENTER}
      zoom={PILOT_ZOOM}
      className="w-full h-full"
      style={{ background: "#1a1a2e" }}
    >
      <LeafletIconFix />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {showHeatmap && <HeatmapLayer />}

      {showReports &&
        reports.map((report) => (
          <ReportPin key={report.id} report={report} />
        ))}

      {showAnomalies &&
        anomalies.map((anomaly) => (
          <AnomalyMarker
            key={anomaly.id}
            anomaly={anomaly}
            onZoneClick={onZoneClick}
          />
        ))}
    </MapContainer>
  );
}
