"""
config.py
---------
Proje genelinde kullanılan sabit değerler ve NASA API ayarları.
NASA Earthdata token almak için:
  https://urs.earthdata.nasa.gov → My Profile → Generate Token
"""

# ── Kimlik Doğrulama ──────────────────────────────────────────
EARTHDATA_TOKEN = "eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6ImVnZWpwZyIsImV4cCI6MTc4MjkyNjQ5NSwiaWF0IjoxNzc3NzQyNDk1LCJpc3MiOiJodHRwczovL3Vycy5lYXJ0aGRhdGEubmFzYS5nb3YiLCJpZGVudGl0eV9wcm92aWRlciI6ImVkbF9vcHMiLCJhY3IiOiJlZGwiLCJhc3N1cmFuY2VfbGV2ZWwiOjN9.w1ijQF1fh_JCP-ns8qdyAgXeyS8Z6h5b0gjvLvPJk43OLNcUSEoO4Zszj3MTFjM0TapYnxOz1Wxg-zdWp9iVxJG_qAz5Mk5fE4hBsXzQRedCJGq1nCfnIAGbMKzJjTXIyBOrDoEMSRIy1SIz2DSKa8vtet4fQujLAQ26ki5PpQmnl8oKQUFAXBDvYU0qXnIS-rhhb37MokCOlZE3q-rfo3QGEGRFAxHhFQpdrkKm3HWBhLBsPk1aMoxoh3lITBZmrkJWrjgBEBsldGM-yH1L_bZ-duUJkGFArIsFcCOSkI-CsV3mq1sompAGUeVsbh_9LTHw4YMoI7f3LmLaJ9HcMA"

# ── Coğrafi Sınırlar ──────────────────────────────────────────
# Türkiye geneli: veri çekme için
BBOX_TURKEY = "26,36,45,42"          # lon_min, lat_min, lon_max, lat_max

# Moda Mahallesi pilot bölge: GeoJSON üretimi için
BBOX_PILOT = {
    "min_lon": 29.025, "max_lon": 29.042,
    "min_lat": 40.978, "max_lat": 40.989,
}

# ── Zaman Aralığı ─────────────────────────────────────────────
DAYS_BACK = 30

# ── NASA CMR API ──────────────────────────────────────────────
CMR_SEARCH_URL     = "https://cmr.earthdata.nasa.gov/search/granules.json"
PRODUCT_SHORT_NAME = "VNP46A2"
PRODUCT_VERSION    = "2"
PAGE_SIZE          = 50

# ── HDF5 Katman ───────────────────────────────────────────────
HDF5_LAYER   = "HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/Gap_Filled_DNB_BRDF-Corrected_NTL"
LAT_LAYER    = "HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/lat"
LON_LAYER    = "HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/lon"
SCALE_FACTOR = 1.0      # v002 float32 — zaten nW/cm²/sr biriminde
FILL_VALUE   = 65535.0

# ── Çıktı Yolları (scripts/ klasöründen çalıştırılır) ─────────
DATA_DIR        = "data/"                                     # indirilen .h5 dosyaları
OUTPUT_PNG      = "../public/data/isik_kirliligi_son1ay.png"  # matplotlib PNG
OUTPUT_HTML     = "../public/data/isik_kirliligi_harita.html" # folium HTML
OUTPUT_GEOJSON  = "../public/data/pilot-zone.geojson"         # web app heatmap
