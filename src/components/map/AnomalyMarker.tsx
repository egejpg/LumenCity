"use client";

import { CircleMarker, Popup } from "react-leaflet";
import type { Anomaly, Zone } from "@/types";

interface AnomalyMarkerProps {
  anomaly: Anomaly;
  onZoneClick?: (zone: Zone) => void;
}

export default function AnomalyMarker({ anomaly, onZoneClick }: AnomalyMarkerProps) {
  const color =
    anomaly.score > 70 ? "#ef4444" : anomaly.score > 40 ? "#f97316" : "#eab308";

  return (
    <CircleMarker
      center={[anomaly.lat, anomaly.lng]}
      radius={8 + anomaly.score / 20}
      pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 2 }}
      eventHandlers={{
        click: () => {
          if (!onZoneClick) return;
          onZoneClick({
            id: anomaly.zone_id,
            name: anomaly.poi_type,
            geojson: {} as GeoJSON.Feature,
            anomaly_count: 1,
            current_kwh: Math.round(anomaly.light_intensity * 8760),
            potential_saving_kwh: Math.round((anomaly.light_intensity - anomaly.expected_intensity) * 8760),
          });
        },
      }}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-semibold mb-1">Anomali Skoru: {anomaly.score}/100</div>
          <p className="text-gray-600">{anomaly.poi_type}</p>
        </div>
      </Popup>
    </CircleMarker>
  );
}
