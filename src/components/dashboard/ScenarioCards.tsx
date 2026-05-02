import type { Zone, Scenario } from "@/types";
import { formatKwh, formatTL } from "@/lib/utils";

const TL_PER_KWH = 3.5;

export default function ScenarioCards({ zone }: { zone: Zone }) {
  const scenarios: Scenario[] = [
    {
      key: "current",
      label: "Mevcut",
      kwh_per_year: Math.round(zone.current_kwh),
      saving_percent: 0,
      cost_saving_tl: 0,
    },
    {
      key: "recommended",
      label: "Önerilen",
      kwh_per_year: Math.round(zone.current_kwh * 0.65),
      saving_percent: 35,
      cost_saving_tl: Math.round(zone.current_kwh * 0.35 * TL_PER_KWH),
    },
    {
      key: "aggressive",
      label: "Agresif",
      kwh_per_year: Math.round(zone.current_kwh * 0.45),
      saving_percent: 55,
      cost_saving_tl: Math.round(zone.current_kwh * 0.55 * TL_PER_KWH),
    },
  ];

  const maxKwh = scenarios[0].kwh_per_year;

  return (
    <div className="grid grid-cols-3 gap-2">
      {scenarios.map((s) => {
        const isRecommended = s.key === "recommended";
        const isAggressive  = s.key === "aggressive";

        return (
          <div
            key={s.key}
            className={`relative rounded-xl p-3 border flex flex-col gap-1.5
              ${isRecommended
                ? "bg-amber-900/30 border-amber-600/50 ring-1 ring-amber-500/20"
                : "bg-slate-700/40 border-slate-600"
              }`}
          >
            {/* AI badge */}
            {isRecommended && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-slate-900 bg-amber-400 px-2 py-[3px] rounded-full">
                ✦ AI Önerisi
              </div>
            )}

            <p className={`text-[10px] font-semibold mt-1 ${isRecommended ? "text-amber-400" : "text-slate-400"}`}>
              {s.label}
            </p>

            <div>
              <p className={`text-sm font-bold leading-tight ${
                isRecommended ? "text-amber-300" : isAggressive ? "text-emerald-300" : "text-slate-200"
              }`}>
                {formatKwh(s.kwh_per_year)}
              </p>
              <p className="text-[9px] text-slate-500">/ yıl</p>
            </div>

            {/* Görsel çubuk */}
            <div className="h-[3px] bg-slate-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  s.key === "current" ? "bg-red-400"
                  : isRecommended    ? "bg-amber-400"
                  :                    "bg-emerald-400"
                }`}
                style={{ width: `${(s.kwh_per_year / maxKwh) * 100}%` }}
              />
            </div>

            {s.saving_percent > 0 && (
              <div>
                <p className="text-[9px] font-bold text-emerald-400">↓ %{s.saving_percent}</p>
                <p className="text-[9px] text-slate-400">{formatTL(s.cost_saving_tl)}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
