"use client";
import { useEffect, useRef, useState } from "react";

const W = 720;
const H = 360;
const ROAD_TOP = 148;
const ROAD_BOT = 222;
const ROAD_MID = (ROAD_TOP + ROAD_BOT) / 2;
const DETECT_R  = 115;
const DIM       = 0.10;
const LERP_RATE = 0.07;

const LAMP_DEFS = [
  { x: 75,  top: true  }, { x: 215, top: true  }, { x: 355, top: true  },
  { x: 495, top: true  }, { x: 635, top: true  },
  { x: 145, top: false }, { x: 285, top: false }, { x: 425, top: false },
  { x: 565, top: false }, { x: 705, top: false },
] as const;

const TOP_WINDOWS = Array.from({ length: 28 }, (_, i) => ({
  x: ((i * 67 + 13) % (W - 16)) + 8,
  y: ((i * 41 + 7)  % (ROAD_TOP - 54)) + 6,
  lit: i % 3 !== 0,
}));
const BOT_WINDOWS = Array.from({ length: 22 }, (_, i) => ({
  x: ((i * 71 + 19) % (W - 16)) + 8,
  y: ((i * 37 + 11) % (H - ROAD_BOT - 48)) + ROAD_BOT + 38,
  lit: i % 4 !== 2,
}));

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export default function HaloSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(0);
  const brRef     = useRef<number[]>(LAMP_DEFS.map(() => DIM));
  const mouseRef  = useRef({ x: W / 2, y: ROAD_MID, active: false });
  const modeRef   = useRef<"pedestrian" | "vehicle">("pedestrian");
  const tickRef   = useRef(0);

  const [mode, setMode]       = useState<"pedestrian" | "vehicle">("pedestrian");
  const [savings, setSavings] = useState(90);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    function dist(ax: number, ay: number, bx: number, by: number) {
      return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    }

    function drawPedestrian(x: number, y: number) {
      const swing = Math.sin(tickRef.current * 0.09) * 4.5;

      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath(); ctx.ellipse(x, y + 16, 8, 3, 0, 0, Math.PI * 2); ctx.fill();

      // body glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 28);
      glow.addColorStop(0, "rgba(96,165,250,0.28)");
      glow.addColorStop(1, "rgba(96,165,250,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill();

      // legs
      ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 3.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x - 2.5, y + 8); ctx.lineTo(x - 6 + swing, y + 18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 2.5, y + 8); ctx.lineTo(x + 6 - swing, y + 18); ctx.stroke();

      // arms
      ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x - 12 - swing * 0.5, y + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 5, y); ctx.lineTo(x + 12 + swing * 0.5, y + 6); ctx.stroke();

      // torso
      ctx.fillStyle = "#2563eb"; rr(ctx, x - 5.5, y - 4, 11, 12, 3); ctx.fill();

      // head
      ctx.fillStyle = "#bfdbfe"; ctx.beginPath(); ctx.arc(x, y - 12, 7, 0, Math.PI * 2); ctx.fill();

      // eyes
      ctx.fillStyle = "#1e40af";
      ctx.beginPath(); ctx.arc(x + 2.5, y - 12, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x - 2.5, y - 12, 1.5, 0, Math.PI * 2); ctx.fill();

      // smile
      ctx.strokeStyle = "#1e40af"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(x, y - 11, 3, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    }

    function drawVehicle(x: number, y: number) {
      const CW = 50; const CH = 22;

      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath(); ctx.ellipse(x + 2, y, CW * 0.44, 4, 0, 0, Math.PI * 2); ctx.fill();

      // glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 32);
      glow.addColorStop(0, "rgba(239,68,68,0.22)");
      glow.addColorStop(1, "rgba(239,68,68,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, 32, 0, Math.PI * 2); ctx.fill();

      // headlight beam
      const beam = ctx.createLinearGradient(x - CW / 2 - 44, y, x - CW / 2, y);
      beam.addColorStop(0, "rgba(254,240,138,0)");
      beam.addColorStop(1, "rgba(254,240,138,0.14)");
      ctx.fillStyle = beam; rr(ctx, x - CW / 2 - 44, y - 18, 44, 36, 5); ctx.fill();

      // body
      ctx.fillStyle = "#dc2626"; rr(ctx, x - CW / 2, y - CH / 2, CW, CH, 5); ctx.fill();
      // roof highlight
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      rr(ctx, x - CW / 2 + 2, y - CH / 2 + 2, CW - 4, CH / 2 - 2, 3); ctx.fill();

      // front windshield
      ctx.fillStyle = "rgba(186,230,253,0.78)";
      rr(ctx, x - CW / 2 + 4, y - CH / 2 + 4, 13, CH - 8, 2); ctx.fill();
      // rear windshield
      ctx.fillStyle = "rgba(186,230,253,0.5)";
      rr(ctx, x + CW / 2 - 17, y - CH / 2 + 4, 11, CH - 8, 2); ctx.fill();

      // wheels
      ([
        [x - CW / 2 + 7, y - CH / 2 - 1],
        [x + CW / 2 - 7, y - CH / 2 - 1],
        [x - CW / 2 + 7, y + CH / 2 + 1],
        [x + CW / 2 - 7, y + CH / 2 + 1],
      ] as [number, number][]).forEach(([wx, wy]) => {
        ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.ellipse(wx, wy, 5.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#475569"; ctx.lineWidth = 1; ctx.stroke();
      });

      // headlights
      ctx.shadowColor = "rgba(254,240,138,0.9)"; ctx.shadowBlur = 8;
      ctx.fillStyle = "#fef08a";
      ctx.beginPath(); ctx.arc(x - CW / 2, y - 6, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x - CW / 2, y + 6, 3, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // taillights
      ctx.shadowColor = "rgba(252,165,165,0.8)"; ctx.shadowBlur = 6;
      ctx.fillStyle = "#fca5a5";
      ctx.beginPath(); ctx.arc(x + CW / 2, y - 6, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + CW / 2, y + 6, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
    }

    function loop() {
      tickRef.current++;
      const { x: mx, y: my, active } = mouseRef.current;
      const br = brRef.current;

      // update brightnesses
      LAMP_DEFS.forEach((def, i) => {
        const headY = def.top ? ROAD_TOP : ROAD_BOT;
        const target = active && dist(mx, my, def.x, headY) < DETECT_R ? 1.0 : DIM;
        br[i] += (target - br[i]) * LERP_RATE;
      });

      if (tickRef.current % 5 === 0) {
        const avg = br.reduce((s, b) => s + b, 0) / br.length;
        setSavings(Math.round((1 - avg) * 100));
      }

      // ── draw ──
      ctx.clearRect(0, 0, W, H);

      // buildings top
      ctx.fillStyle = "#080d1a"; ctx.fillRect(0, 0, W, ROAD_TOP - 36);
      TOP_WINDOWS.forEach(w => {
        ctx.fillStyle = w.lit ? "rgba(251,191,36,0.18)" : "rgba(30,41,59,0.6)";
        ctx.fillRect(w.x, w.y, 9, 5);
      });

      // top sidewalk
      ctx.fillStyle = "#131f33"; ctx.fillRect(0, ROAD_TOP - 36, W, 36);
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      for (let sx = 0; sx < W; sx += 24) {
        ctx.beginPath(); ctx.moveTo(sx, ROAD_TOP - 36); ctx.lineTo(sx, ROAD_TOP); ctx.stroke();
      }

      // road
      ctx.fillStyle = "#121929"; ctx.fillRect(0, ROAD_TOP, W, ROAD_BOT - ROAD_TOP);
      ctx.strokeStyle = "rgba(245,158,11,0.55)"; ctx.lineWidth = 1.5; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(0, ROAD_TOP); ctx.lineTo(W, ROAD_TOP); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, ROAD_BOT); ctx.lineTo(W, ROAD_BOT); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.setLineDash([24, 16]);
      ctx.beginPath(); ctx.moveTo(0, ROAD_MID); ctx.lineTo(W, ROAD_MID); ctx.stroke();
      ctx.setLineDash([]);

      // bottom sidewalk
      ctx.fillStyle = "#131f33"; ctx.fillRect(0, ROAD_BOT, W, 36);
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      for (let sx = 0; sx < W; sx += 24) {
        ctx.beginPath(); ctx.moveTo(sx, ROAD_BOT); ctx.lineTo(sx, ROAD_BOT + 36); ctx.stroke();
      }

      // buildings bottom
      ctx.fillStyle = "#080d1a"; ctx.fillRect(0, ROAD_BOT + 36, W, H - ROAD_BOT - 36);
      BOT_WINDOWS.forEach(w => {
        ctx.fillStyle = w.lit ? "rgba(251,191,36,0.15)" : "rgba(30,41,59,0.6)";
        ctx.fillRect(w.x, w.y, 9, 5);
      });

      // lamp glows
      LAMP_DEFS.forEach((def, i) => {
        const b = br[i];
        if (b < 0.13) return;
        const headY = def.top ? ROAD_TOP : ROAD_BOT;
        const glowY = def.top ? headY + 30 : headY - 30;
        const gr = ctx.createRadialGradient(def.x, glowY, 0, def.x, glowY, DETECT_R);
        const a = b * 0.55;
        gr.addColorStop(0,    `rgba(255,210,70,${a})`);
        gr.addColorStop(0.45, `rgba(255,165,40,${a * 0.35})`);
        gr.addColorStop(1,    "rgba(255,130,20,0)");
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(def.x, glowY, DETECT_R, 0, Math.PI * 2); ctx.fill();
      });

      // poles + lamp heads
      LAMP_DEFS.forEach((def, i) => {
        const b      = br[i];
        const hY     = def.top ? ROAD_TOP      : ROAD_BOT;
        const poleY  = def.top ? ROAD_TOP - 32 : ROAD_BOT + 32;
        const tipY   = def.top ? ROAD_TOP + 10 : ROAD_BOT - 10;

        ctx.strokeStyle = "#2d3748"; ctx.lineWidth = 2.5; ctx.lineCap = "butt";
        ctx.beginPath(); ctx.moveTo(def.x, poleY); ctx.lineTo(def.x, hY); ctx.stroke();
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(def.x, hY); ctx.lineTo(def.x, tipY); ctx.stroke();

        if (b > 0.3) { ctx.shadowColor = `rgba(251,191,36,${b * 0.85})`; ctx.shadowBlur = 16; }
        ctx.fillStyle = b > 0.3 ? `rgba(254,215,80,${0.7 + b * 0.3})` : "#2d3748";
        ctx.beginPath(); ctx.arc(def.x, tipY, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.shadowColor = "transparent";

        if (b > 0.5) {
          ctx.strokeStyle = `rgba(254,215,80,${(b - 0.5) * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(def.x, tipY, 9, 0, Math.PI * 2); ctx.stroke();
        }
      });

      // detection ring + object
      if (active) {
        ctx.strokeStyle = "rgba(96,165,250,0.22)";
        ctx.lineWidth = 1.5; ctx.setLineDash([7, 5]);
        ctx.beginPath(); ctx.arc(mx, my, DETECT_R, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);

        if (modeRef.current === "pedestrian") drawPedestrian(mx, my);
        else drawVehicle(mx, my);
      } else {
        const pulse = 0.4 + Math.sin(tickRef.current * 0.04) * 0.2;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 14px system-ui, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("Fareyi hareket ettirin →", W / 2, ROAD_MID);
        ctx.globalAlpha = 1;
      }

      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width)  * W,
      y: ((e.clientY - rect.top)  / rect.height) * H,
      active: true,
    };
  }

  return (
    <div className="flex flex-col items-center gap-5 p-6 bg-gray-900 rounded-2xl border border-gray-800">
      <div className="flex items-center gap-4 w-full justify-between">
        <h3 className="text-white font-semibold text-lg">Halo Aydınlatma Simülasyonu</h3>
        <div className="bg-gray-800 rounded-xl px-4 py-2 text-right border border-gray-700">
          <p className="text-xs text-gray-400">Anlık Tasarruf</p>
          <p className="text-2xl font-bold text-green-400">%{savings}</p>
        </div>
      </div>

      <div
        className="w-full max-w-2xl cursor-none"
        onMouseMove={onMouseMove}
        onMouseLeave={() => { mouseRef.current = { ...mouseRef.current, active: false }; }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-xl border border-gray-700 w-full block"
          style={{ aspectRatio: `${W}/${H}` }}
        />
      </div>

      <div className="flex gap-2">
        {(["pedestrian", "vehicle"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
              mode === m
                ? "bg-amber-500 text-gray-950"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            {m === "pedestrian" ? "🚶 Yaya" : "🚗 Araç"}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-xs text-center max-w-md leading-relaxed">
        Lambalar yalnızca yakınınızda yanar — boşta %{Math.round(DIM * 100)} güç, yaklaşınca %100 parlaklık.
        Mavi çember algılama alanını gösterir.
      </p>
    </div>
  );
}
