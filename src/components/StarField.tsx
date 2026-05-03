"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number; // 0..1 normalized
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    starsRef.current = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.4 + 0.3,
      baseAlpha: Math.random() * 0.45 + 0.12,
      twinkleSpeed: Math.random() * 0.004 + 0.001,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    let frame = 0;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const glowRadius = 130;

      for (const star of starsRef.current) {
        const sx = star.x * canvas.width;
        const sy = star.y * canvas.height;

        const dist = Math.hypot(sx - mx, sy - my);
        const proximity = Math.max(0, 1 - dist / glowRadius);
        const boost = proximity * proximity * 0.9;

        const twinkle = Math.sin(frame * star.twinkleSpeed * 60 + star.twinklePhase) * 0.07;
        const alpha = Math.min(1, star.baseAlpha + twinkle + boost);
        const r = star.size + proximity * 2.5;

        // Soft glow halo for nearby stars
        if (proximity > 0.08) {
          const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 7);
          gradient.addColorStop(0, `rgba(255, 215, 100, ${proximity * 0.45})`);
          gradient.addColorStop(1, "rgba(255, 215, 100, 0)");
          ctx.beginPath();
          ctx.arc(sx, sy, r * 7, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle =
          proximity > 0.08
            ? `rgba(255, 228, 140, ${alpha})`
            : `rgba(210, 215, 255, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
