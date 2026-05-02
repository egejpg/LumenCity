"""
processor.py
------------
İndirilen VNP46A2 HDF5 dosyalarını okur ve birleştirir.
V002 float32: dosya içinde lat/lon dizileri mevcut, scale gerekmez.
"""

import re
import numpy as np
import h5py
from config import HDF5_LAYER, LAT_LAYER, LON_LAYER, FILL_VALUE


def _parse_date(filename: str) -> str:
    m = re.search(r"\.A(\d{4})(\d{3})\.", filename)
    if not m:
        return ""
    from datetime import datetime, timedelta
    year, doy = int(m.group(1)), int(m.group(2))
    return (datetime(year, 1, 1) + timedelta(days=doy - 1)).strftime("%Y-%m-%d")


def _tile_key(lat: np.ndarray, lon: np.ndarray) -> tuple:
    """Aynı coğrafi kapsama sahip tile'ları gruplamak için anahtar."""
    return (round(float(lat[0]), 4), round(float(lon[0]), 4))


def read_granule(path: str) -> dict | None:
    """
    Tek HDF5 dosyasını okur.
    Döner: {'data': 2D float32, 'lon': 1D, 'lat': 1D, 'date': str}
    """
    import os
    filename = os.path.basename(path)
    try:
        with h5py.File(path, "r") as f:
            data = f[HDF5_LAYER][:].astype(np.float32)
            lat  = f[LAT_LAYER][:]
            lon  = f[LON_LAYER][:]
    except Exception as e:
        print(f"  [HATA] HDF5 okunamadı: {filename} — {e}")
        return None

    data[data >= FILL_VALUE] = np.nan
    data[data < 0]           = np.nan

    return {"data": data, "lon": lon, "lat": lat, "date": _parse_date(filename)}


def process_granules(paths: list[str]) -> dict | None:
    """
    1. Tüm HDF5'leri okur
    2. Aynı tile'dan gelen günleri nanmean ile birleştirir
    3. Farklı tile'ları doğrudan array slicing ile mozaikler
    Döner: {'data': 2D ndarray float32, 'lon': 1D, 'lat': 1D}
    """
    if not paths:
        return None

    print(f"  Dosyalar okunuyor ({len(paths)} adet)...")
    granules = []
    for i, p in enumerate(paths, 1):
        g = read_granule(p)
        if g:
            granules.append(g)
        print(f"  [{i}/{len(paths)}] Okundu", end="\r", flush=True)
    print()

    if not granules:
        return None

    # ── Aynı tile'ı grupla (birden fazla günden nanmean al) ──────
    from collections import defaultdict
    groups: dict = defaultdict(list)
    for g in granules:
        groups[_tile_key(g["lat"], g["lon"])].append(g)

    tiles = []
    for key, group in groups.items():
        if len(group) == 1:
            tiles.append(group[0])
        else:
            stack = np.stack([g["data"] for g in group], axis=0)
            merged = np.nanmean(stack, axis=0).astype(np.float32)
            tiles.append({"data": merged, "lon": group[0]["lon"], "lat": group[0]["lat"]})

    print(f"  {len(tiles)} benzersiz tile mozaikleniyor...")

    if len(tiles) == 1:
        t = tiles[0]
        return {"data": t["data"], "lon": t["lon"], "lat": t["lat"]}

    # ── Ortak ızgara: tüm tile lon/lat aralıklarını kapsasın ─────
    all_lons = np.unique(np.concatenate([t["lon"] for t in tiles]))
    all_lats = np.unique(np.concatenate([t["lat"] for t in tiles]))[::-1]  # azalan

    H, W = len(all_lats), len(all_lons)
    mosaic = np.full((H, W), np.nan, dtype=np.float32)

    for t in tiles:
        # Tile'ın ortak ızgaradaki konum offset'leri
        r0 = int(np.searchsorted(-all_lats, -t["lat"][0]))
        c0 = int(np.searchsorted(all_lons, t["lon"][0]))
        r1 = r0 + t["data"].shape[0]
        c1 = c0 + t["data"].shape[1]

        r1 = min(r1, H)
        c1 = min(c1, W)
        dr = r1 - r0
        dc = c1 - c0

        # Örtüşen piksellerde nanmean al
        region = mosaic[r0:r1, c0:c1]
        patch  = t["data"][:dr, :dc]

        both_valid = np.isfinite(region) & np.isfinite(patch)
        only_new   = np.isnan(region)    & np.isfinite(patch)

        region[both_valid] = (region[both_valid] + patch[both_valid]) / 2
        region[only_new]   = patch[only_new]
        mosaic[r0:r1, c0:c1] = region

    return {"data": mosaic, "lon": all_lons, "lat": all_lats}
