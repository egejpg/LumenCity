"use client";

import dynamic from "next/dynamic";

const EarthGlobe = dynamic(() => import("@/components/EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{ background: "#0a0a1a" }}
    >
      <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
    </div>
  ),
});

export default function GlobeWrapper() {
  return <EarthGlobe />;
}
