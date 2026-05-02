"use client";

import dynamic from "next/dynamic";
import ReportForm from "@/components/citizen/ReportForm";
import { useState } from "react";

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
    <main className="relative h-screen w-screen bg-gray-950">
      <div className="absolute inset-0">
        <CityMap mode="citizen" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <span className="text-amber-400 font-bold text-lg">LumenCity</span>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-full shadow-lg transition"
      >
        Burayı Bildir
      </button>

      {showForm && <ReportForm onClose={() => setShowForm(false)} />}
    </main>
  );
}
