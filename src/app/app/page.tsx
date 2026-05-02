"use client";

import dynamic from "next/dynamic";
import ReportForm from "@/components/citizen/ReportForm";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/hooks/useRole";

const CityMap = dynamic(() => import("@/components/map/CityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 text-sm">Harita yükleniyor...</span>
      </div>
    </div>
  ),
});

// Moda Mahallesi merkezi
const DEFAULT_LAT = 40.9833;
const DEFAULT_LNG = 29.0333;

export default function CitizenApp() {
  const { role } = useRole();
  const [showForm, setShowForm] = useState(false);
  const [userLat, setUserLat] = useState(DEFAULT_LAT);
  const [userLng, setUserLng] = useState(DEFAULT_LNG);
  const [reportKey, setReportKey] = useState(0); // haritayı yenile
  const [locationWarning, setLocationWarning] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
        },
        () => {
          setLocationWarning("Doğru konum bilgisi ve yıldız bilgilerini gösterebilmek için konum izni gereklidir.");
        }
      );
    }
  }, []);

  function handleSuccess() {
    setReportKey((k) => k + 1); // haritadaki pinleri yenile
  }

  return (
    <main className="relative h-screen w-screen bg-gray-950 overflow-hidden">
      {/* Harita */}
      <div className="absolute inset-0">
        <CityMap
          key={reportKey}
          mode="citizen"
          draftPin={{ lat: userLat, lng: userLng }}
        />
      </div>

      {/* Üst bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-safe-top pt-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <span className="text-amber-400 font-bold text-lg tracking-tight">LumenCity</span>
        </div>
        <Link
          href="/app/history"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/80 backdrop-blur border border-gray-700 rounded-full text-gray-300 text-sm hover:border-amber-500/50 hover:text-amber-400 transition"
        >
          <span>📋</span>
          <span className="text-xs">Geçmiş</span>
        </Link>
      </div>

      {/* Pin koordinat ve uyarı göstergesi */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center gap-2 w-full px-4">
        {locationWarning && (
          <div className="bg-red-500/80 backdrop-blur border border-red-500 rounded-lg px-3 py-1.5 text-xs text-white text-center shadow-lg">
            ⚠️ {locationWarning}
          </div>
        )}
      </div>

      {/* Bildir butonu - Sadece citizen rolü için */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-safe-bottom pb-8 gap-2 pointer-events-none">
        {role === "citizen" ? (
          <div className="pointer-events-auto flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold rounded-2xl shadow-xl shadow-amber-500/30 transition text-base flex items-center gap-2"
            >
              <span className="text-xl">📋</span> Şikayet Bildir
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition text-base flex items-center gap-2"
            >
              <span className="text-xl">🌌</span> Gökyüzünü Keşfet
            </button>
          </div>
        ) : (
          <div className="pointer-events-auto px-6 py-3 bg-gray-800/60 backdrop-blur border border-gray-700 rounded-2xl text-gray-300 text-sm text-center">
            ℹ️ Rapor göndermek için vatandaş rolüne geçiniz
          </div>
        )}
      </div>

      {/* Bildirim formu - Sadece citizen rolü için */}
      {showForm && role === "citizen" && (
        <ReportForm
          lat={userLat}
          lng={userLng}
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </main>
  );
}
