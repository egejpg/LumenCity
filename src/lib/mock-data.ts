import type { Report, Anomaly, Zone } from "@/types";

// 001_initial.sql seed verileriyle birebir aynı
export const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    lat: 40.9835,
    lng: 29.0338,
    category: "bos_ofis_isigi",
    description: "Gece boyunca tüm katlar aydınlık, içeride kimse yok.",
    image_url: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r2",
    lat: 40.9852,
    lng: 29.0355,
    category: "otopark",
    description: "Gece 2 sonrası tamamen boş otopark tam güçte yanıyor.",
    image_url: null,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r3",
    lat: 40.9822,
    lng: 29.0315,
    category: "reklam_panosu",
    description: "Saat 3'te kimse görmüyor ama billboard tüm gece açık.",
    image_url: null,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r4",
    lat: 40.9842,
    lng: 29.0372,
    category: "sokak_lambasi",
    description: "Sabah 9'a kadar yanmaya devam ediyor.",
    image_url: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r5",
    lat: 40.9862,
    lng: 29.0325,
    category: "bos_ofis_isigi",
    description: "Hafta sonu ofis boş ama tüm ışıklar açık.",
    image_url: null,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_ANOMALIES: Anomaly[] = [
  {
    id: "a1",
    lat: 40.9833,
    lng: 29.0333,
    score: 85,
    light_intensity: 0.9,
    expected_intensity: 0.2,
    zone_id: "z1",
    poi_type: "Boş Ofis Binası",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a2",
    lat: 40.985,
    lng: 29.035,
    score: 72,
    light_intensity: 0.8,
    expected_intensity: 0.3,
    zone_id: "z1",
    poi_type: "Otopark",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a3",
    lat: 40.982,
    lng: 29.031,
    score: 60,
    light_intensity: 0.7,
    expected_intensity: 0.35,
    zone_id: "z1",
    poi_type: "Reklam Panosu",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a4",
    lat: 40.984,
    lng: 29.037,
    score: 45,
    light_intensity: 0.65,
    expected_intensity: 0.4,
    zone_id: "z1",
    poi_type: "Sokak Lambası",
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a5",
    lat: 40.986,
    lng: 29.032,
    score: 38,
    light_intensity: 0.6,
    expected_intensity: 0.42,
    zone_id: "z1",
    poi_type: "AVM Girişi",
    created_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
  },
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
