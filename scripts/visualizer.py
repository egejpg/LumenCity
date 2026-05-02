"""
visualizer.py
-------------
İşlenmiş NTL verisinden üç çıktı üretir:
  1. PNG  — matplotlib ısı haritası (public/data/)
  2. HTML — folium interaktif harita (public/data/)
  3. GeoJSON — web uygulaması heatmap katmanı (public/data/pilot-zone.geojson)
"""

import os
import json
import numpy as np
from config import (
    BBOX_TURKEY, BBOX_PILOT,
    OUTPUT_PNG, OUTPUT_HTML, OUTPUT_GEOJSON,
)


def _ensure_dir(path: str) -> None:
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)


def save_png(result: dict) -> None:
    """Türkiye bounding box kırpılmış matplotlib ısı haritası PNG."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    data: np.ndarray = result["data"]
    lons: np.ndarray = result["lon"]
    lats: np.ndarray = result["lat"]

    lon_min, lat_min, lon_max, lat_max = (float(x) for x in BBOX_TURKEY.split(","))

    lon_mask = (lons >= lon_min) & (lons <= lon_max)
    lat_mask = (lats >= lat_min) & (lats <= lat_max)
    crop = data[np.ix_(lat_mask, lon_mask)]

    display = np.log1p(crop)
    display[np.isnan(display)] = 0

    _ensure_dir(OUTPUT_PNG)
    fig, ax = plt.subplots(figsize=(12, 6), dpi=150)
    ax.imshow(
        display,
        cmap="inferno",
        origin="upper",
        extent=[lon_min, lon_max, lat_min, lat_max],
        aspect="auto",
    )
    ax.set_title("Türkiye Gece Işık Yoğunluğu (VNP46A2, son 30 gün ortalama)",
                 color="white", fontsize=11)
    ax.set_xlabel("Boylam", color="white")
    ax.set_ylabel("Enlem", color="white")
    ax.tick_params(colors="white")
    fig.patch.set_facecolor("#0a0a1a")
    ax.set_facecolor("#0a0a1a")
    plt.colorbar(ax.images[0], ax=ax, label="log₁₊(nW/cm²/sr)")
    plt.tight_layout()
    plt.savefig(OUTPUT_PNG, facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"[VIZ] PNG kaydedildi: {OUTPUT_PNG}")


def save_html(result: dict) -> None:
    """Folium interaktif harita (Leaflet tabanlı)."""
    import folium
    from folium.plugins import HeatMap

    data: np.ndarray = result["data"]
    lons: np.ndarray = result["lon"]
    lats: np.ndarray = result["lat"]

    lon_min, lat_min, lon_max, lat_max = (float(x) for x in BBOX_TURKEY.split(","))

    points = []
    step = max(1, data.shape[0] // 200)  # örnekleme — haritayı hafif tut
    for ri in range(0, data.shape[0], step):
        if not (lat_min <= lats[ri] <= lat_max):
            continue
        for ci in range(0, data.shape[1], step):
            if not (lon_min <= lons[ci] <= lon_max):
                continue
            val = data[ri, ci]
            if not np.isnan(val) and val > 0:
                points.append([float(lats[ri]), float(lons[ci]), float(np.log1p(val))])

    m = folium.Map(
        location=[39.0, 35.5],
        zoom_start=6,
        tiles="CartoDB dark_matter",
    )
    if points:
        HeatMap(points, min_opacity=0.3, radius=8, blur=10, max_zoom=10).add_to(m)

    _ensure_dir(OUTPUT_HTML)
    m.save(OUTPUT_HTML)
    print(f"[VIZ] HTML kaydedildi: {OUTPUT_HTML}  ({len(points)} nokta)")


def save_geojson(result: dict) -> None:
    """
    Pilot bölge (Moda Mahallesi) için GeoJSON FeatureCollection.
    Web uygulamasının heatmap katmanı bu dosyayı okur.
    Format: her Feature bir nokta, 'intensity' özelliği taşır (0–1 normalize).
    """
    data: np.ndarray = result["data"]
    lons: np.ndarray = result["lon"]
    lats: np.ndarray = result["lat"]

    lon_min = BBOX_PILOT["min_lon"]
    lon_max = BBOX_PILOT["max_lon"]
    lat_min = BBOX_PILOT["min_lat"]
    lat_max = BBOX_PILOT["max_lat"]

    lon_mask = (lons >= lon_min) & (lons <= lon_max)
    lat_mask = (lats >= lat_min) & (lats <= lat_max)
    crop = data[np.ix_(lat_mask, lon_mask)]
    crop_lons = lons[lon_mask]
    crop_lats = lats[lat_mask]

    finite = crop[np.isfinite(crop)]
    if len(finite) == 0:
        print("[VIZ] Pilot bölgede veri yok, GeoJSON oluşturulamadı.")
        return

    vmin, vmax = float(np.nanpercentile(finite, 2)), float(np.nanpercentile(finite, 98))
    if vmax == vmin:
        vmax = vmin + 1

    features = []
    for ri, lat in enumerate(crop_lats):
        for ci, lon in enumerate(crop_lons):
            val = crop[ri, ci]
            if not np.isfinite(val):
                continue
            intensity = float(np.clip((val - vmin) / (vmax - vmin), 0, 1))
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [float(lon), float(lat)]},
                "properties": {
                    "intensity": round(intensity, 4),
                    "ntl_nW":    round(float(val), 4),
                },
            })

    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "product": "VNP46A2",
            "pilot_zone": "Moda Mahallesi",
            "bbox": [lon_min, lat_min, lon_max, lat_max],
        },
        "features": features,
    }

    _ensure_dir(OUTPUT_GEOJSON)
    with open(OUTPUT_GEOJSON, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False)
    print(f"[VIZ] GeoJSON kaydedildi: {OUTPUT_GEOJSON}  ({len(features)} nokta)")
