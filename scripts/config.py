"""
config.py
---------
Proje genelinde kullanılan sabit değerler ve NASA API ayarları.
NASA Earthdata token almak için:
  https://urs.earthdata.nasa.gov → My Profile → Generate Token
"""

# ── Kimlik Doğrulama ──────────────────────────────────────────
EARTHDATA_TOKEN = "BURAYA_TOKEN_GİR"

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
PRODUCT_VERSION    = "002"
PAGE_SIZE          = 50

# ── HDF5 Katman ───────────────────────────────────────────────
HDF5_LAYER   = "HDFEOS/GRIDS/VNP_Grid_DNB/Data Fields/DNB_BRDF-Corrected_NTL"
SCALE_FACTOR = 0.1
FILL_VALUE   = 65535

# ── Çıktı Yolları (scripts/ klasöründen çalıştırılır) ─────────
DATA_DIR        = "data/"                                     # indirilen .h5 dosyaları
OUTPUT_PNG      = "../public/data/isik_kirliligi_son1ay.png"  # matplotlib PNG
OUTPUT_HTML     = "../public/data/isik_kirliligi_harita.html" # folium HTML
OUTPUT_GEOJSON  = "../public/data/pilot-zone.geojson"         # web app heatmap
