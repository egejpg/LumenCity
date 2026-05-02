"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

const EarthGlobe = dynamic(() => import("@/components/EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: "100vh", background: "#0a0a1a" }}
    >
      <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
    </div>
  ),
});

/* ─── Ana Sayfa ──────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="bg-[#0a0a1a] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a1a]/80 backdrop-blur-sm border-b border-gray-800/50">
        <span className="text-xl font-bold text-amber-400">LumenCity</span>
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg transition"
          >
            Bildirim Yap
          </Link>
          <Link
            href="/admin"
            className="px-4 py-1.5 text-sm border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold rounded-lg transition"
          >
            Belediye Paneli
          </Link>
        </div>
      </nav>

      {/* Hero — Globe */}
      <div className="relative">
        <EarthGlobe />

        {/* Globe üstü metin */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400/70 uppercase mb-4">
            NASA Black Marble · Gece Işık Haritası
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-center leading-tight mb-5">
            Şehrin Işığını
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Optimize Et
            </span>
          </h1>
          <p className="text-lg text-gray-400 text-center max-w-xl px-6">
            Vatandaş bildiriyor. Yapay zeka doğruluyor.
            <br />
            Belediye karar veriyor. Tasarruf görselleşiyor.
          </p>
          <div className="flex gap-4 mt-8 pointer-events-auto">
            <Link
              href="/app"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              Bildirim Yap →
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold rounded-xl transition backdrop-blur-sm"
            >
              Belediye Paneli
            </Link>
          </div>
        </div>
      </div>

      {/* ── Before / After ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">

        {/* Başlık */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400/70 uppercase mb-3">Sosyal Etki</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Gökyüzünüzü<br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Geri Alın</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Vatandaşlar gökyüzü fotoğrafı yükler, <span className="text-violet-300 font-medium">Fal AI</span> ışık kirliliği olmadan
            nasıl görüneceğini anında işler ve sosyal medyada paylaşılır.
            Belediyeler <span className="text-amber-300 font-medium">NASA Black Marble</span> verileriyle
            anomalileri tespit edip harekete geçer.
          </p>
        </div>

        {/* Fotoğraflar */}
        <div className="flex flex-col gap-4 mb-6">

          {/* ai-edited.jpg — before/after tek karede */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl" style={{ height: "400px" }}>
              <Image
                src="/images/ai-edited.jpg"
                alt="Işık kirliliği olan ve olmayan gökyüzü karşılaştırması"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold tracking-widest text-violet-300/90 uppercase bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  ✦ Fal AI İşlemi
                </span>
              </div>
            </div>
            <div className="px-1">
              <p className="text-sm font-medium text-white mb-1">Before / After — Tek Karede</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Kullanıcının yüklediği gökyüzü fotoğrafı Fal AI tarafından işleniyor: solda ışık kirliliğiyle
                boğulmuş kent gökyüzü, sağda aynı gecenin yapay ışık olmadan nasıl görüneceği.
              </p>
            </div>
          </div>

          {/* Bortle Scale — bilgilendirici görsel */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl w-full">
              <Image
                src="/images/Bortle-Scale_Credit_International-Dark-Sky-Association-1.jpg"
                alt="Bortle Skalası — ışık kirliliği seviyeleri"
                width={1200}
                height={600}
                className="w-full h-auto object-contain"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold tracking-widest text-orange-300/90 uppercase bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  Işık Kirliliği
                </span>
              </div>
            </div>
            <div className="px-1">
              <p className="text-sm font-medium text-white mb-1">Bortle Skalası</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Gökyüzü parlaklığını 1'den 9'a ölçer. 1 = bozulmamış karanlık gökyüzü,
                9 = iç kent. İstanbul merkezi <span className="text-orange-400">8–9 bandında</span> seyrediyor.
              </p>
            </div>
          </div>

        </div>

        {/* Ok + açıklama */}
        <div className="flex items-center justify-center gap-4 mb-20">
          <span className="text-xs text-gray-500 tracking-wide">Işık kirliliği olan gökyüzü</span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-violet-400 text-sm font-bold">✦ Fal AI</span>
            <span className="text-gray-500 text-xs">→</span>
          </div>
          <span className="text-xs text-gray-500 tracking-wide">Temizlenmiş fotoğraf</span>
        </div>

        {/* ── Vatandaş Akışı ── */}
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-violet-500/30 transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-lg">📸</div>
              <div>
                <p className="font-bold text-white">Vatandaş Uygulaması</p>
                <p className="text-xs text-violet-400">Sosyal platform</p>
              </div>
            </div>
            <div className="space-y-5">
              {[
                { n: "01", t: "Gökyüzü Fotoğrafı Çek", d: "Geceleri şehrin üzerindeki kirli gökyüzünü fotoğrafla." },
                { n: "02", t: "Fal AI Dönüştürür",     d: "AI, ışık kirliliğini kaldırarak gerçek gece gökyüzünü gösterir." },
                { n: "03", t: "Paylaş & Bildir",       d: "Before/after karşılaştırmasını paylaş, belediyeye bildir." },
              ].map(({ n, t, d }) => (
                <div key={n} className="flex gap-4">
                  <span className="text-[11px] font-bold text-violet-400/60 mt-0.5 w-5 shrink-0">{n}</span>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{t}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/app" className="mt-8 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm font-medium hover:bg-violet-500/25 transition">
              Uygulamayı Aç →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards — her iki versiyon birleştirildi */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-24 max-w-5xl mx-auto">
        {[
          {
            icon: "🛰️",
            title: "Gece Şehri Haritası",
            desc: "NASA Black Marble verileriyle enerji anomalilerini tespit et.",
          },
          {
            icon: "📸",
            title: "Vatandaş Bildirimi",
            desc: "Fotoğraf çek, AI kategorize etsin, haritaya pin düşsün.",
          },
          {
            icon: "💡",
            title: "Akıllı Aydınlatma",
            desc: "Yaya hareketine göre adaptif aydınlatma ile %35 tasarruf.",
          },
          {
            icon: "🛰️",
            title: "NASA Black Marble",
            desc: "Gerçek uydu gece görüntüsünden enerji anomali haritası.",
          },
          {
            icon: "✦",
            title: "Fal AI Görüntü İşleme",
            desc: "Yüklenen gökyüzü fotoğrafından ışık kirliliği anında siliniyor.",
          },
          {
            icon: "💡",
            title: "Akıllı Tasarruf",
            desc: "AI önerisiyle yıllık %35 enerji tasarrufu, somut TL karşılığıyla.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-amber-500/30 transition"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </section>

    </main>
  );
}
