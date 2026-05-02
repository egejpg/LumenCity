"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Zone } from "@/types";
import { formatKwh } from "@/lib/utils";

interface SavingsChartProps {
  zone: Zone;
}

export default function SavingsChart({ zone }: SavingsChartProps) {
  const data = [
    { name: "Mevcut", kwh: Math.round(zone.current_kwh) },
    {
      name: "Önerilen",
      kwh: Math.round(zone.current_kwh * 0.65),
    },
    {
      name: "Agresif",
      kwh: Math.round(zone.current_kwh * 0.45),
    },
  ];

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
        Yıllık Tüketim (kWh)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            tickFormatter={(v) => formatKwh(v)}
          />
          <Tooltip
            formatter={(v: number) => [formatKwh(v), "Tüketim"]}
            contentStyle={{ background: "#1f2937", border: "1px solid #374151" }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar dataKey="kwh" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
