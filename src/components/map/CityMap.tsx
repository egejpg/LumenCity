"use client";

import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import { useReports } from "@/hooks/useReports";
import { useAnomalies } from "@/hooks/useAnomalies";
import ReportPin from "./ReportPin";
import AnomalyMarker from "./AnomalyMarker";
import HeatmapLayer from "./HeatmapLayer";
import type { Anomaly, LayerConfig, Zone } from "@/types";

// Moda Mahallesi merkezi
const PILOT_CENTER: [number, number] = [40.9833, 29.0333];
const PILOT_ZOOM = 15;

interface CityMapProps {
  mode: "citizen" | "admin";
  layers?: LayerConfig;
  onZoneClick?: (zone: Zone) => void;
}

// Haritaya tıklayınca en yakın anomaliyi bulup onZoneClick'i tetikler (heatmap blob'ları için)
function HeatmapClickHandler({ anomalies, onZoneClick }: { anomalies: Anomaly[]; onZoneClick?: (zone: Zone) => void }) {
  useMapEvents({
    click: (e) => {
      if (!onZoneClick || anomalies.length === 0) return;
      const { lat, lng } = e.latlng;
      let nearest = anomalies[0];
      let minDist = Infinity;
      for (const a of anomalies) {
        const d = Math.hypot(a.lat - lat, a.lng - lng);
        if (d < minDist) { minDist = d; nearest = a; }
      }
      // Sadece ~300m yakınındaki noktalara tepki ver (derece cinsinden ~0.003)
      if (minDist > 0.003) return;
      onZoneClick({
        id: nearest.zone_id,
        name: nearest.poi_type,
        geojson: {} as GeoJSON.Feature,
        anomaly_count: 1,
        current_kwh: Math.round(nearest.light_intensity * 8760),
        potential_saving_kwh: Math.round((nearest.light_intensity - nearest.expected_intensity) * 8760),
      });
    },
  });
  return null;
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
      {showHeatmap && <HeatmapClickHandler anomalies={anomalies} onZoneClick={onZoneClick} />}

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
