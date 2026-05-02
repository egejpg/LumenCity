"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function HeatmapLayer() {
  const map = useMap();

  useEffect(() => {
    let heatLayer: unknown;

    async function init() {
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
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.2: "#0000ff", 0.5: "#ffff00", 1.0: "#ff0000" },
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
