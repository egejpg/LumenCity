"""
downloader.py
-------------
NASA CMR API üzerinden VNP46A2 HDF5 granüllerini arar ve
scripts/data/ klasörüne indirir.

- Token eksikse açıklayıcı hata verir
- Daha önce indirilmiş dosyaları atlar
- İndirme ilerleme yüzdesi gösterir
"""

import os
import requests
from datetime import datetime, timedelta, timezone
from config import (
    EARTHDATA_TOKEN, CMR_SEARCH_URL, PRODUCT_SHORT_NAME,
    PRODUCT_VERSION, BBOX_TURKEY, PAGE_SIZE, DAYS_BACK, DATA_DIR,
)


def _check_token() -> None:
    if not EARTHDATA_TOKEN or EARTHDATA_TOKEN == "BURAYA_TOKEN_GİR":
        raise ValueError(
            "\n[HATA] NASA Earthdata token'ı girilmemiş!\n"
            "  1. https://urs.earthdata.nasa.gov adresine gidin\n"
            "  2. Giriş yapın → My Profile → Generate Token\n"
            "  3. Token'ı scripts/config.py içinde EARTHDATA_TOKEN değerine yapıştırın\n"
        )


def _date_range() -> tuple[str, str]:
    end   = datetime.now(timezone.utc)
    start = end - timedelta(days=DAYS_BACK)
    fmt   = "%Y-%m-%dT%H:%M:%SZ"
    return start.strftime(fmt), end.strftime(fmt)


def search_granules() -> list[dict]:
    """CMR'de granül arar, her biri için {'url', 'filename', 'date'} döner."""
    _check_token()
    start_date, end_date = _date_range()

    params = {
        "short_name":  PRODUCT_SHORT_NAME,
        "version":     PRODUCT_VERSION,
        "temporal[]":  f"{start_date},{end_date}",
        "bounding_box": BBOX_TURKEY,
        "page_size":   PAGE_SIZE,
        "sort_key":    "start_date",
    }

    print(f"[CMR] {PRODUCT_SHORT_NAME} v{PRODUCT_VERSION} | "
          f"{start_date[:10]} → {end_date[:10]}")

    resp = requests.get(CMR_SEARCH_URL, params=params, timeout=30)
    resp.raise_for_status()

    entries = resp.json().get("feed", {}).get("entry", [])
    print(f"[CMR] {len(entries)} granül bulundu.")

    granules = []
    for entry in entries:
        for link in entry.get("links", []):
            href = link.get("href", "")
            if href.endswith(".h5"):
                granules.append({
                    "url":      href,
                    "filename": os.path.basename(href),
                    "date":     entry.get("time_start", "")[:10],
                })
                break
    return granules


def download_granules(granules: list[dict]) -> list[str]:
    """Granülleri scripts/data/ altına indirir, mevcutları atlar."""
    _check_token()
    os.makedirs(DATA_DIR, exist_ok=True)
    headers    = {"Authorization": f"Bearer {EARTHDATA_TOKEN}"}
    downloaded = []

    for i, g in enumerate(granules, 1):
        dest = os.path.join(DATA_DIR, g["filename"])

        if os.path.exists(dest):
            print(f"[{i}/{len(granules)}] Atlandı (mevcut): {g['filename']}")
            downloaded.append(dest)
            continue

        print(f"[{i}/{len(granules)}] İndiriliyor: {g['filename']}", end=" ", flush=True)
        try:
            with requests.get(g["url"], headers=headers, stream=True, timeout=120) as r:
                r.raise_for_status()
                total, written = int(r.headers.get("content-length", 0)), 0
                with open(dest, "wb") as f:
                    for chunk in r.iter_content(chunk_size=1 << 20):
                        f.write(chunk)
                        written += len(chunk)
                        if total:
                            print(f"\r[{i}/{len(granules)}] {g['filename']}  "
                                  f"{written/total*100:.1f}%", end="", flush=True)
            print(f"\r[{i}/{len(granules)}] ✓ {g['filename']}          ")
            downloaded.append(dest)
        except Exception as e:
            print(f"\r[{i}/{len(granules)}] ✗ HATA: {g['filename']} — {e}")

    return downloaded
