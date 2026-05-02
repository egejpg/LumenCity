"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

const EarthGlobe = dynamic(() => import("@/components/EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 flex items-center justify-center" style={{ background: "#0a0a1a" }}>
      <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
    </div>
  ),
});

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <main className="text-white overflow-x-hidden">

      {/* ── Sabit yıldızlı arkaplan (CSS sınıfı — JS string yok) ── */}
      <div className="starry-bg fixed inset-0 -z-10" />

      {/* ── Sabit Globe ── */}
      <div className="fixed inset-0 z-0">
        <EarthGlobe />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a1a]/80 backdrop-blur-sm border-b border-gray-800/50">
        <span className="text-xl font-bold text-amber-400">LumenCity</span>
        <div className="flex items-center gap-3">
          <Link href="/app"   className="px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg transition">Bildirim Yap</Link>
          <Link href="/admin" className="px-4 py-1.5 text-sm border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold rounded-lg transition">Belediye Paneli</Link>
        </div>
      </nav>

      {/* ── Scrollable içerik — hero'da pointer-events-none: globe etkileşimli ── */}
      <div className="relative z-10 pointer-events-none select-none">

        {/* Hero: şeffaf, globe görünür ve sürüklenebilir */}
        <section className="h-screen flex flex-col items-center justify-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400/70 uppercase mb-4">
            NASA Black Marble · Gece Işık Haritası
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-center leading-tight mb-5">
            Şehrin Işığını<br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Optimize Et</span>
          </h1>
          <p className="text-lg text-gray-400 text-center max-w-xl px-6">
            Vatandaş bildiriyor. Yapay zeka doğruluyor.<br />Belediye karar veriyor. Tasarruf görselleşiyor.
          </p>
          <div className="flex gap-4 mt-8 pointer-events-auto">
            <Link href="/app"   className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-xl transition shadow-lg shadow-amber-500/20">Bildirim Yap →</Link>
            <Link href="/admin" className="px-6 py-3 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold rounded-xl transition backdrop-blur-sm">Belediye Paneli</Link>
          </div>
        </section>

        {/* ── Before / After — pointer-events-auto: normal etkileşim ── */}
        <section className="px-6 py-24 max-w-6xl mx-auto pointer-events-auto select-auto">

          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-400/70 uppercase mb-3">Sosyal Etki</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Gökyüzünüzü<br />
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Geri Alın</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Vatandaşlar gökyüzü fotoğrafı yükler, ışık kirliliği olmadan
              nasıl görüneceğini anında işler ve sosyal medyada paylaşılır.
              Belediyeler <span className="text-amber-300 font-medium">NASA Black Marble</span> verileriyle
              anomalileri tespit edip harekete geçer.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-6">

            <div className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-2xl" style={{ height: "400px" }}>
                <Image src="/images/ai-edited.jpg" alt="Işık kirliliği olan ve olmayan gökyüzü karşılaştırması" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold tracking-widest text-violet-300/90 uppercase bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">✦ AI İşlemi</span>
                </div>
              </div>
              <div className="px-1">
                <p className="text-sm font-medium text-white mb-1">Before / After — Tek Karede</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Kullanıcının yüklediği gökyüzü fotoğrafı işleniyor: solda ışık kirliliğiyle boğulmuş kent gökyüzü, sağda aynı gecenin yapay ışık olmadan nasıl görüneceği.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-2xl w-full">
                <Image src="/images/Bortle-Scale_Credit_International-Dark-Sky-Association-1.jpg" alt="Bortle Skalası — ışık kirliliği seviyeleri" width={1200} height={600} className="w-3/4 h-auto object-contain mx-auto" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold tracking-widest text-orange-300/90 uppercase bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">Işık Kirliliği</span>
                </div>
              </div>
              <div className="px-1">
                <p className="text-sm font-medium text-white mb-1">Bortle Skalası</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Gökyüzü parlaklığını 1'den 9'a ölçer. 1 = bozulmamış karanlık gökyüzü, 9 = iç kent. İstanbul merkezi <span className="text-orange-400">8–9 bandında</span> seyrediyor.
                </p>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-red-500/20">
                  <div className="relative w-full aspect-[4/3]">
                    <Image src="/images/sokak-lambalari-uyari.jpeg" alt="Yukarı bakan ışık yayan sokak lambası" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase bg-black/50 px-3 py-1 rounded-full text-white">⚠️ Önerilmeyen Lamba</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white mb-2">Önerilmeyen & Bildirilmesi Gereken Lamba</p>
                    <p className="text-xs text-gray-400 leading-relaxed">Önerilmeyen sokak lambası türüdür. Yetkililere bildiriniz.</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-gray-950 border border-gray-800">
                  <div className="relative w-full aspect-[4/3]">
                    <Image src="/images/sokak-lambalari-uyari.jpeg" alt="Sokak lambası — yukarı doğru ışık yayan lamba" fill className="object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold tracking-widest text-orange-300/90 uppercase bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">Sokak Lambası</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white mb-2">Sokak Lambası</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Güneş enerjisiyle çalışan ve önerilen sokak lambası.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-violet-500/30 transition max-w-xl mx-auto">
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
                { n: "02", t: "AI Dönüştürür",          d: "AI, ışık kirliliğini kaldırarak gerçek gece gökyüzünü gösterir." },
                { n: "03", t: "Paylaş & Bildir",        d: "Before/after karşılaştırmasını paylaş, belediyeye bildir." },
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
        </section>

        {/* ── Feature Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-24 max-w-5xl mx-auto pointer-events-auto select-auto">
          {[
            { icon: "🛰️", title: "NASA Gece Haritası",             desc: "NASA Black Marble verileriyle şehirdeki ışık anomalilerini tespit et ve haritalandır." },
            { icon: "📸", title: "Vatandaş Raporlama",             desc: "Gökyüzü fotoğrafı çek, AI ile ışık kirliliğini analiz et, belediyeye bildir." },
            { icon: "💡", title: "Akıllı Sokak Aydınlatması",      desc: "Hareket sensörlü aydınlatma ile enerji tasarrufu sağla, gece gökyüzünü koru." },
            { icon: "🛰️", title: "NASA Veri Entegrasyonu",         desc: "Gerçek uydu görüntülerinden enerji tüketimi anomalilerini tespit et." },
            { icon: "✦",  title: "AI Işık Kirliliği Analizi",      desc: "Yüklenen fotoğraflardan ışık kirliliğini anında tespit et ve temizle." },
            { icon: "💡", title: "Enerji Tasarrufu Optimizasyonu", desc: "AI önerileriyle yıllık %35 enerji tasarrufu, somut maliyet düşüşü." },
          ].map((card) => {
            const scaleClass = hoveredCard
              ? hoveredCard === card.title ? "scale-105" : "scale-95 opacity-80"
              : "scale-100";
            return (
              <div
                key={card.title}
                onMouseEnter={() => setHoveredCard(card.title)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-amber-500/50 transition duration-300 relative group overflow-hidden hover:shadow-2xl hover:shadow-amber-500/50 ${scaleClass}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-amber-400/30 via-transparent to-transparent" />
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-400/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </main>
  );
}
