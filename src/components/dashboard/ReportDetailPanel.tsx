"use client";

import { useState } from "react";
import type { Report, ReportCategory } from "@/types";

const CATEGORY_META: Record<ReportCategory, { label: string; icon: string }> = {
  sokak_lambasi:  { label: "Sokak Lambası",        icon: "🔦" },
  bos_ofis_isigi: { label: "Boş Ofis Işığı",       icon: "💡" },
  reklam_panosu:  { label: "Reklam Panosu",         icon: "📋" },
  otopark:        { label: "Otopark Aydınlatması",  icon: "🅿️" },
  diger:          { label: "Diğer",                 icon: "📌" },
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

interface Props {
  report: Report;
  onClose: () => void;
  onStatusChange: (id: string, status: "resolved" | "deleted") => void;
}

export default function ReportDetailPanel({ report, onClose, onStatusChange }: Props) {
  const [loading, setLoading] = useState<"resolved" | "deleted" | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const meta = CATEGORY_META[report.category] ?? { label: report.category, icon: "📌" };

  async function updateStatus(status: "resolved" | "deleted") {
    setLoading(status);
    setApiError(null);
    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setApiError(body.error ?? `Sunucu hatası (${res.status})`);
        return;
      }
      onStatusChange(report.id, status);
      onClose();
    } catch {
      setApiError("Bağlantı hatası, tekrar deneyin.");
    } finally {
      setLoading(null);
    }
  }

  const isResolved = report.status === "resolved";

  return (
    <div className="h-full flex flex-col bg-slate-800 border-l border-slate-700 overflow-hidden">
      {/* Başlık */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.icon}</span>
          <div>
            <p className="text-xs font-semibold text-white">{meta.label}</p>
            <p className="text-[10px] text-slate-500">{timeAgo(report.created_at)}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white flex items-center justify-center text-xs transition"
        >
          ✕
        </button>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Fotoğraf */}
        {report.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={report.image_url}
            alt="Şikayet fotoğrafı"
            className="w-full rounded-xl object-cover max-h-52 border border-slate-700"
          />
        )}

        {/* Açıklama */}
        <div className="bg-slate-700/50 rounded-xl p-3 space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed">{report.description}</p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700">
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5">Bildiren</p>
              <p className="text-xs text-slate-300 font-medium break-all">
                {report.user_email ?? report.username ?? "Anonim"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5">Durum</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isResolved
                  ? "bg-green-500/20 text-green-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}>
                {isResolved ? "Çözüldü" : "Açık"}
              </span>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-slate-500 mb-0.5">Konum</p>
              <p className="text-[11px] text-slate-400 font-mono">
                {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aksiyonlar */}
      {!isResolved && (
        <div className="shrink-0 p-4 border-t border-slate-700 space-y-2">
          {apiError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
              ⚠ {apiError}
            </div>
          )}
          <button
            onClick={() => updateStatus("resolved")}
            disabled={!!loading}
            className="w-full py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading === "resolved"
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : "✓ Çözüldü Olarak İşaretle"
            }
          </button>
          <button
            onClick={() => updateStatus("deleted")}
            disabled={!!loading}
            className="w-full py-2.5 bg-slate-700 hover:bg-red-900/60 hover:border-red-500/50 disabled:opacity-50 text-slate-300 hover:text-red-300 text-sm font-medium rounded-xl border border-slate-600 transition flex items-center justify-center gap-2"
          >
            {loading === "deleted"
              ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              : "🗑 Şikayeti Sil"
            }
          </button>
        </div>
      )}

      {isResolved && (
        <div className="shrink-0 p-4 border-t border-slate-700">
          <button
            onClick={() => updateStatus("deleted")}
            disabled={!!loading}
            className="w-full py-2.5 bg-slate-700 hover:bg-red-900/60 disabled:opacity-50 text-slate-400 hover:text-red-300 text-sm font-medium rounded-xl border border-slate-600 transition"
          >
            🗑 Şikayeti Sil
          </button>
        </div>
      )}
    </div>
  );
}
