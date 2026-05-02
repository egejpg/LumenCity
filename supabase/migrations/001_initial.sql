-- LumenCity initial schema
-- PostGIS uzantısı
create extension if not exists postgis;

-- Bölgeler (zones)
create table zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  geojson jsonb not null,
  anomaly_count int default 0,
  potential_saving_kwh float default 0,
  current_kwh float default 0,
  created_at timestamptz default now()
);

-- Anomaliler
create table anomalies (
  id uuid primary key default gen_random_uuid(),
  lat float not null,
  lng float not null,
  location geometry(Point, 4326) generated always as (ST_SetSRID(ST_MakePoint(lng, lat), 4326)) stored,
  score int not null check (score between 0 and 100),
  light_intensity float not null,
  expected_intensity float not null,
  zone_id uuid references zones(id),
  poi_type text not null,
  created_at timestamptz default now()
);

create index anomalies_location_idx on anomalies using gist(location);
create index anomalies_score_idx on anomalies(score desc);

-- Vatandaş bildirimleri
create table reports (
  id uuid primary key default gen_random_uuid(),
  lat float not null,
  lng float not null,
  location geometry(Point, 4326) generated always as (ST_SetSRID(ST_MakePoint(lng, lat), 4326)) stored,
  category text not null check (category in ('bos_ofis_isigi', 'reklam_panosu', 'sokak_lambasi', 'otopark', 'diger')),
  description text not null,
  image_url text,
  created_at timestamptz default now()
);

create index reports_location_idx on reports using gist(location);

-- Seed: Pilot bölge (Moda Mahallesi)
insert into zones (name, geojson, current_kwh) values
  ('Moda Mahallesi', '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[29.025,40.978],[29.042,40.978],[29.042,40.989],[29.025,40.989],[29.025,40.978]]]}}', 450000);

-- Seed: 5 örnek anomali
insert into anomalies (lat, lng, score, light_intensity, expected_intensity, zone_id, poi_type) values
  (40.9833, 29.0333, 85, 0.9, 0.2, (select id from zones limit 1), 'Boş Ofis Binası'),
  (40.9850, 29.0350, 72, 0.8, 0.3, (select id from zones limit 1), 'Otopark'),
  (40.9820, 29.0310, 60, 0.7, 0.35, (select id from zones limit 1), 'Reklam Panosu'),
  (40.9840, 29.0370, 45, 0.65, 0.4, (select id from zones limit 1), 'Sokak Lambası'),
  (40.9860, 29.0320, 38, 0.6, 0.42, (select id from zones limit 1), 'AVM Girişi');

-- Seed: 5 örnek vatandaş bildirimi
insert into reports (lat, lng, category, description) values
  (40.9835, 29.0338, 'bos_ofis_isigi', 'Gece boyunca tüm katlar aydınlık, içeride kimse yok.'),
  (40.9852, 29.0355, 'otopark', 'Gece 2 sonrası tamamen boş otopark tam güçte yanıyor.'),
  (40.9822, 29.0315, 'reklam_panosu', 'Saat 3''te kimse görmüyor ama billboard tüm gece açık.'),
  (40.9842, 29.0372, 'sokak_lambasi', 'Sabah 9''a kadar yanmaya devam ediyor.'),
  (40.9862, 29.0325, 'bos_ofis_isigi', 'Hafta sonu ofis boş ama tüm ışıklar açık.');
