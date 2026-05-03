"use client";

import { useEffect, useState } from "react";
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
  onSelectReport: (report: Report) => void;
  selectedReportId: string | null;
  refreshKey?: number;
}

export default function CitizenReportsList({ onSelectReport, selectedReportId, refreshKey }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => { setReports(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const open     = reports.filter((r) => r.status !== "resolved");
  const resolved = reports.filter((r) => r.status === "resolved");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Başlık */}
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Vatandaş Şikayetleri
        </p>
        <div className="flex gap-1.5">
          <span className="text-xs font-semibold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{open.length} açık</span>
          {resolved.length > 0 && (
            <span className="text-xs font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{resolved.length} çözüldü</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2.5 px-2.5 space-y-2">
        {reports.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-slate-500 text-sm">
            Henüz şikayet yok
          </div>
        ) : (
          [...open, ...resolved].map((r) => {
            const meta = CATEGORY_META[r.category] ?? { label: r.category, icon: "📌" };
            const isSelected = r.id === selectedReportId;
            const isResolved = r.status === "resolved";
            return (
              <button
                key={r.id}
                onClick={() => onSelectReport(r)}
                className={`w-full flex items-start gap-3 px-3.5 py-3 rounded-xl transition-colors text-left border ${
                  isSelected
                    ? "bg-slate-600/70 border-slate-500"
                    : "bg-slate-700/40 hover:bg-slate-700 border-slate-700/50"
                }`}
              >
                {r.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.image_url}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center shrink-0 text-xl border border-slate-600">
                    {meta.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-semibold text-slate-100 truncate">{meta.label}</span>
                    <span className="text-xs text-slate-500 shrink-0">{timeAgo(r.created_at)}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2 mb-1.5">{r.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 truncate max-w-[160px]">
                      {r.user_email ?? (r.username ? `@${r.username}` : "anonim")}
                    </span>
                    {isResolved && (
                      <span className="text-[10px] font-semibold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">✓ çözüldü</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
