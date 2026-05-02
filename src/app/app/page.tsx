"use client";

import dynamic from "next/dynamic";
import ReportForm from "@/components/citizen/ReportForm";
import { useState } from "react";
import Link from "next/link";

const CityMap = dynamic(() => import("@/components/map/CityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <span className="text-gray-400">Harita yükleniyor...</span>
    </div>
  ),
});

export default function CitizenApp() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="h-screen w-screen flex flex-col bg-gray-950">
      {/* Navbar */}
      <nav className="flex items-center gap-3 px-4 h-12 bg-gray-900 border-b border-gray-800 shrink-0 z-[1000]">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition text-sm"
        >
          ←
        </Link>
        <div className="h-4 w-px bg-gray-700" />
        <span className="text-amber-400 font-bold text-base">LumenCity</span>
        <span className="text-gray-500 text-xs">Vatandaş Bildirimi</span>
      </nav>

      {/* Harita */}
      <div className="flex-1 relative min-h-0">
        <CityMap mode="citizen" />

        <button
          onClick={() => setShowForm(true)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-full shadow-lg transition"
        >
          Burayı Bildir
        </button>
      </div>

      {showForm && <ReportForm onClose={() => setShowForm(false)} />}
    </main>
  );
}
