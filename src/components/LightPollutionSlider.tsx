"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider";

function Badge({ label, dot }: { label: string; dot: string }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-semibold tracking-wider text-white uppercase">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
      {label}
    </span>
  );
}

export default function LightPollutionSlider() {
  return (
    <div
      className="w-full mx-auto rounded-2xl overflow-hidden"
      style={{
        maxWidth: 1200,
        aspectRatio: "16 / 9",
        boxShadow:
          "0 0 0 1px rgba(245,158,11,0.15), 0 25px 60px -12px rgba(0,0,0,0.8), 0 0 80px 0 rgba(245,158,11,0.06)",
      }}
    >
      <ReactCompareSlider
        style={{ width: "100%", height: "100%" }}
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              background: "white",
              border: "none",
              boxShadow: "0 0 12px rgba(255,255,255,0.5)",
              width: 36,
              height: 36,
            }}
            linesStyle={{
              background: "rgba(255,255,255,0.85)",
              width: 2,
              boxShadow: "0 0 8px rgba(255,255,255,0.4)",
            }}
          />
        }
        itemOne={
          <div className="relative w-full h-full">
            <ReactCompareSliderImage
              src="/images/light-pollution-before.jpg.png"
              alt="Işık kirliliği altında gökyüzü"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <div className="absolute top-3 left-3">
              <Badge label="ŞİMDİ" dot="#f97316" />
            </div>
          </div>
        }
        itemTwo={
          <div className="relative w-full h-full">
            <ReactCompareSliderImage
              src="/images/light-pollution-after.jpg.png"
              alt="Işık kirliliği olmasaydı görünecek gökyüzü"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <div className="absolute top-3 right-3">
              <Badge label="OLABİLİR" dot="#f59e0b" />
            </div>
          </div>
        }
      />
    </div>
  );
}
