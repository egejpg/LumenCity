import type { Report, Anomaly, Zone } from "@/types";

// 001_initial.sql seed verileriyle birebir aynı
export const MOCK_REPORTS: Report[] = [
  { id: "r1",  lat: 40.9835, lng: 29.0338, category: "bos_ofis_isigi", description: "Gece boyunca tüm katlar aydınlık, içeride kimse yok.",        image_url: null, created_at: new Date(Date.now() - 2  * 3600000).toISOString() },
  { id: "r2",  lat: 40.9852, lng: 29.0355, category: "otopark",        description: "Gece 2 sonrası tamamen boş otopark tam güçte yanıyor.",        image_url: null, created_at: new Date(Date.now() - 5  * 3600000).toISOString() },
  { id: "r3",  lat: 40.9822, lng: 29.0315, category: "reklam_panosu", description: "Saat 3'te kimse görmüyor ama billboard tüm gece açık.",        image_url: null, created_at: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: "r4",  lat: 40.9842, lng: 29.0372, category: "sokak_lambasi", description: "Sabah 9'a kadar yanmaya devam ediyor.",                        image_url: null, created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "r5",  lat: 40.9862, lng: 29.0325, category: "bos_ofis_isigi", description: "Hafta sonu ofis boş ama tüm ışıklar açık.",                   image_url: null, created_at: new Date(Date.now() - 48 * 3600000).toISOString() },
  // Beşiktaş
  { id: "r6",  lat: 41.0432, lng: 29.0058, category: "reklam_panosu", description: "Çarşı meydanındaki 4 reklam panosu sabaha kadar açık.",       image_url: null, created_at: new Date(Date.now() - 3  * 3600000).toISOString() },
  { id: "r7",  lat: 41.0389, lng: 29.0101, category: "sokak_lambasi", description: "Spor kompleksi çevresi gündüz de yanıyor.",                    image_url: null, created_at: new Date(Date.now() - 7  * 3600000).toISOString() },
  // Şişli
  { id: "r8",  lat: 41.0608, lng: 28.9874, category: "bos_ofis_isigi", description: "Plaza bloğunun 12 katı hafta sonu boş ve tamamen aydınlık.", image_url: null, created_at: new Date(Date.now() - 9  * 3600000).toISOString() },
  { id: "r9",  lat: 41.0571, lng: 28.9921, category: "otopark",        description: "Kapalı otopark giriş aydınlatması 24 saat yanıyor.",          image_url: null, created_at: new Date(Date.now() - 18 * 3600000).toISOString() },
  // Üsküdar
  { id: "r10", lat: 41.0241, lng: 29.0148, category: "sokak_lambasi", description: "İskele civarı sokak lambaları gün boyu sönmüyor.",             image_url: null, created_at: new Date(Date.now() - 6  * 3600000).toISOString() },
  // Ataşehir
  { id: "r11", lat: 40.9918, lng: 29.1238, category: "reklam_panosu", description: "AVM dış cephesi ledleri gece 04:00'e kadar çalışıyor.",       image_url: null, created_at: new Date(Date.now() - 30 * 3600000).toISOString() },
  // Bakırköy
  { id: "r12", lat: 40.9812, lng: 28.8731, category: "bos_ofis_isigi", description: "Sahil yolu boyunca boş bürolar tüm gece aydınlık.",          image_url: null, created_at: new Date(Date.now() - 36 * 3600000).toISOString() },
];

export const MOCK_ANOMALIES: Anomaly[] = [
  // Kadıköy / Moda
  { id: "a1",  lat: 40.9833, lng: 29.0333, score: 85, light_intensity: 0.90, expected_intensity: 0.20, zone_id: "z1", poi_type: "Boş Ofis Binası",    created_at: new Date(Date.now() - 1  * 3600000).toISOString() },
  { id: "a2",  lat: 40.9850, lng: 29.0350, score: 72, light_intensity: 0.80, expected_intensity: 0.30, zone_id: "z1", poi_type: "Otopark",             created_at: new Date(Date.now() - 3  * 3600000).toISOString() },
  { id: "a3",  lat: 40.9820, lng: 29.0310, score: 60, light_intensity: 0.70, expected_intensity: 0.35, zone_id: "z1", poi_type: "Reklam Panosu",       created_at: new Date(Date.now() - 6  * 3600000).toISOString() },
  { id: "a4",  lat: 40.9840, lng: 29.0370, score: 45, light_intensity: 0.65, expected_intensity: 0.40, zone_id: "z1", poi_type: "Sokak Lambası",       created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
  { id: "a5",  lat: 40.9860, lng: 29.0320, score: 38, light_intensity: 0.60, expected_intensity: 0.42, zone_id: "z1", poi_type: "AVM Girişi",          created_at: new Date(Date.now() - 15 * 3600000).toISOString() },
  // Beşiktaş
  { id: "a6",  lat: 41.0432, lng: 29.0058, score: 91, light_intensity: 0.95, expected_intensity: 0.18, zone_id: "z2", poi_type: "Reklam Panosu",       created_at: new Date(Date.now() - 2  * 3600000).toISOString() },
  { id: "a7",  lat: 41.0389, lng: 29.0101, score: 78, light_intensity: 0.85, expected_intensity: 0.25, zone_id: "z2", poi_type: "Spor Kompleksi",      created_at: new Date(Date.now() - 4  * 3600000).toISOString() },
  { id: "a8",  lat: 41.0411, lng: 28.9983, score: 63, light_intensity: 0.72, expected_intensity: 0.32, zone_id: "z2", poi_type: "Sokak Lambası",       created_at: new Date(Date.now() - 8  * 3600000).toISOString() },
  // Şişli
  { id: "a9",  lat: 41.0608, lng: 28.9874, score: 88, light_intensity: 0.93, expected_intensity: 0.20, zone_id: "z3", poi_type: "Boş Ofis Binası",    created_at: new Date(Date.now() - 1  * 3600000).toISOString() },
  { id: "a10", lat: 41.0571, lng: 28.9921, score: 74, light_intensity: 0.82, expected_intensity: 0.28, zone_id: "z3", poi_type: "Otopark",             created_at: new Date(Date.now() - 5  * 3600000).toISOString() },
  { id: "a11", lat: 41.0635, lng: 28.9801, score: 55, light_intensity: 0.68, expected_intensity: 0.38, zone_id: "z3", poi_type: "AVM Dış Cephesi",    created_at: new Date(Date.now() - 11 * 3600000).toISOString() },
  // Üsküdar
  { id: "a12", lat: 41.0241, lng: 29.0148, score: 69, light_intensity: 0.76, expected_intensity: 0.30, zone_id: "z4", poi_type: "Sokak Lambası",       created_at: new Date(Date.now() - 7  * 3600000).toISOString() },
  { id: "a13", lat: 41.0198, lng: 29.0213, score: 52, light_intensity: 0.66, expected_intensity: 0.36, zone_id: "z4", poi_type: "Reklam Panosu",       created_at: new Date(Date.now() - 13 * 3600000).toISOString() },
  // Ataşehir
  { id: "a14", lat: 40.9918, lng: 29.1238, score: 82, light_intensity: 0.88, expected_intensity: 0.22, zone_id: "z5", poi_type: "AVM Dış Cephesi",    created_at: new Date(Date.now() - 2  * 3600000).toISOString() },
  { id: "a15", lat: 40.9955, lng: 29.1301, score: 66, light_intensity: 0.74, expected_intensity: 0.33, zone_id: "z5", poi_type: "Boş Ofis Binası",    created_at: new Date(Date.now() - 9  * 3600000).toISOString() },
  // Bakırköy
  { id: "a16", lat: 40.9812, lng: 28.8731, score: 76, light_intensity: 0.83, expected_intensity: 0.26, zone_id: "z6", poi_type: "Boş Ofis Binası",    created_at: new Date(Date.now() - 4  * 3600000).toISOString() },
  { id: "a17", lat: 40.9778, lng: 28.8690, score: 48, light_intensity: 0.62, expected_intensity: 0.40, zone_id: "z6", poi_type: "Sokak Lambası",       created_at: new Date(Date.now() - 20 * 3600000).toISOString() },
  // Fatih
  { id: "a18", lat: 41.0094, lng: 28.9406, score: 80, light_intensity: 0.87, expected_intensity: 0.24, zone_id: "z7", poi_type: "Tarihi Bina",        created_at: new Date(Date.now() - 3  * 3600000).toISOString() },
  { id: "a19", lat: 41.0132, lng: 28.9351, score: 58, light_intensity: 0.69, expected_intensity: 0.37, zone_id: "z7", poi_type: "Reklam Panosu",       created_at: new Date(Date.now() - 14 * 3600000).toISOString() },
  // Maltepe
  { id: "a20", lat: 40.9351, lng: 29.1302, score: 43, light_intensity: 0.61, expected_intensity: 0.41, zone_id: "z8", poi_type: "Otopark",             created_at: new Date(Date.now() - 22 * 3600000).toISOString() },
];

export const MOCK_ZONES: Zone[] = [
  {
    id: "z1",
    name: "Moda Mahallesi",
    geojson: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [29.025, 40.978],
            [29.042, 40.978],
            [29.042, 40.989],
            [29.025, 40.989],
            [29.025, 40.978],
          ],
        ],
      },
    },
    anomaly_count: 5,
    potential_saving_kwh: 124000,
    current_kwh: 450000,
  },
];

// Runtime'da eklenen bildirimleri tutmak için HMR-safe in-memory store
const globalForMock = globalThis as unknown as { runtimeReports: Report[] | undefined };
const runtimeReports = globalForMock.runtimeReports ?? [];
if (process.env.NODE_ENV !== "production") globalForMock.runtimeReports = runtimeReports;

export function addRuntimeReport(report: Report) {
  runtimeReports.unshift(report);
}

export function runtimeOnlyReports(): Report[] {
  return [...runtimeReports];
}

export function getAllReports(): Report[] {
  return [...runtimeReports, ...MOCK_REPORTS];
}
