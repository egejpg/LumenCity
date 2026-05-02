import type { Zone, Scenario } from "@/types";
import { formatKwh, formatTL } from "@/lib/utils";

const TL_PER_KWH = 3.5;

interface ScenarioCardsProps {
  zone: Zone;
}

export default function ScenarioCards({ zone }: ScenarioCardsProps) {
  const scenarios: Scenario[] = [
    {
      key: "current",
      label: "Mevcut Durum",
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
      label: "Agresif Tasarruf",
      kwh_per_year: Math.round(zone.current_kwh * 0.45),
      saving_percent: 55,
      cost_saving_tl: Math.round(zone.current_kwh * 0.55 * TL_PER_KWH),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {scenarios.map((s) => (
        <div
          key={s.key}
          className={`rounded-lg p-3 border ${
            s.key === "recommended"
              ? "border-amber-500/50 bg-amber-950/30"
              : "border-gray-700 bg-gray-800/50"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-white">{s.label}</span>
            {s.key === "recommended" && (
              <span className="text-xs bg-amber-500 text-gray-950 font-bold px-2 py-0.5 rounded-full">
                AI Önerisi
              </span>
            )}
          </div>
          <p className="text-amber-400 text-sm font-semibold">
            {formatKwh(s.kwh_per_year)}/yıl
          </p>
          {s.saving_percent > 0 && (
            <p className="text-green-400 text-xs mt-0.5">
              %{s.saving_percent} azalma · {formatTL(s.cost_saving_tl)} tasarruf
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
