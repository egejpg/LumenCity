"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import StarField from "@/components/StarField";
import LightPollutionSlider from "@/components/LightPollutionSlider";

const HaloSimulation = dynamic(() => import("@/components/halo/HaloSimulation"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] bg-gray-900 rounded-2xl animate-pulse" />
  ),
});

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
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClientSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="text-white overflow-x-hidden">

      {/* ── Sabit Globe ── */}
      <div className="fixed inset-0 z-0">
        <EarthGlobe />
      </div>

      {/* ── İnteraktif yıldız tuvali — globe üstünde, pointer-events-none ── */}
      <StarField />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a1a]/80 backdrop-blur-sm border-b border-gray-800/50">
        <span className="text-xl font-bold text-amber-400">LumenCity</span>
        <div className="flex items-center gap-3">
          {loggedIn === null ? null : loggedIn ? (
            <button
              onClick={async () => {
                const supabase = createClientSupabaseClient();
                await supabase.auth.signOut();
              }}
              title="Çıkış Yap"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-700 text-gray-400 hover:border-red-500/60 hover:text-red-400 transition bg-gray-900/80 backdrop-blur"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M18.36 6.64A9 9 0 1 1 5.64 5.64" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </button>
          ) : (
            <>
              <Link href="/login"             className="px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg transition">Kullanıcı Girişi</Link>
              <Link href="/login?type=staff" className="px-4 py-1.5 text-sm border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold rounded-lg transition">Personel Girişi</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Scrollable içerik — hero'da pointer-events-none: globe etkileşimli ── */}
      <div className="relative z-10 pointer-events-none select-none">

        {/* Hero: şeffaf, globe görünür ve sürüklenebilir */}
        <section className="h-screen flex flex-col items-center justify-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400/70 uppercase mb-4">
            IŞIK KİRLİLİĞİ · YAPAY ZEKA · KATILIMCI ŞEHİR
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-center leading-tight mb-5">
            Şehrin <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Karanlığa</span> İhtiyacı Var
          </h1>
          <p className="text-lg text-gray-400 text-center max-w-xl px-6">
            Boşa yanan her ışık, görünmeyen bir yıldız. Vatandaş bildiriyor, yapay zeka analiz ediyor, belediye karar veriyor — gökyüzü geri kazanıyor.
          </p>
          <div className="flex gap-4 mt-8 pointer-events-auto">
            <Link href={loggedIn ? "/app" : "/login"} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-xl transition shadow-lg shadow-amber-500/20">Bildirim Yap →</Link>
            <Link href={loggedIn ? "/admin" : "/login?type=staff"} className="px-6 py-3 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold rounded-xl transition backdrop-blur-sm">Belediye Paneli</Link>
          </div>
        </section>

        {/* ── Işık Kirliliği Slider ── */}
        <section className="px-6 py-24 pointer-events-auto select-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-400/70 uppercase mb-3">
              GERÇEK vs MÜMKÜN
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Sürükle, Farkı Gör
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Şehir ışıkları olmasaydı, başımızın üstünde Samanyolu olurdu. Aşağıdaki çubuğu sürükleyerek gökyüzünün gerçek yüzünü keşfet.
            </p>
          </div>

          <LightPollutionSlider />

          <p className="text-center text-sm text-gray-500 mt-5">
            💡 Çubuğu sağa-sola sürükleyin
          </p>
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

            <div className="relative mb-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-red-500/20">
                  <div className="relative w-full aspect-[4/3]">
                    <Image src="/images/yukarı-bakan-ısık.jpeg" alt="Yukarı bakan ışık yayan sokak lambası" fill className="object-cover" />
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

        </section>

        {/* ── Halo Simülasyonu ── */}
        <section className="px-6 py-24 max-w-4xl mx-auto pointer-events-auto select-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] text-emerald-400/70 uppercase mb-3">Adaptif Aydınlatma</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Sadece İhtiyaç Duyulduğunda<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Tam Işık</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Hareket sensörlü akıllı lambalar; yaya veya araç yaklaştığında <span className="text-emerald-300 font-medium">%100</span> parlaklığa çıkar,
              boşta yalnızca <span className="text-emerald-300 font-medium">%15</span> güç kullanır.
              Canlı simülasyonda deneyin.
            </p>
          </div>
          <HaloSimulation />
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
