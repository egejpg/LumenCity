"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_W = 600;
const CANVAS_H = 400;
const LAMP_RADIUS = 80; // metre cinsinden etki alanı (piksel)
const DIM_BRIGHTNESS = 0.15;
const FULL_BRIGHTNESS = 1.0;

interface Lamp {
  x: number;
  y: number;
}

const LAMPS: Lamp[] = [
  { x: 100, y: 200 },
  { x: 200, y: 100 },
  { x: 200, y: 300 },
  { x: 400, y: 100 },
  { x: 400, y: 300 },
  { x: 500, y: 200 },
];

export default function HaloSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef({ x: 50, y: 200 });

  const [speed, setSpeed] = useState(2);
  const [mode, setMode] = useState<"pedestrian" | "vehicle">("pedestrian");
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let direction = 1;

    function dist(ax: number, ay: number, bx: number, by: number) {
      return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    }

    function draw() {
      if (!ctx || !canvas) return;

      // Arka plan — gece sokağı
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Sokak şeridi
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 160, CANVAS_W, 80);
      ctx.strokeStyle = "#ffffff22";
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(0, 200);
      ctx.lineTo(CANVAS_W, 200);
      ctx.stroke();
      ctx.setLineDash([]);

      const px = posRef.current.x;
      const py = posRef.current.y;

      // Her lambanın parlaklığını hesapla
      let dimmedCount = 0;
      LAMPS.forEach((lamp) => {
        const d = dist(px, py, lamp.x, lamp.y);
        const isActive = d < LAMP_RADIUS;
        const brightness = isActive ? FULL_BRIGHTNESS : DIM_BRIGHTNESS;
        if (!isActive) dimmedCount++;

        // Işık halosu
        const gradient = ctx.createRadialGradient(
          lamp.x, lamp.y, 0,
          lamp.x, lamp.y, LAMP_RADIUS
        );
        gradient.addColorStop(0, `rgba(255, 200, 50, ${brightness * 0.6})`);
        gradient.addColorStop(1, "rgba(255, 200, 50, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(lamp.x, lamp.y, LAMP_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Lamba gövdesi
        ctx.fillStyle = isActive ? "#fbbf24" : "#374151";
        ctx.beginPath();
        ctx.arc(lamp.x, lamp.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Tasarruf hesabı
      const savingPct = Math.round((dimmedCount / LAMPS.length) * 100 * (1 - DIM_BRIGHTNESS));
      setSavings(savingPct);

      // Hareket eden nesne (yaya/araç)
      ctx.fillStyle = mode === "pedestrian" ? "#60a5fa" : "#f87171";
      if (mode === "pedestrian") {
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(px - 16, py - 8, 32, 16);
      }

      // Yaya etrafında algılama çemberi
      ctx.strokeStyle = "rgba(96, 165, 250, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, LAMP_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
    }

    function animate() {
      posRef.current.x += speed * direction;

      if (posRef.current.x > CANVAS_W + 20) {
        posRef.current.x = -20;
      }

      draw();
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed, mode]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-900 rounded-2xl">
      <div className="flex items-center gap-4 w-full justify-between">
        <h3 className="text-white font-semibold text-lg">Halo Aydınlatma Simülasyonu</h3>
        <div className="bg-gray-800 rounded-xl px-4 py-2 text-right">
          <p className="text-xs text-gray-400">Anlık Tasarruf</p>
          <p className="text-2xl font-bold text-green-400">%{savings}</p>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-xl border border-gray-700 w-full max-w-2xl"
        style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
      />

      <div className="flex gap-6 w-full max-w-2xl">
        <div className="flex-1">
          <label className="text-xs text-gray-400 block mb-2">
            Hız: {speed}x
          </label>
          <input
            type="range"
            min={1}
            max={6}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        <div className="flex gap-2">
          {(["pedestrian", "vehicle"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                mode === m
                  ? "bg-amber-500 text-gray-950"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {m === "pedestrian" ? "Yaya" : "Araç"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-xs text-center max-w-md">
        Nesneye yakın lambalar %100, uzaktakiler %{Math.round(DIM_BRIGHTNESS * 100)} parlaklıkta çalışır.
        Mavi çember algılama yarıçapını gösterir.
      </p>
    </div>
  );
}
