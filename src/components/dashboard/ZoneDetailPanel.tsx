"use client";

import type { Zone } from "@/types";
import SavingsChart from "./SavingsChart";
import ScenarioCards from "./ScenarioCards";
import { formatKwh } from "@/lib/utils";

// MOCK DATA — AI analiz notu; Claude API'den gelecek
const MOCK_AI_NOTE =
  "Bu bölgedeki ofis binası mesai saatleri dışında (22:00–08:00) tam kapasitede aydınlatma kullanmaya devam ediyor. Hareket sensörü + zamanlayıcı kombinasyonu ile yıllık %35 enerji tasarrufu sağlanabilir."; // MOCK

// MOCK DATA — Bölgeye ait ek istatistikler; Supabase aggregation sorgusuyla gelecek
const MOCK_ZONE_META = {
  reportCount:  3,             // MOCK
  lastDetected: "2 saat önce", // MOCK
  district:     "Kadıköy",     // MOCK
};

const POI_ICON: Record<string, string> = {
  "Boş Ofis Binası":    "🏢",
  "Kapalı Otopark":     "🅿",
  "Reklam Panosu":      "📢",
  "Cadde Aydınlatması": "💡",
  "AVM Cephesi":        "🏬",
  "Park Aydınlatması":  "🌿",
};

interface ZoneDetailPanelProps {
  zone: Zone;
  onClose: () => void;
}

export default function ZoneDetailPanel({ zone, onClose }: ZoneDetailPanelProps) {
  const icon = POI_ICON[zone.name] ?? "📍";
  const savingPct = Math.round((zone.potential_saving_kwh / zone.current_kwh) * 100);

  return (
    <div className="w-[400px] h-full flex flex-col bg-slate-800 border-l border-slate-700 overflow-y-auto">

      {/* ── Başlık ── */}
      <div className="px-5 py-4 border-b border-slate-700 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base leading-none">{icon}</span>
              <h2 className="text-sm font-semibold text-white truncate">{zone.name}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-red-300 bg-red-900/50 border border-red-700/50 px-2 py-0.5 rounded-full">
                KRİTİK
              </span>
              <span className="text-[10px] text-slate-400">
                Moda Mahallesi · {MOCK_ZONE_META.district} {/* MOCK */}
              </span>
              <span className="text-[10px] text-slate-500">
                {MOCK_ZONE_META.lastDetected} {/* MOCK */}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors text-sm shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Hızlı istatistikler */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <QuickStat label="Mevcut Tüketim"  value={formatKwh(zone.current_kwh)}          color="text-red-300"     />
          <QuickStat label="Pot. Tasarruf"   value={`%${savingPct}`}                      color="text-emerald-300" />
          <QuickStat label="Bildirim"        value={`${MOCK_ZONE_META.reportCount} adet`} color="text-blue-300"    />{/* MOCK */}
        </div>
      </div>

      {/* ── Saatlik Grafik ── */}
      <div className="px-5 py-4 border-b border-slate-700 shrink-0">
        <SavingsChart zone={zone} />
      </div>

      {/* ── Senaryo Kartları ── */}
      <div className="px-5 py-4 border-b border-slate-700 shrink-0">
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-4">
          Senaryo Karşılaştırması
        </p>
        <ScenarioCards zone={zone} />
      </div>

      {/* ── AI Analiz Notu ── */}
      <div className="px-5 py-4 shrink-0">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[11px] text-amber-400">
            ✦
          </div>
          <p className="text-[10px] font-semibold tracking-widest text-amber-400/80 uppercase">
            AI Analiz Notu
          </p>
        </div>
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            {MOCK_AI_NOTE} {/* MOCK */}
          </p>
        </div>
      </div>

    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5">
      <p className={`text-sm font-bold leading-tight ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
