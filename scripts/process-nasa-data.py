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
    """
    Gerçekçi ışık yoğunluğu verisi üret.
    Yüksek yoğunluk → iş merkezleri / ana caddeler (israf riski).
    Düşük yoğunluk → konut / park alanları.
    """
    import random

    # Moda Mahallesi'nde bilinen yüksek-ışık noktaları (ana cadde, ticari alan)
    hotspots = [
        (29.0333, 40.9833, 0.9),   # Moda Cad. ticari merkez
        (29.0350, 40.9850, 0.85),  # AVM girişi
        (29.0310, 40.9820, 0.80),  # Otopark (büyük)
        (29.0370, 40.9840, 0.75),  # Reklam panosu kavşağı
        (29.0320, 40.9860, 0.70),  # Boş ofis binası
        (29.0345, 40.9825, 0.65),  # Cadde arası dükkanlar
    ]

    features = []

    # Hotspot çevresine yoğun noktalar ekle (toplam ~30 yüksek-yoğunluk)
    for lon, lat, base_intensity in hotspots:
        for _ in range(5):
            offset_lon = random.gauss(0, 0.001)
            offset_lat = random.gauss(0, 0.001)
            intensity = round(max(0.4, min(1.0, base_intensity + random.uniform(-0.1, 0.1))), 2)
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [lon + offset_lon, lat + offset_lat]},
                "properties": {"intensity": intensity, "type": "commercial"},
            })

    # Konut / park alanlarına düşük-yoğunluk noktalar (~20 düşük)
    for _ in range(20):
        lon = random.uniform(BBOX["min_lon"], BBOX["max_lon"])
        lat = random.uniform(BBOX["min_lat"], BBOX["max_lat"])
        intensity = round(random.uniform(0.1, 0.35), 2)
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": {"intensity": intensity, "type": "residential"},
        })

    geojson = {"type": "FeatureCollection", "features": features}

    output_path = "../public/data/pilot-zone.geojson"
    with open(output_path, "w") as f:
        json.dump(geojson, f, indent=2)

    print(f"{len(features)} nokta yazıldı -> {output_path}")
    print(f"  Yüksek yoğunluk (>0.5): {sum(1 for f in features if f['properties']['intensity'] > 0.5)}")
    print(f"  Düşük yoğunluk (<=0.5): {sum(1 for f in features if f['properties']['intensity'] <= 0.5)}")


if __name__ == "__main__":
    if "--mock" in sys.argv:
        mock_generate()
    else:
        print("Kullanım: python process-nasa-data.py --mock")
        print("Gerçek NASA verisi için h5py ile .h5 dosyasını parse edin.")
