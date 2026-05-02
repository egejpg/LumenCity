"""
main.py
-------
NASA VNP46A2 veri hattını çalıştırır:
  1. CMR'de granül ara
  2. scripts/data/ klasörüne indir
  3. HDF5 dosyalarını işle (ölçekle, birleştir)
  4. PNG / HTML / GeoJSON üret

Kullanım (scripts/ klasöründen):
    python main.py
"""

import sys
from downloader import search_granules, download_granules
from processor  import process_granules
from visualizer import save_png, save_html, save_geojson


def main() -> None:
    print("=" * 60)
    print("LumenCity — NASA Black Marble Veri Hattı")
    print("=" * 60)

    # ── 1. Arama ──────────────────────────────────────────────────
    try:
        granules = search_granules()
    except ValueError as e:
        print(e)
        sys.exit(1)

    if not granules:
        print("[HATA] Hiç granül bulunamadı. Tarih/bbox ayarlarını kontrol edin.")
        sys.exit(1)

    # ── 2. İndirme ────────────────────────────────────────────────
    paths = download_granules(granules)
    if not paths:
        print("[HATA] Hiçbir dosya indirilemedi.")
        sys.exit(1)

    print(f"\n[İŞLEM] {len(paths)} HDF5 dosyası işleniyor…")

    # ── 3. İşleme ────────────────────────────────────────────────
    result = process_granules(paths)
    if result is None:
        print("[HATA] HDF5 dosyaları işlenemedi.")
        sys.exit(1)

    shape = result["data"].shape
    valid = int((~__import__("numpy").isnan(result["data"])).sum())
    print(f"[İŞLEM] Grid: {shape[0]}×{shape[1]}, geçerli piksel: {valid:,}")

    # ── 4. Görselleştirme ─────────────────────────────────────────
    print("\n[VIZ] Çıktılar üretiliyor…")
    save_png(result)
    save_html(result)
    save_geojson(result)

    print("\n[TAMAM] Tüm çıktılar public/data/ klasörüne yazıldı.")
    print("  → isik_kirliligi_son1ay.png")
    print("  → isik_kirliligi_harita.html")
    print("  → pilot-zone.geojson  (web uygulaması heatmap)")


if __name__ == "__main__":
    main()
