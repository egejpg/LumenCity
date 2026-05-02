"use client";

import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { useReports } from "@/hooks/useReports";
import { useAnomalies } from "@/hooks/useAnomalies";
import ReportPin from "./ReportPin";
import AnomalyMarker from "./AnomalyMarker";
import HeatmapLayer from "./HeatmapLayer";
import type { LayerConfig, Zone } from "@/types";

// Moda Mahallesi merkezi
const PILOT_CENTER: [number, number] = [41.015, 29.0];
const PILOT_ZOOM = 11;

interface CityMapProps {
  mode: "citizen" | "admin";
  layers?: LayerConfig;
  onZoneClick?: (zone: Zone) => void;
  draftPin?: { lat: number; lng: number };
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LeafletIconFix() {
  const map = useMap();
  useEffect(() => {
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

// Sabit kullanıcı konum pini
function UserPin({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const pinIcon = L.divIcon({
    html: `<div style="
      width:36px;height:36px;
      background:radial-gradient(circle at 40% 35%,#fde68a,#f59e0b);
      border:3px solid #fbbf24;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 0 0 4px rgba(245,158,11,0.25),0 4px 12px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="transform:rotate(45deg);font-size:14px;">📍</div>
    </div>`,
    className: "",
    iconAnchor: [18, 36],
    iconSize: [36, 36],
  });

  return (
    <Marker
      position={[lat, lng]}
      icon={pinIcon}
      interactive={false}
    />
  );
}

export default function CityMap({
  mode,
  layers,
  onZoneClick,
  draftPin,
}: CityMapProps) {
  const { reports } = useReports();
  const { anomalies } = useAnomalies();

  const showHeatmap    = mode === "admin" ? (layers?.heatmap    ?? true)  : false;
  const showReports    = layers?.reports   ?? true;
  const showAnomalies  = mode === "admin" ? (layers?.anomalies  ?? true)  : false;
  const showSatellite  = mode === "admin" ? (layers?.satellite  ?? false) : false;

  return (
    <MapContainer
      center={PILOT_CENTER}
      zoom={PILOT_ZOOM}
      minZoom={6}
      maxBounds={[[33, 22], [45, 50]]}
      maxBoundsViscosity={1.0}
      className="w-full h-full z-0"
      style={{ background: "#1a1a2e" }}
    >
      <LeafletIconFix />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {showSatellite && (
        <TileLayer
          url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_ENCC/default/2023-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg"
          attribution='&copy; <a href="https://earthdata.nasa.gov">NASA GIBS</a>'
          opacity={0.75}
          maxNativeZoom={8}
          maxZoom={18}
        />
      )}

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

      {draftPin && <MapUpdater center={[draftPin.lat, draftPin.lng]} />}

      {mode === "citizen" && draftPin && (
        <UserPin
          lat={draftPin.lat}
          lng={draftPin.lng}
        />
      )}
    </MapContainer>
  );
}
