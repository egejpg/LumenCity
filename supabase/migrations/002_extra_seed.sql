-- Ek anomali seed'leri (daha dramatik demolar için)
-- Bu dosyayı Supabase SQL Editor'a yapıştır ve çalıştır

insert into anomalies (lat, lng, score, light_intensity, expected_intensity, zone_id, poi_type) values
  (40.9828, 29.0328, 91, 0.95, 0.15, (select id from zones limit 1), 'Boş Ofis Binası'),
  (40.9843, 29.0343, 88, 0.92, 0.18, (select id from zones limit 1), 'Boş Ofis Binası'),
  (40.9857, 29.0357, 82, 0.88, 0.22, (select id from zones limit 1), 'AVM Girişi'),
  (40.9815, 29.0315, 78, 0.85, 0.25, (select id from zones limit 1), 'Otopark'),
  (40.9830, 29.0380, 74, 0.82, 0.28, (select id from zones limit 1), 'Reklam Panosu'),
  (40.9865, 29.0340, 70, 0.78, 0.30, (select id from zones limit 1), 'Sokak Lambası'),
  (40.9818, 29.0355, 65, 0.75, 0.32, (select id from zones limit 1), 'Otopark'),
  (40.9848, 29.0325, 58, 0.70, 0.36, (select id from zones limit 1), 'Reklam Panosu'),
  (40.9835, 29.0342, 52, 0.68, 0.38, (select id from zones limit 1), 'AVM Girişi'),
  (40.9822, 29.0368, 47, 0.63, 0.40, (select id from zones limit 1), 'Sokak Lambası');

-- Ek vatandaş bildirimleri
insert into reports (lat, lng, category, description) values
  (40.9829, 29.0329, 'bos_ofis_isigi', 'Ofis binasının tüm katları gece yarısı aydınlık, hafta sonu bile kapalı değil.'),
  (40.9844, 29.0344, 'reklam_panosu', 'Dev billboard sabah 4''te bile tam güçte yanıyor, seyirci yok.'),
  (40.9858, 29.0358, 'otopark', 'Kapalı otopark boş ama tüm floresan lambalar çalışıyor.'),
  (40.9816, 29.0316, 'sokak_lambasi', 'Gün doğumundan 3 saat sonrasına kadar sönmüyor.'),
  (40.9831, 29.0381, 'bos_ofis_isigi', 'Plaza gece 11''de boşalıyor ama ışıklar sabaha kadar açık kalıyor.');

-- Zone'un potansiyel tasarruf değerini güncelle (daha dramatik)
update zones
set
  potential_saving_kwh = 124000,
  anomaly_count = (select count(*) from anomalies where zone_id = zones.id)
where name = 'Moda Mahallesi';
