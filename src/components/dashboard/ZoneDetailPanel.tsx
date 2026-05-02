"use client";

import type { Zone } from "@/types";
import SavingsChart from "./SavingsChart";
import ScenarioCards from "./ScenarioCards";

interface ZoneDetailPanelProps {
  zone: Zone;
  onClose: () => void;
}

export default function ZoneDetailPanel({ zone, onClose }: ZoneDetailPanelProps) {
  return (
    <div className="w-96 flex-shrink-0 border-l border-gray-800 bg-gray-950 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold">{zone.name}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
          ×
        </button>
      </div>

      <div className="p-4 border-b border-gray-800">
        <SavingsChart zone={zone} />
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Senaryolar</p>
        <ScenarioCards zone={zone} />
      </div>
    </div>
  );
}
