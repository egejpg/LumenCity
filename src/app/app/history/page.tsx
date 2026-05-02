"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Report, ReportCategory } from "@/types";

const CATEGORY_META: Record<ReportCategory, { label: string; icon: string; color: string }> = {
  bos_ofis_isigi: { label: "Boş Ofis Işığı", icon: "🏢", color: "text-blue-400" },
  reklam_panosu: { label: "Reklam Panosu", icon: "📺", color: "text-purple-400" },
  sokak_lambasi: { label: "Sokak Lambası", icon: "💡", color: "text-yellow-400" },
  otopark: { label: "Otopark", icon: "🅿️", color: "text-emerald-400" },
  diger: { label: "Diğer", icon: "❓", color: "text-gray-400" },
};

const ALL_CATEGORIES: ReportCategory[] = [
  "bos_ofis_isigi",
  "reklam_panosu",
  "sokak_lambasi",
  "otopark",
  "diger",
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} gün önce`;
  if (hours > 0) return `${hours} saat önce`;
  if (mins > 0) return `${mins} dk önce`;
  return "Az önce";
}

// Bottom-sheet detay modal
function ReportDetailModal({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  const meta = CATEGORY_META[report.category];

  // ESC ile kapat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-800 rounded-t-3xl w-full max-w-lg shadow-2xl animate-slide-up"
        style={{ maxHeight: "85dvh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-3 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.icon}</span>
            <div>
              <p className={`font-bold text-base ${meta.color}`}>{meta.label}</p>
              <p className="text-gray-500 text-xs">{timeAgo(report.created_at)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Fotoğraf */}
        {report.image_url && (
          <div className="px-6 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={report.image_url}
              alt="Bildirim fotoğrafı"
              className="w-full h-52 object-cover rounded-2xl border border-gray-800"
            />
          </div>
        )}

        {/* Açıklama */}
        <div className="px-6 pb-4">
          <div className="bg-gray-900 rounded-2xl p-4">
            <p className="text-gray-400 text-xs font-medium mb-1.5">Açıklama</p>
            <p className="text-white text-sm leading-relaxed">{report.description}</p>
          </div>
        </div>

        {/* Koordinat + haritada göster */}
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>📍</span>
            <span>{report.lat.toFixed(5)}, {report.lng.toFixed(5)}</span>
          </div>
          <Link
            href={`/app?focus=${report.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-gray-950 font-bold rounded-xl transition"
          >
            🗺️ Haritada Göster
          </Link>
          <p className="text-center text-gray-600 text-xs">
            {new Date(report.created_at).toLocaleString("tr-TR")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<ReportCategory | "all">("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data: Report[]) => {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filterCategory === "all"
      ? reports
      : reports.filter((r) => r.category === filterCategory);

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-4 pt-safe-top pt-4 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/app"
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition active:scale-95"
            >
              ←
            </Link>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Bildirim Geçmişi</h1>
              <p className="text-gray-500 text-xs">{reports.length} bildirim</p>
            </div>
          </div>

          {/* Kategori filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setFilterCategory("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition active:scale-95 ${
                filterCategory === "all"
                  ? "bg-amber-500 border-amber-500 text-gray-950"
                  : "bg-gray-800 border-gray-700 text-gray-300"
              }`}
            >
              Tümü
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition active:scale-95 ${
                    filterCategory === cat
                      ? "bg-amber-500 border-amber-500 text-gray-950"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  }`}
                >
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste */}
        <div className="px-4 py-4 space-y-3 pb-safe-bottom pb-8">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-20">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Yükleniyor...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 space-y-2">
              <div className="text-4xl">🔦</div>
              <p className="text-gray-400">Henüz bildirim yok</p>
              <Link href="/app" className="text-amber-400 text-sm underline">
                İlk bildirimi yap →
              </Link>
            </div>
          )}

          {!loading &&
            filtered.map((report) => {
              const meta = CATEGORY_META[report.category];
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="w-full text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-amber-500/30 rounded-2xl p-4 transition active:scale-[0.98] group"
                >
                  <div className="flex gap-3 items-start">
                    {/* Fotoğraf thumbnail veya ikon */}
                    {report.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={report.image_url}
                        alt=""
                        className="w-14 h-14 object-cover rounded-xl border border-gray-700 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-gray-700">
                        {meta.icon}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-semibold text-sm ${meta.color}`}>{meta.label}</p>
                        <span className="text-xs text-gray-600 shrink-0">{timeAgo(report.created_at)}</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-0.5 line-clamp-2 leading-snug">
                        {report.description}
                      </p>
                      <p className="text-gray-600 text-xs mt-1.5">
                        📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                      </p>
                    </div>

                    <span className="text-gray-700 group-hover:text-amber-500 transition text-lg shrink-0">›</span>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Bottom-sheet modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.28s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
