"use client";

import Link from "next/link";

// MOCK DATA — useAnomalies() + useReports() Supabase'e bağlandığında hooklar devreye girer
const MOCK_STATS = {
  criticalCount: 12,    // MOCK
  anomalyCount: 47,     // MOCK
  reportCount: 124,     // MOCK
  potentialKwh: 124500, // MOCK
  potentialTL: 435750,  // MOCK
};

const CHIPS = [
  { value: MOCK_STATS.criticalCount,                               label: "Kritik",         color: "red"     },
  { value: MOCK_STATS.anomalyCount,                                label: "Anomali",        color: "orange"  },
  { value: MOCK_STATS.reportCount,                                 label: "Bildirim",       color: "blue"    },
  { value: `${(MOCK_STATS.potentialKwh / 1000).toFixed(0)}K kWh`, label: "Pot. Tasarruf",  color: "amber"   },
  { value: `₺${(MOCK_STATS.potentialTL / 1000).toFixed(0)}K`,     label: "Yıllık Kazanım", color: "emerald" },
] as const;

const CHIP_STYLES: Record<string, string> = {
  red:     "text-red-300     bg-red-900/50     border-red-700/60",
  orange:  "text-orange-300  bg-orange-900/50  border-orange-700/60",
  blue:    "text-blue-300    bg-blue-900/50    border-blue-700/60",
  amber:   "text-amber-300   bg-amber-900/50   border-amber-700/60",
  emerald: "text-emerald-300 bg-emerald-900/50 border-emerald-700/60",
};

export default function AdminTopBar() {
  return (
    <header className="flex items-center justify-between px-5 h-12 bg-slate-800 border-b border-slate-700 shrink-0 z-20">
      {/* Geri + Logo */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors text-sm"
          title="Ana Sayfaya Dön"
        >
          ←
        </Link>
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex items-center gap-[3px]">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/20" />
        </div>
        <span className="text-sm font-bold text-white tracking-tight">
          Lumen<span className="text-amber-400">City</span>
        </span>
        <div className="h-3 w-px bg-slate-600 mx-0.5" />
        <span className="text-[11px] text-slate-400 font-medium">Belediye Paneli</span>
      </Link>
      </div>

      {/* Stat chips */}
      <div className="flex items-center gap-1.5">
        {CHIPS.map((chip) => (
          <div
            key={chip.label}
            className={`flex items-center gap-1.5 px-2.5 py-[5px] rounded-full border text-[11px] font-medium ${CHIP_STYLES[chip.color]}`}
          >
            <span className="font-bold">{chip.value}</span>
            <span className="opacity-60 text-[10px] font-normal">{chip.label}</span>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Moda Mahallesi · Pilot Bölge
        </div>
        <div className="h-3 w-px bg-slate-600" />
        <span className="text-slate-500 tabular-nums">2026-05-02</span>
      </div>
    </header>
  );
}
