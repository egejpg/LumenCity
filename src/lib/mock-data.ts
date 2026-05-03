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
  // ── İstanbul – Kadıköy ──
  { id: "a01", lat: 40.9912, lng: 29.0287, score: 87, light_intensity: 0.92, expected_intensity: 0.18, zone_id: "z1", poi_type: "Açık Otopark",           created_at: new Date(Date.now() -  1 * 3600000).toISOString() },
  { id: "a02", lat: 40.9874, lng: 29.0341, score: 74, light_intensity: 0.81, expected_intensity: 0.28, zone_id: "z1", poi_type: "Reklam Panosu",           created_at: new Date(Date.now() -  4 * 3600000).toISOString() },
  { id: "a03", lat: 40.9853, lng: 29.0198, score: 61, light_intensity: 0.71, expected_intensity: 0.34, zone_id: "z1", poi_type: "Akaryakıt İstasyonu",     created_at: new Date(Date.now() -  9 * 3600000).toISOString() },
  // ── İstanbul – Beşiktaş ──
  { id: "a04", lat: 41.0432, lng: 29.0058, score: 93, light_intensity: 0.97, expected_intensity: 0.15, zone_id: "z2", poi_type: "Reklam Panosu",           created_at: new Date(Date.now() -  2 * 3600000).toISOString() },
  { id: "a05", lat: 41.0372, lng: 29.0091, score: 79, light_intensity: 0.86, expected_intensity: 0.24, zone_id: "z2", poi_type: "Spor Sahası Aydınlatması",created_at: new Date(Date.now() -  5 * 3600000).toISOString() },
  { id: "a06", lat: 41.0411, lng: 28.9983, score: 64, light_intensity: 0.73, expected_intensity: 0.31, zone_id: "z2", poi_type: "Feribot İskelesi",        created_at: new Date(Date.now() - 11 * 3600000).toISOString() },
  // ── İstanbul – Şişli ──
  { id: "a07", lat: 41.0608, lng: 28.9874, score: 89, light_intensity: 0.94, expected_intensity: 0.19, zone_id: "z3", poi_type: "AVM Dış Cephesi",         created_at: new Date(Date.now() -  1 * 3600000).toISOString() },
  { id: "a08", lat: 41.0571, lng: 28.9921, score: 76, light_intensity: 0.83, expected_intensity: 0.27, zone_id: "z3", poi_type: "Açık Otopark",            created_at: new Date(Date.now() -  6 * 3600000).toISOString() },
  { id: "a09", lat: 41.0635, lng: 28.9801, score: 58, light_intensity: 0.69, expected_intensity: 0.37, zone_id: "z3", poi_type: "Akaryakıt İstasyonu",     created_at: new Date(Date.now() - 13 * 3600000).toISOString() },
  // ── İstanbul – Ümraniye ──
  { id: "a10", lat: 41.0182, lng: 29.1241, score: 82, light_intensity: 0.89, expected_intensity: 0.22, zone_id: "z4", poi_type: "Lojistik Depo Avlusu",    created_at: new Date(Date.now() -  3 * 3600000).toISOString() },
  { id: "a11", lat: 41.0214, lng: 29.1318, score: 67, light_intensity: 0.75, expected_intensity: 0.32, zone_id: "z4", poi_type: "Otobüs Terminali",        created_at: new Date(Date.now() -  8 * 3600000).toISOString() },
  // ── İstanbul – Bağcılar ──
  { id: "a12", lat: 41.0391, lng: 28.8562, score: 71, light_intensity: 0.79, expected_intensity: 0.29, zone_id: "z5", poi_type: "Sanayi Sitesi Avlusu",    created_at: new Date(Date.now() -  7 * 3600000).toISOString() },
  { id: "a13", lat: 41.0358, lng: 28.8621, score: 55, light_intensity: 0.67, expected_intensity: 0.38, zone_id: "z5", poi_type: "Açık Otopark",            created_at: new Date(Date.now() - 16 * 3600000).toISOString() },
  // ── İstanbul – Pendik ──
  { id: "a14", lat: 40.8762, lng: 29.2318, score: 85, light_intensity: 0.91, expected_intensity: 0.20, zone_id: "z6", poi_type: "Liman Rıhtımı",           created_at: new Date(Date.now() -  2 * 3600000).toISOString() },
  { id: "a15", lat: 40.8831, lng: 29.2241, score: 69, light_intensity: 0.77, expected_intensity: 0.31, zone_id: "z6", poi_type: "Akaryakıt İstasyonu",     created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
  // ── Ankara – Çankaya ──
  { id: "a16", lat: 39.9014, lng: 32.8597, score: 91, light_intensity: 0.96, expected_intensity: 0.17, zone_id: "z7", poi_type: "Reklam Panosu",           created_at: new Date(Date.now() -  1 * 3600000).toISOString() },
  { id: "a17", lat: 39.9078, lng: 32.8541, score: 78, light_intensity: 0.85, expected_intensity: 0.25, zone_id: "z7", poi_type: "Açık Otopark",            created_at: new Date(Date.now() -  5 * 3600000).toISOString() },
  { id: "a18", lat: 39.8952, lng: 32.8631, score: 63, light_intensity: 0.72, expected_intensity: 0.33, zone_id: "z7", poi_type: "Akaryakıt İstasyonu",     created_at: new Date(Date.now() - 12 * 3600000).toISOString() },
  // ── Ankara – Keçiören ──
  { id: "a19", lat: 39.9921, lng: 32.8612, score: 74, light_intensity: 0.82, expected_intensity: 0.27, zone_id: "z8", poi_type: "Spor Sahası Aydınlatması",created_at: new Date(Date.now() -  4 * 3600000).toISOString() },
  { id: "a20", lat: 39.9875, lng: 32.8558, score: 59, light_intensity: 0.70, expected_intensity: 0.36, zone_id: "z8", poi_type: "Otobüs Terminali",        created_at: new Date(Date.now() - 14 * 3600000).toISOString() },
  // ── İzmir – Alsancak ──
  { id: "a21", lat: 38.4381, lng: 27.1412, score: 88, light_intensity: 0.93, expected_intensity: 0.19, zone_id: "z9", poi_type: "Liman Rıhtımı",           created_at: new Date(Date.now() -  2 * 3600000).toISOString() },
  { id: "a22", lat: 38.4412, lng: 27.1358, score: 72, light_intensity: 0.80, expected_intensity: 0.29, zone_id: "z9", poi_type: "Reklam Panosu",           created_at: new Date(Date.now() -  7 * 3600000).toISOString() },
  // ── İzmir – Bornova ──
  { id: "a23", lat: 38.4621, lng: 27.2218, score: 66, light_intensity: 0.75, expected_intensity: 0.32, zone_id: "z10", poi_type: "Üniversite Spor Tesisi", created_at: new Date(Date.now() -  9 * 3600000).toISOString() },
  { id: "a24", lat: 38.4571, lng: 27.2301, score: 80, light_intensity: 0.87, expected_intensity: 0.23, zone_id: "z10", poi_type: "AVM Dış Cephesi",        created_at: new Date(Date.now() -  3 * 3600000).toISOString() },
  // ── İzmir – Karşıyaka ──
  { id: "a25", lat: 38.4601, lng: 27.1118, score: 57, light_intensity: 0.68, expected_intensity: 0.37, zone_id: "z11", poi_type: "Feribot İskelesi",       created_at: new Date(Date.now() - 18 * 3600000).toISOString() },
  // ── Bursa – Nilüfer ──
  { id: "a26", lat: 40.2231, lng: 28.9812, score: 83, light_intensity: 0.90, expected_intensity: 0.21, zone_id: "z12", poi_type: "AVM Dış Cephesi",        created_at: new Date(Date.now() -  2 * 3600000).toISOString() },
  { id: "a27", lat: 40.2178, lng: 28.9751, score: 68, light_intensity: 0.76, expected_intensity: 0.31, zone_id: "z12", poi_type: "Açık Otopark",           created_at: new Date(Date.now() -  8 * 3600000).toISOString() },
  // ── Bursa – Osmangazi ──
  { id: "a28", lat: 40.1851, lng: 29.0612, score: 75, light_intensity: 0.83, expected_intensity: 0.26, zone_id: "z13", poi_type: "Stadyum Çevresi",        created_at: new Date(Date.now() -  4 * 3600000).toISOString() },
  { id: "a29", lat: 40.1921, lng: 29.0541, score: 52, light_intensity: 0.65, expected_intensity: 0.39, zone_id: "z13", poi_type: "Akaryakıt İstasyonu",    created_at: new Date(Date.now() - 20 * 3600000).toISOString() },
  // ── Antalya – Muratpaşa ──
  { id: "a30", lat: 36.8841, lng: 30.7012, score: 90, light_intensity: 0.95, expected_intensity: 0.18, zone_id: "z14", poi_type: "Reklam Panosu",          created_at: new Date(Date.now() -  1 * 3600000).toISOString() },
  { id: "a31", lat: 36.8792, lng: 30.7081, score: 76, light_intensity: 0.84, expected_intensity: 0.26, zone_id: "z14", poi_type: "Marina / Yat Limanı",    created_at: new Date(Date.now() -  6 * 3600000).toISOString() },
  { id: "a32", lat: 36.8912, lng: 30.6951, score: 61, light_intensity: 0.71, expected_intensity: 0.34, zone_id: "z14", poi_type: "Açık Otopark",           created_at: new Date(Date.now() - 13 * 3600000).toISOString() },
  // ── Adana – Seyhan ──
  { id: "a33", lat: 37.0012, lng: 35.3218, score: 84, light_intensity: 0.91, expected_intensity: 0.21, zone_id: "z15", poi_type: "Otobüs Terminali",       created_at: new Date(Date.now() -  3 * 3600000).toISOString() },
  { id: "a34", lat: 37.0078, lng: 35.3312, score: 69, light_intensity: 0.77, expected_intensity: 0.30, zone_id: "z15", poi_type: "Sanayi Sitesi Avlusu",   created_at: new Date(Date.now() -  9 * 3600000).toISOString() },
  // ── Konya – Selçuklu ──
  { id: "a35", lat: 37.8712, lng: 32.4918, score: 78, light_intensity: 0.85, expected_intensity: 0.24, zone_id: "z16", poi_type: "AVM Dış Cephesi",        created_at: new Date(Date.now() -  4 * 3600000).toISOString() },
  { id: "a36", lat: 37.8651, lng: 32.4851, score: 62, light_intensity: 0.72, expected_intensity: 0.34, zone_id: "z16", poi_type: "Spor Sahası Aydınlatması",created_at: new Date(Date.now() - 11 * 3600000).toISOString() },
  // ── Gaziantep – Şahinbey ──
  { id: "a37", lat: 37.0712, lng: 37.3812, score: 86, light_intensity: 0.92, expected_intensity: 0.20, zone_id: "z17", poi_type: "Akaryakıt İstasyonu",    created_at: new Date(Date.now() -  2 * 3600000).toISOString() },
  { id: "a38", lat: 37.0681, lng: 37.3751, score: 71, light_intensity: 0.79, expected_intensity: 0.29, zone_id: "z17", poi_type: "Lojistik Depo Avlusu",   created_at: new Date(Date.now() -  7 * 3600000).toISOString() },
  // ── Kayseri – Melikgazi ──
  { id: "a39", lat: 38.7218, lng: 35.4812, score: 73, light_intensity: 0.81, expected_intensity: 0.28, zone_id: "z18", poi_type: "Stadyum Çevresi",        created_at: new Date(Date.now() -  5 * 3600000).toISOString() },
  { id: "a40", lat: 38.7281, lng: 35.4901, score: 59, light_intensity: 0.70, expected_intensity: 0.36, zone_id: "z18", poi_type: "Açık Otopark",           created_at: new Date(Date.now() - 15 * 3600000).toISOString() },
  // ── Mersin – Yenişehir ──
  { id: "a41", lat: 36.8012, lng: 34.6318, score: 81, light_intensity: 0.88, expected_intensity: 0.22, zone_id: "z19", poi_type: "Liman Rıhtımı",          created_at: new Date(Date.now() -  3 * 3600000).toISOString() },
  { id: "a42", lat: 36.7951, lng: 34.6412, score: 65, light_intensity: 0.74, expected_intensity: 0.33, zone_id: "z19", poi_type: "Reklam Panosu",          created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
  // ── Samsun – İlkadım ──
  { id: "a43", lat: 41.2912, lng: 36.3318, score: 77, light_intensity: 0.84, expected_intensity: 0.25, zone_id: "z20", poi_type: "Feribot İskelesi",       created_at: new Date(Date.now() -  4 * 3600000).toISOString() },
  { id: "a44", lat: 41.2851, lng: 36.3412, score: 63, light_intensity: 0.72, expected_intensity: 0.34, zone_id: "z20", poi_type: "Açık Otopark",           created_at: new Date(Date.now() - 12 * 3600000).toISOString() },
  // ── Trabzon – Ortahisar ──
  { id: "a45", lat: 41.0012, lng: 39.7318, score: 82, light_intensity: 0.89, expected_intensity: 0.22, zone_id: "z21", poi_type: "Liman Rıhtımı",          created_at: new Date(Date.now() -  2 * 3600000).toISOString() },
  { id: "a46", lat: 41.0078, lng: 39.7251, score: 67, light_intensity: 0.76, expected_intensity: 0.31, zone_id: "z21", poi_type: "Spor Sahası Aydınlatması",created_at: new Date(Date.now() -  8 * 3600000).toISOString() },
  // ── Eskişehir – Odunpazarı ──
  { id: "a47", lat: 39.7712, lng: 30.5218, score: 70, light_intensity: 0.78, expected_intensity: 0.29, zone_id: "z22", poi_type: "Üniversite Spor Tesisi", created_at: new Date(Date.now() -  6 * 3600000).toISOString() },
  { id: "a48", lat: 39.7781, lng: 30.5012, score: 55, light_intensity: 0.67, expected_intensity: 0.38, zone_id: "z22", poi_type: "Akaryakıt İstasyonu",    created_at: new Date(Date.now() - 17 * 3600000).toISOString() },
  // ── Diyarbakır – Sur ──
  { id: "a49", lat: 37.9112, lng: 40.2318, score: 88, light_intensity: 0.93, expected_intensity: 0.19, zone_id: "z23", poi_type: "Otobüs Terminali",       created_at: new Date(Date.now() -  1 * 3600000).toISOString() },
  { id: "a50", lat: 37.9051, lng: 40.2251, score: 72, light_intensity: 0.80, expected_intensity: 0.28, zone_id: "z23", poi_type: "Açık Otopark",           created_at: new Date(Date.now() -  7 * 3600000).toISOString() },
  // ── Erzurum – Palandöken ──
  { id: "a51", lat: 39.9012, lng: 41.2718, score: 79, light_intensity: 0.86, expected_intensity: 0.24, zone_id: "z24", poi_type: "Kayak Merkezi Aydınlatması", created_at: new Date(Date.now() -  3 * 3600000).toISOString() },
  { id: "a52", lat: 39.9081, lng: 41.2651, score: 61, light_intensity: 0.71, expected_intensity: 0.35, zone_id: "z24", poi_type: "Stadyum Çevresi",        created_at: new Date(Date.now() - 11 * 3600000).toISOString() },
  // ── Denizli – Pamukkale ──
  { id: "a53", lat: 37.7812, lng: 29.0918, score: 85, light_intensity: 0.91, expected_intensity: 0.20, zone_id: "z25", poi_type: "Turizm Tesisi / Otel Havuzu", created_at: new Date(Date.now() -  2 * 3600000).toISOString() },
  { id: "a54", lat: 37.7751, lng: 29.0851, score: 66, light_intensity: 0.75, expected_intensity: 0.32, zone_id: "z25", poi_type: "Reklam Panosu",          created_at: new Date(Date.now() -  9 * 3600000).toISOString() },
  // ── Sakarya – Adapazarı ──
  { id: "a55", lat: 40.7712, lng: 30.3951, score: 74, light_intensity: 0.82, expected_intensity: 0.27, zone_id: "z26", poi_type: "Lojistik Depo Avlusu",   created_at: new Date(Date.now() -  5 * 3600000).toISOString() },
  { id: "a56", lat: 40.7651, lng: 30.4018, score: 57, light_intensity: 0.68, expected_intensity: 0.37, zone_id: "z26", poi_type: "Açık Otopark",           created_at: new Date(Date.now() - 14 * 3600000).toISOString() },
  // ── Düzce – Merkez ──
  { id: "a57", lat: 40.8421, lng: 31.1612, score: 80, light_intensity: 0.87, expected_intensity: 0.23, zone_id: "z27", poi_type: "Otobüs Terminali",       created_at: new Date(Date.now() -  3 * 3600000).toISOString() },
  { id: "a58", lat: 40.8398, lng: 31.1481, score: 68, light_intensity: 0.76, expected_intensity: 0.31, zone_id: "z27", poi_type: "Lojistik Depo Avlusu",   created_at: new Date(Date.now() -  8 * 3600000).toISOString() },
  { id: "a59", lat: 40.8452, lng: 31.1538, score: 75, light_intensity: 0.83, expected_intensity: 0.26, zone_id: "z27", poi_type: "Akaryakıt İstasyonu",    created_at: new Date(Date.now() -  5 * 3600000).toISOString() },
  { id: "a60", lat: 40.8411, lng: 31.1591, score: 61, light_intensity: 0.71, expected_intensity: 0.34, zone_id: "z27", poi_type: "Açık Otopark",           created_at: new Date(Date.now() - 12 * 3600000).toISOString() },
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
