"use client";

import { useEffect, useRef } from "react";

export default function EarthGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let globe: { _destructor?: () => void } | null = null;
    let animFrameId: number;

    async function init() {
      const GlobeModule = await import("globe.gl");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Globe = (GlobeModule as any).default ?? GlobeModule;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g: any = typeof Globe === "function" && Globe.prototype?.constructor === Globe
        ? new Globe(containerRef.current!)
        : Globe()(containerRef.current!);

      globe = g;

      g.globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
        .backgroundColor("#0a0a1a")
        .atmosphereColor("#f59e0b")
        .atmosphereAltitude(0.18)
        .showGraticules(false)
        .showAtmosphere(true)
        .pointOfView({ lat: 41, lng: 29, altitude: 1.4 }, 0);

      // Otomatik rotasyon
      const el = containerRef.current!;

      const controls = g.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = false; // scroll wheel globe'u değil sayfayı kaydırsın
      }

      // Ctrl + scroll → globe zoom
      let altitude = 1.4;
      el.addEventListener("wheel", (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          altitude = Math.min(4, Math.max(0.3, altitude + e.deltaY * 0.001));
          g.pointOfView({ altitude }, 80);
        }
        // Ctrl yoksa: tarayıcı sayfayı kaydırır, globe dokunmaz
      }, { passive: false });

      const stopOnDrag = () => { if (controls) controls.autoRotate = false; };
      const resumeOnRelease = () => { if (controls) controls.autoRotate = true; };
      el.addEventListener("mousedown", stopOnDrag);
      el.addEventListener("touchstart", stopOnDrag, { passive: true });
      window.addEventListener("mouseup", resumeOnRelease);
      window.addEventListener("touchend", resumeOnRelease);

      const tick = () => { animFrameId = requestAnimationFrame(tick); };
      tick();
    }

    init();

    return () => {
      cancelAnimationFrame(animFrameId);
      if (globe?._destructor) globe._destructor();
    };
  }, []);

  return (
    <div
      className="relative w-full"
      style={{ height: "100vh", background: "#0a0a1a" }}
    >
      {/* Glow halkası */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <div
          style={{
            width: "60vmin",
            height: "60vmin",
            borderRadius: "50%",
            boxShadow: "0 0 120px 40px rgba(245,158,11,0.12), 0 0 60px 20px rgba(245,158,11,0.08)",
          }}
        />
      </div>

      {/* Globe container */}
      <div ref={containerRef} className="w-full h-full" style={{ zIndex: 2, position: "relative" }} />

      {/* Zoom hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-gray-600 tracking-wide" style={{ zIndex: 10 }}>
        Döndür: sürükle &nbsp;·&nbsp; Yakınlaştır: Ctrl + kaydır
      </div>
    </div>
  );
}
