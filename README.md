# LumenCity

Proje linki: https://lumen-city-z57f.vercel.app/

**Vatandas bildiriyor. Yapay zeka dogruluyor. Belediye karar veriyor.**

LumenCity, sehirlerdeki isik kirliligini ve enerji israfini tespit etmek, gorsellistirmek ve azaltmak icin gelistirilmis akilli bir kentsel aydinlatma platformudur. NASA Black Marble uydu verileri, Claude AI goruntu analizi ve vatandas katilimini birlestirerek belediyeler ile sakinler arasinda kopru kurar.

---

## Icerik

- [Ozellikler](#ozellikler)
- [Teknoloji Yigini](#teknoloji-yigini)
- [Mimari](#mimari)
- [Yerel Kurulum](#yerel-kurulum)
- [Cevre Degiskenleri](#cevre-degiskenleri)
- [Veritabani Kurulumu](#veritabani-kurulumu)
- [Vercel Deploy](#vercel-deploy)
- [Klasor Yapisi](#klasor-yapisi)

---

## Ozellikler

### Vatandas Uygulamasi (`/app`)
- **Isik Kirliligi Bildirimi** — Fotograf yukle, Claude AI otomatik kategori atar (sokak lambasi, bos ofis isigi, reklam panosu, otopark)
- **Gokyuzu Kasifi** — Cektgin gokyuzu fotografini yukle, FAL.ai Flux ile isik kirliligi olmadan nasil gorunecegini gor
- **Canli Harita** — Leaflet uzerinde gercek zamanli bildirim pinleri ve konum tespiti
- **Bildirim Gecmisi** — Gecmis bildirimlerini, durumlarini (acik/cozuldu) ve AI analizini gor
- **Yuz Gizliligi** — face-api.js ile fotograflarda yuz algilama uyarisi

### Belediye Paneli (`/admin`)
- **Anomali Haritasi** — NASA Black Marble verileriyle tespit edilmis isik anomalilerini Leaflet uzerinde gor
- **Enerji Tasarrufu Senaryolari** — Mevcut/onerilen/agresif senaryo karsilastirmasi (%35-55 tasarruf)
- **Vatandas Sikayetleri Yonetimi** — Bildirimleri yonet, cozuldu/sil islemleri yap
- **Yeniden Boyutlandirilabilir Paneller** — Surkle-birak ile sag detay panelini genislet/daralt
- **Katman Kontrolu** — NASA Heatmap, uydu goruntusu, anomaliler, bildirimler katmanlarini ac/kapat

### Ana Sayfa
- **Interaktif Dunya Kuresi** — globe.gl ile 3D NASA Black Marble gece isik haritasi, dondurulebilir
- **Isik Kirliligi Karsilastiricisi** — Kaydirmali slider ile isikli/isiksiz gokyuzu farkini gor
- **Halo Aydinlatma Simulasyonu** — Mouse ile kontrol edilen adaptif sokak lambasi simulasyonu (yaya/arac modu)

### Kimlik Dogrulama
- Supabase Auth tabanli (e-posta / sifre)
- Iki rol: `citizen` (vatandas) ve `staff` (belediye personeli)
- Next.js middleware ile rota korumasi

---

## Teknoloji Yigini

| Katman | Teknoloji |
|--------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **UI** | React 19, Tailwind CSS, Radix UI |
| **Harita** | Leaflet / React-Leaflet, Globe.gl |
| **Veritabani** | Supabase (PostgreSQL + PostGIS) |
| **Kimlik Dogrulama** | Supabase Auth |
| **Dosya Depolama** | Supabase Storage |
| **AI — Goruntu Analizi** | Anthropic Claude Sonnet (claude-sonnet-4-6) |
| **AI — Goruntu Uretimi** | FAL.ai Flux img2img |
| **Grafik** | Recharts |
| **Canvas Animasyon** | Vanilla Canvas API (HaloSimulation) |
| **Tip Denetimi** | TypeScript (strict) |
| **Deploy** | Vercel |

---

## Mimari

```
+----------------------------------------------------------+
|                     Next.js 15 App                       |
|                                                          |
|  (landing)/   ->  Globe, slider, halo simulasyonu        |
|  (auth)/      ->  Login, register, OAuth callback        |
|  /app         ->  Vatandas haritasi + bildirim formu     |
|  /admin       ->  Belediye dashboard                     |
|  /api         ->  Route handlers (raporlar, AI, zones)   |
+------------------------+---------------------------------+
                         |
           +-------------+-------------+
           |             |             |
    Supabase DB    Anthropic API   FAL.ai API
    (reports,      (goruntu         (Flux img2img
    anomalies,     siniflandirma)   yildiz gokyuzu
    zones,                          uretimi)
    profiles)
           |
    Supabase Storage
    (bildirim fotograflari)
```

### Veri Akisi — Vatandas Bildirimi

```
Vatandas fotograf yukler
    -> /api/ai/classify  (Claude: kategori tespiti)
    -> /api/reports POST (Supabase DB + Storage)
    -> Harita uzerinde pin olarak gorunur
    -> Admin panelinde listelenir
    -> Personel cozuldu/sil uygular (/api/reports/[id] PATCH)
```

### Veri Akisi — Gokyuzu Analizi

```
Vatandas gokyuzu fotografini yukler
    -> /api/ai/stars    (Claude: takim yildizi tespiti)
    -> /api/ai/starify  (FAL.ai Flux: isiksiz gokyuzu uretimi)
    -> Before/after karsilastirma gosterilir
```

---

## Yerel Kurulum

### On Kosullar

- Node.js >= 18
- npm veya yarn
- Supabase hesabi (ucretsiz plan yeterli)
- Anthropic API anahtari — https://console.anthropic.com
- FAL.ai API anahtari — https://fal.ai/dashboard

### Adimlar

```bash
# 1. Repoyu klonla
git clone https://github.com/egejpg/lumencity.git
cd lumencity

# 2. Bagimliliklar yukle
npm install

# 3. Cevre degiskenlerini ayarla
cp .env.example .env.local
# .env.local dosyasini duzenle

# 4. Gelistirme sunucusunu baslat
npm run dev
```

Uygulama `http://localhost:3000` adresinde acilir.

---

## Cevre Degiskenleri

`.env.local` dosyasina asagidaki degerleri gir:

```env
# Supabase — Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://PROJE_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Supabase Service Role — NEXT_PUBLIC_ EKLEME, gizli tut
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-...

# FAL.ai
FAL_KEY=xxxxxxxx-xxxx-xxxx-xxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Guvenlik:** `SUPABASE_SERVICE_ROLE_KEY` yalnizca sunucu tarafinda calisir.
> `NEXT_PUBLIC_` on ekiyle istemciye gonderilmez. Asla git'e commit etme —
> `.gitignore`'da `.env.local` zaten mevcut.

---

## Veritabani Kurulumu

Supabase Dashboard → **SQL Editor** bolumunde asagidaki SQL dosyalarini **sirayla** calistir.

### 1. Temel Sema (PostGIS + tablolar)

`supabase/migrations/001_initial.sql` — `zones`, `anomalies`, `reports` tablolari ve pilot bolge seed verisi.

### 2. Storage Bucket

`supabase/migrations/002_storage_bucket.sql` — Bildirim fotograflari icin public `reports` bucket'i ve RLS politikalari.

### 3. Auth Profilleri

`supabase/migrations/003_auth.sql` — `profiles`, `posts`, `likes`, `comments` tablolari ve yeni kullanicida otomatik profil olusturan trigger.

### 4. Kullanici Rolu

`supabase/migrations/004_role.sql` — `profiles` tablosuna `role` (citizen|staff) ve `full_name` kolonlari.

### 5. Rapor Durumu ve Kullanici Takibi

`supabase/migrations/005_reports_user_status.sql` — `reports` tablosuna `user_id` ve `status` (open|resolved|deleted) kolonlari.

### 6. E-posta Denormalizasyonu

`supabase/migrations/006_reports_user_email.sql` — `reports` tablosuna `user_email` kolonu.

### 7. Schema Cache Yenileme

Tum migration'lari calistirdiktan sonra:

```sql
NOTIFY pgrst, 'reload schema';
```

Ardindan `npm run dev` sunucusunu yeniden baslat.

### 8. Anomali Seed Verisi (istege bagli)

`supabase/migrations/005_anomaly_refresh.sql` dosyasini calistirarak Turkiye genelinde 60 gercekci anomali olusturabilirsin.

---

## Vercel Deploy

### Adim 1 — Kodu GitHub'a Yukle

```bash
git init
git add .
git commit -m "feat: initial LumenCity"
git remote add origin https://github.com/egejpg/lumencity.git
git push -u origin main
```

> `.env.local` dosyasi `.gitignore`'da zaten var, commit edilmez.

### Adim 2 — Vercel'de Proje Olustur

1. https://vercel.com/new adresine git
2. **"Import Git Repository"** → GitHub reposunu sec → **Import**
3. Framework: **Next.js** (otomatik algilanir, degistirme)
4. Root Directory: `.` (degistirme)
5. Build & Output Settings: varsayilan degerleri koru

### Adim 3 — Cevre Degiskenlerini Ekle

**Settings → Environment Variables** bolumune git ve su 5 degiskeni ekle:

| Degisken | Ortam |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview + Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview + Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview + Development |
| `ANTHROPIC_API_KEY` | Production + Preview + Development |
| `FAL_KEY` | Production + Preview + Development |

Her degeri `.env.local` dosyandon kopyala.

### Adim 4 — Ilk Deploy

**Deploy** butonuna bas. Ilk build ~2 dakika surer.

Deploy tamamlandiginda Vercel sana bir URL verir: `https://lumencity-xxx.vercel.app`

### Adim 5 — Supabase'de Production URL'ini Tanimla

Bu adim olmadan auth callback calismaz.

1. Supabase Dashboard → **Authentication → URL Configuration**
2. **Site URL** alanini guncelle:
   ```
   https://lumencity-xxx.vercel.app
   ```
3. **Redirect URLs** listesine ekle:
   ```
   https://lumencity-xxx.vercel.app/api/auth/callback
   https://lumencity-xxx.vercel.app/**
   ```
4. **Save** butonuna bas.

### Adim 6 — Otomatik Deploy

Bundan sonra `main` branch'e her `git push` yaptiginda Vercel otomatik deploy eder.

```bash
git add .
git commit -m "feat: yeni ozellik"
git push  # -> Vercel otomatik deploy
```

---

## Klasor Yapisi

```
lumencity/
├── src/
│   ├── app/
│   │   ├── (landing)/        # Ana sayfa (globe, slider, halo)
│   │   ├── (auth)/           # Login, register, OAuth callback
│   │   ├── app/              # Vatandas uygulamasi + gecmis
│   │   ├── admin/            # Belediye dashboard
│   │   ├── api/
│   │   │   ├── reports/      # GET, POST, PATCH
│   │   │   ├── anomalies/    # GET
│   │   │   ├── zones/        # GET (liste + tekil + senaryolar)
│   │   │   └── ai/           # classify, stars, starify
│   │   ├── icon.svg          # Favicon (otomatik)
│   │   └── layout.tsx        # Root layout + PWA meta
│   ├── components/
│   │   ├── map/              # CityMap, ReportPin, AnomalyMarker
│   │   ├── citizen/          # ReportForm, SkyExplorer, StarryModal
│   │   ├── dashboard/        # AnomalyList, ZoneDetailPanel, vb.
│   │   ├── halo/             # HaloSimulation (canvas animasyon)
│   │   └── ui/               # Radix tabanli button, card, input
│   ├── hooks/
│   │   ├── useAnomalies.ts
│   │   ├── useReports.ts
│   │   └── useRole.ts
│   ├── lib/
│   │   ├── supabase/         # client.ts, server.ts, middleware.ts
│   │   ├── claude/           # vision.ts
│   │   ├── auth/             # getCurrentUser
│   │   ├── mock-data.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   └── types/index.ts
├── supabase/
│   └── migrations/           # 001-006 SQL migration dosyalari
├── public/
│   ├── icons/                # PWA ikonlari
│   ├── leaflet/              # Marker PNG'leri
│   ├── images/               # Landing page gorselleri
│   ├── models/               # face-api.js model dosyalari
│   ├── data/                 # GeoJSON pilot bolge
│   ├── manifest.json
│   └── sw.js
├── next.config.ts
├── tailwind.config.ts
└── .env.local                # Gizli — git'e commit ETME
```

---

## Lisans

MIT
