"use client";

import { useAnomalies } from "@/hooks/useAnomalies";
import { useReports } from "@/hooks/useReports";
import { formatKwh } from "@/lib/utils";
import Link from "next/link";

export default function StatsBar() {
  const { anomalies } = useAnomalies();
  const { reports } = useReports();

  const totalPotentialKwh = anomalies.reduce(
    (sum, a) => sum + (a.light_intensity - a.expected_intensity) * 8760,
    0
  );

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
      <Link href="/" className="text-amber-400 font-bold text-lg">
        LumenCity
      </Link>

      <div className="flex gap-8 text-sm">
        <div>
          <span className="text-gray-400">Anomali: </span>
          <span className="text-white font-semibold">{anomalies.length}</span>
        </div>
        <div>
          <span className="text-gray-400">Bildirim: </span>
          <span className="text-white font-semibold">{reports.length}</span>
        </div>
        <div>
          <span className="text-gray-400">Potansiyel tasarruf: </span>
          <span className="text-amber-400 font-semibold">
            {formatKwh(Math.round(totalPotentialKwh))}
          </span>
        </div>
      </div>
    </div>
  );
}
