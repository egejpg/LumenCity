"use client";

import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { Zone } from "@/types";

// MOCK DATA — Saatlik enerji tüketim profili; gerçek sensör/SCADA verisinden gelecek
const MOCK_HOURLY = [
  { curr: 85, rec: 20 }, { curr: 85, rec: 20 }, { curr: 85, rec: 20 }, { curr: 85, rec: 20 },
  { curr: 80, rec: 20 }, { curr: 75, rec: 20 }, { curr: 65, rec: 40 }, { curr: 70, rec: 70 },
  { curr: 90, rec: 90 }, { curr: 90, rec: 90 }, { curr: 90, rec: 90 }, { curr: 90, rec: 90 },
  { curr: 90, rec: 90 }, { curr: 90, rec: 90 }, { curr: 90, rec: 90 }, { curr: 88, rec: 90 },
  { curr: 88, rec: 85 }, { curr: 85, rec: 65 }, { curr: 82, rec: 40 }, { curr: 82, rec: 20 },
  { curr: 85, rec: 20 }, { curr: 85, rec: 20 }, { curr: 85, rec: 20 }, { curr: 85, rec: 20 },
]; // MOCK

export default function SavingsChart({ zone: _zone }: { zone: Zone }) {
  const data = MOCK_HOURLY.map((d, h) => ({ // MOCK
    hour: `${String(h).padStart(2, "0")}:00`,
    Mevcut:   d.curr,
    Önerilen: d.rec,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Saatlik Kullanım Profili
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[2px] bg-red-400 rounded-full" />
            <span className="text-[10px] text-slate-400">Mevcut</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[2px] bg-emerald-400 rounded-full" />
            <span className="text-[10px] text-slate-400">Önerilen</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="gradMevcut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradOnerilen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#475569" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#64748b", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `%${v}`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              fontSize: "11px",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: "4px", fontSize: "10px" }}
            itemStyle={{ color: "#e2e8f0" }}
            formatter={(v: number, name: string) => [`%${v}`, name]}
          />
          <Area type="monotone" dataKey="Mevcut"   stroke="#f87171" strokeWidth={1.5} fill="url(#gradMevcut)"   strokeOpacity={0.9} />
          <Area type="monotone" dataKey="Önerilen" stroke="#34d399" strokeWidth={1.5} fill="url(#gradOnerilen)" strokeOpacity={0.9} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
