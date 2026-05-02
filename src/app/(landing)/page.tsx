import Link from "next/link";
import RoleSwitcher from "@/components/shared/RoleSwitcher";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-xl font-bold text-amber-400">LumenCity</span>
        <RoleSwitcher />
      </nav>

      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Şehrin Işığını Optimize Et
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Vatandaş bildiriyor. Yapay zeka doğruluyor. Belediye karar veriyor.
          Tasarruf görselleşiyor.
        </p>
        <div className="flex gap-4">
          <Link
            href="/app"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg transition"
          >
            Bildirim Yap
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 border border-amber-500 text-amber-400 hover:bg-amber-500/10 font-semibold rounded-lg transition"
          >
            Belediye Paneli
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-16 max-w-5xl mx-auto">
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
            title: "Halo Aydınlatma",
            desc: "Yaya hareketine göre adaptif aydınlatma simülasyonu.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm">{card.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
