"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

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

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-20 max-w-5xl mx-auto">
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
