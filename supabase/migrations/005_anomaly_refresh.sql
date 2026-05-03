-- Eski anomalileri temizle ve uydu görüntüsüyle tanınabilir yeni verilerle doldur
-- Supabase SQL Editor'a yapıştır ve çalıştır

DELETE FROM anomalies;

INSERT INTO anomalies (lat, lng, score, light_intensity, expected_intensity, zone_id, poi_type) VALUES
  -- İstanbul – Kadıköy
  (40.9912, 29.0287, 87, 0.92, 0.18, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  (40.9874, 29.0341, 74, 0.81, 0.28, (SELECT id FROM zones LIMIT 1), 'Reklam Panosu'),
  (40.9853, 29.0198, 61, 0.71, 0.34, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  -- İstanbul – Beşiktaş
  (41.0432, 29.0058, 93, 0.97, 0.15, (SELECT id FROM zones LIMIT 1), 'Reklam Panosu'),
  (41.0372, 29.0091, 79, 0.86, 0.24, (SELECT id FROM zones LIMIT 1), 'Spor Sahası Aydınlatması'),
  (41.0411, 28.9983, 64, 0.73, 0.31, (SELECT id FROM zones LIMIT 1), 'Feribot İskelesi'),
  -- İstanbul – Şişli
  (41.0608, 28.9874, 89, 0.94, 0.19, (SELECT id FROM zones LIMIT 1), 'AVM Dış Cephesi'),
  (41.0571, 28.9921, 76, 0.83, 0.27, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  (41.0635, 28.9801, 58, 0.69, 0.37, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  -- İstanbul – Ümraniye
  (41.0182, 29.1241, 82, 0.89, 0.22, (SELECT id FROM zones LIMIT 1), 'Lojistik Depo Avlusu'),
  (41.0214, 29.1318, 67, 0.75, 0.32, (SELECT id FROM zones LIMIT 1), 'Otobüs Terminali'),
  -- İstanbul – Bağcılar
  (41.0391, 28.8562, 71, 0.79, 0.29, (SELECT id FROM zones LIMIT 1), 'Sanayi Sitesi Avlusu'),
  (41.0358, 28.8621, 55, 0.67, 0.38, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  -- İstanbul – Pendik
  (40.8762, 29.2318, 85, 0.91, 0.20, (SELECT id FROM zones LIMIT 1), 'Liman Rıhtımı'),
  (40.8831, 29.2241, 69, 0.77, 0.31, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  -- Ankara – Çankaya
  (39.9014, 32.8597, 91, 0.96, 0.17, (SELECT id FROM zones LIMIT 1), 'Reklam Panosu'),
  (39.9078, 32.8541, 78, 0.85, 0.25, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  (39.8952, 32.8631, 63, 0.72, 0.33, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  -- Ankara – Keçiören
  (39.9921, 32.8612, 74, 0.82, 0.27, (SELECT id FROM zones LIMIT 1), 'Spor Sahası Aydınlatması'),
  (39.9875, 32.8558, 59, 0.70, 0.36, (SELECT id FROM zones LIMIT 1), 'Otobüs Terminali'),
  -- İzmir – Alsancak
  (38.4381, 27.1412, 88, 0.93, 0.19, (SELECT id FROM zones LIMIT 1), 'Liman Rıhtımı'),
  (38.4412, 27.1358, 72, 0.80, 0.29, (SELECT id FROM zones LIMIT 1), 'Reklam Panosu'),
  -- İzmir – Bornova
  (38.4621, 27.2218, 66, 0.75, 0.32, (SELECT id FROM zones LIMIT 1), 'Üniversite Spor Tesisi'),
  (38.4571, 27.2301, 80, 0.87, 0.23, (SELECT id FROM zones LIMIT 1), 'AVM Dış Cephesi'),
  -- İzmir – Karşıyaka
  (38.4601, 27.1118, 57, 0.68, 0.37, (SELECT id FROM zones LIMIT 1), 'Feribot İskelesi'),
  -- Bursa – Nilüfer
  (40.2231, 28.9812, 83, 0.90, 0.21, (SELECT id FROM zones LIMIT 1), 'AVM Dış Cephesi'),
  (40.2178, 28.9751, 68, 0.76, 0.31, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  -- Bursa – Osmangazi
  (40.1851, 29.0612, 75, 0.83, 0.26, (SELECT id FROM zones LIMIT 1), 'Stadyum Çevresi'),
  (40.1921, 29.0541, 52, 0.65, 0.39, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  -- Antalya – Muratpaşa
  (36.8841, 30.7012, 90, 0.95, 0.18, (SELECT id FROM zones LIMIT 1), 'Reklam Panosu'),
  (36.8792, 30.7081, 76, 0.84, 0.26, (SELECT id FROM zones LIMIT 1), 'Marina / Yat Limanı'),
  (36.8912, 30.6951, 61, 0.71, 0.34, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  -- Adana – Seyhan
  (37.0012, 35.3218, 84, 0.91, 0.21, (SELECT id FROM zones LIMIT 1), 'Otobüs Terminali'),
  (37.0078, 35.3312, 69, 0.77, 0.30, (SELECT id FROM zones LIMIT 1), 'Sanayi Sitesi Avlusu'),
  -- Konya – Selçuklu
  (37.8712, 32.4918, 78, 0.85, 0.24, (SELECT id FROM zones LIMIT 1), 'AVM Dış Cephesi'),
  (37.8651, 32.4851, 62, 0.72, 0.34, (SELECT id FROM zones LIMIT 1), 'Spor Sahası Aydınlatması'),
  -- Gaziantep – Şahinbey
  (37.0712, 37.3812, 86, 0.92, 0.20, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  (37.0681, 37.3751, 71, 0.79, 0.29, (SELECT id FROM zones LIMIT 1), 'Lojistik Depo Avlusu'),
  -- Kayseri – Melikgazi
  (38.7218, 35.4812, 73, 0.81, 0.28, (SELECT id FROM zones LIMIT 1), 'Stadyum Çevresi'),
  (38.7281, 35.4901, 59, 0.70, 0.36, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  -- Mersin – Yenişehir
  (36.8012, 34.6318, 81, 0.88, 0.22, (SELECT id FROM zones LIMIT 1), 'Liman Rıhtımı'),
  (36.7951, 34.6412, 65, 0.74, 0.33, (SELECT id FROM zones LIMIT 1), 'Reklam Panosu'),
  -- Samsun – İlkadım
  (41.2912, 36.3318, 77, 0.84, 0.25, (SELECT id FROM zones LIMIT 1), 'Feribot İskelesi'),
  (41.2851, 36.3412, 63, 0.72, 0.34, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  -- Trabzon – Ortahisar
  (41.0012, 39.7318, 82, 0.89, 0.22, (SELECT id FROM zones LIMIT 1), 'Liman Rıhtımı'),
  (41.0078, 39.7251, 67, 0.76, 0.31, (SELECT id FROM zones LIMIT 1), 'Spor Sahası Aydınlatması'),
  -- Eskişehir – Odunpazarı
  (39.7712, 30.5218, 70, 0.78, 0.29, (SELECT id FROM zones LIMIT 1), 'Üniversite Spor Tesisi'),
  (39.7781, 30.5012, 55, 0.67, 0.38, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  -- Diyarbakır – Sur
  (37.9112, 40.2318, 88, 0.93, 0.19, (SELECT id FROM zones LIMIT 1), 'Otobüs Terminali'),
  (37.9051, 40.2251, 72, 0.80, 0.28, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  -- Erzurum – Palandöken
  (39.9012, 41.2718, 79, 0.86, 0.24, (SELECT id FROM zones LIMIT 1), 'Kayak Merkezi Aydınlatması'),
  (39.9081, 41.2651, 61, 0.71, 0.35, (SELECT id FROM zones LIMIT 1), 'Stadyum Çevresi'),
  -- Denizli – Pamukkale
  (37.7812, 29.0918, 85, 0.91, 0.20, (SELECT id FROM zones LIMIT 1), 'Turizm Tesisi / Otel Havuzu'),
  (37.7751, 29.0851, 66, 0.75, 0.32, (SELECT id FROM zones LIMIT 1), 'Reklam Panosu'),
  -- Sakarya – Adapazarı
  (40.7712, 30.3951, 74, 0.82, 0.27, (SELECT id FROM zones LIMIT 1), 'Lojistik Depo Avlusu'),
  (40.7651, 30.4018, 57, 0.68, 0.37, (SELECT id FROM zones LIMIT 1), 'Açık Otopark'),
  -- Düzce – Merkez
  (40.8421, 31.1612, 80, 0.87, 0.23, (SELECT id FROM zones LIMIT 1), 'Otobüs Terminali'),
  (40.8398, 31.1481, 68, 0.76, 0.31, (SELECT id FROM zones LIMIT 1), 'Lojistik Depo Avlusu'),
  (40.8452, 31.1538, 75, 0.83, 0.26, (SELECT id FROM zones LIMIT 1), 'Akaryakıt İstasyonu'),
  (40.8411, 31.1591, 61, 0.71, 0.34, (SELECT id FROM zones LIMIT 1), 'Açık Otopark');

-- Zone anomali sayısını güncelle
UPDATE zones SET anomaly_count = (SELECT COUNT(*) FROM anomalies WHERE zone_id = zones.id);
