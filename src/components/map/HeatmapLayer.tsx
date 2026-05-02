"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function HeatmapLayer() {
  const map = useMap();

  useEffect(() => {
    let heatLayer: unknown;

    async function init() {
      // willReadFrequently: leaflet.heat yüklenmeden önce canvas patch
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (HTMLCanvasElement.prototype as any).getContext = function(type: string, opts?: any) {
        if (type === "2d") opts = { ...opts, willReadFrequently: true };
        return origGetContext.call(this, type as any, opts);
      };

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("leaflet.heat");

      const res = await fetch("/data/pilot-zone.geojson");
      const geojson = await res.json();

      const points = geojson.features.map(
        (f: GeoJSON.Feature<GeoJSON.Point, { intensity: number }>) => [
          f.geometry.coordinates[1],
          f.geometry.coordinates[0],
          f.properties.intensity,
        ]
      );

      heatLayer = (L as { heatLayer: Function }).heatLayer(points, {
        radius: 18,
        blur: 12,
        maxZoom: 18,
        gradient: { 0.2: "#1d4ed8", 0.5: "#f59e0b", 0.8: "#ef4444", 1.0: "#dc2626" },
      }).addTo(map);
    }

    init();

    return () => {
      if (heatLayer && map.hasLayer(heatLayer as L.Layer)) {
        map.removeLayer(heatLayer as L.Layer);
      }
    };
  }, [map]);

  return null;
}