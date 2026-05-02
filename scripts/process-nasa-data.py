"""
NASA Black Marble -> GeoJSON dönüştürücü (lokal script, deploy edilmez)

Kullanım:
  1. NASA Earthdata'dan VNP46A1 tile'ı indir (.h5 formatında)
  2. Pilot bölge koordinatlarını BBOX ile filtrele
  3. Işık yoğunluğu noktalarını GeoJSON'a çevir
  4. public/data/pilot-zone.geojson dosyasını güncelle

Gereksinimler: pip install h5py numpy geojson
"""

import json
import sys

# Pilot bölge bounding box (Moda Mahallesi)
BBOX = {
    "min_lon": 29.025,
    "max_lon": 29.042,
    "min_lat": 40.978,
    "max_lat": 40.989,
}

def mock_generate():
    """NASA verisi olmadan test için sahte veri üret."""
    import random

    features = []
    for _ in range(50):
        lon = random.uniform(BBOX["min_lon"], BBOX["max_lon"])
        lat = random.uniform(BBOX["min_lat"], BBOX["max_lat"])
        intensity = round(random.uniform(0.1, 1.0), 2)
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": {"intensity": intensity},
        })

    geojson = {"type": "FeatureCollection", "features": features}

    output_path = "../public/data/pilot-zone.geojson"
    with open(output_path, "w") as f:
        json.dump(geojson, f, indent=2)

    print(f"{len(features)} nokta yazıldı -> {output_path}")


if __name__ == "__main__":
    if "--mock" in sys.argv:
        mock_generate()
    else:
        print("Kullanım: python process-nasa-data.py --mock")
        print("Gerçek NASA verisi için h5py ile .h5 dosyasını parse edin.")
