"""
processor.py
------------
İndirilen VNP46A2 HDF5 dosyalarını okur, ölçekler ve
Türkiye coğrafi grid'ine dönüştürür.
"""

import re
import numpy as np
import h5py
from config import HDF5_LAYER, SCALE_FACTOR, FILL_VALUE


# VNP46A2: her tile 2400×2400 piksel (500 m çözünürlük)
TILE_SIZE = 2400

# Sinüzoidal projeksiyon tile sınırları
# h=0..35, v=0..17; her tile 10°×10°
def _tile_bounds(h: int, v: int) -> tuple[float, float, float, float]:
    """(lon_min, lat_min, lon_max, lat_max) döner."""
    lon_min = (h - 18) * 10.0
    lon_max = lon_min + 10.0
    lat_max = (9 - v) * 10.0
    lat_min = lat_max - 10.0
    return lon_min, lat_min, lon_max, lat_max


def _parse_tile(filename: str) -> tuple[int, int] | None:
    m = re.search(r"\.h(\d{2})v(\d{2})\.", filename)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None


def read_granule(path: str) -> dict | None:
    """
    Tek HDF5 dosyasını okur.
    Döner: {'data': np.ndarray (float), 'lon': 1D, 'lat': 1D,
             'date': str, 'tile': (h,v)}
    Hata veya okunamama durumunda None döner.
    """
    import os
    filename = os.path.basename(path)
    tile = _parse_tile(filename)
    if tile is None:
        print(f"  [UYARI] Tile bilgisi çözümlenemedi: {filename}")
        return None

    h, v = tile
    lon_min, lat_min, lon_max, lat_max = _tile_bounds(h, v)

    try:
        with h5py.File(path, "r") as f:
            ds = f[HDF5_LAYER][:]
    except Exception as e:
        print(f"  [HATA] HDF5 okunamadı: {filename} — {e}")
        return None

    data = ds.astype(np.float32)
    data[data >= FILL_VALUE] = np.nan
    data *= SCALE_FACTOR

    # Piksel merkezleri için grid
    lons = np.linspace(lon_min, lon_max, TILE_SIZE, endpoint=False) + 5.0 / TILE_SIZE
    lats = np.linspace(lat_max, lat_min, TILE_SIZE, endpoint=False) - 5.0 / TILE_SIZE

    # Dosya adından tarih: VNP46A2.A2024001. → günlük
    date_m = re.search(r"\.A(\d{4})(\d{3})\.", filename)
    date_str = ""
    if date_m:
        from datetime import datetime, timedelta
        year, doy = int(date_m.group(1)), int(date_m.group(2))
        date_str = (datetime(year, 1, 1) + timedelta(days=doy - 1)).strftime("%Y-%m-%d")

    return {"data": data, "lon": lons, "lat": lats,
            "date": date_str, "tile": (h, v)}


def process_granules(paths: list[str]) -> dict | None:
    """
    Birden fazla HDF5 dosyasını okuyup nanmean ile birleştirir.
    Döner: {'data': 2D, 'lon': 1D, 'lat': 1D}
    Tüm tileler aynı boyuttaysa yanyana yapıştırır; farklı boylam
    bantlarını desteklemek için basit lon-lat grid interpolasyonu yapar.
    """
    if not paths:
        return None

    granules = [g for g in (read_granule(p) for p in paths) if g is not None]
    if not granules:
        return None

    if len(granules) == 1:
        g = granules[0]
        return {"data": g["data"], "lon": g["lon"], "lat": g["lat"]}

    # Birden fazla granül → stack & nanmean (aynı tile, farklı günler)
    # (farklı tile desteği için basit kırpma + ortak grid yapılır)
    same_tile = len({g["tile"] for g in granules}) == 1
    if same_tile:
        stack = np.stack([g["data"] for g in granules], axis=0)
        mean  = np.nanmean(stack, axis=0)
        return {"data": mean, "lon": granules[0]["lon"], "lat": granules[0]["lat"]}

    # Farklı tile: her birini ayrı döndürüp visualizer'da işlenecek
    # Basit yaklaşım: hepsini birleştirip global lon/lat grid'e koy
    all_lons = np.concatenate([g["lon"] for g in granules])
    all_lats = np.concatenate([g["lat"] for g in granules])
    lon_min, lon_max = all_lons.min(), all_lons.max()
    lat_min, lat_max = all_lats.min(), all_lats.max()

    # Düşük çözünürlüklü birleşik grid (512×512)
    GRID = 512
    out_lons = np.linspace(lon_min, lon_max, GRID)
    out_lats = np.linspace(lat_max, lat_min, GRID)
    out_data  = np.full((GRID, GRID), np.nan, dtype=np.float32)
    out_count = np.zeros((GRID, GRID), dtype=np.int32)

    for g in granules:
        for ri, lat in enumerate(g["lat"]):
            yi = int((lat_max - lat) / (lat_max - lat_min) * (GRID - 1))
            if not (0 <= yi < GRID):
                continue
            for ci, lon in enumerate(g["lon"]):
                xi = int((lon - lon_min) / (lon_max - lon_min) * (GRID - 1))
                if not (0 <= xi < GRID):
                    continue
                val = g["data"][ri, ci]
                if not np.isnan(val):
                    if np.isnan(out_data[yi, xi]):
                        out_data[yi, xi] = val
                    else:
                        out_data[yi, xi] += val
                    out_count[yi, xi] += 1

    mask = out_count > 0
    out_data[mask] /= out_count[mask]

    return {"data": out_data, "lon": out_lons, "lat": out_lats}
