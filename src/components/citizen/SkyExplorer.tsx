"use client";

import { useState, useRef } from "react";
import { useRole } from "@/hooks/useRole";

interface SkyExplorerProps {
  onClose: () => void;
  lat: number;
  lng: number;
}

type Step = "idle" | "analyzing" | "result";

interface StarData {
  generatedUrl: string;
}

export default function SkyExplorer({ onClose, lat, lng }: SkyExplorerProps) {
  const { role } = useRole();
  const [step, setStep]           = useState<Step>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [starData, setStarData]   = useState<StarData | null>(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const fileInputRef              = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep("analyzing");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/ai/starify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setStarData({ generatedUrl: data.imageUrl });
      setStep("result");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Analiz başarısız oldu. Tekrar deneyin.");
      setStep("idle");
      setPreviewUrl(null);
    }
  }

  function reset() {
    setStep("idle");
    setPreviewUrl(null);
    setStarData(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-lg shadow-2xl"
        style={{ maxHeight: "85dvh", overflowY: "auto" }}
      >
        {/* Başlık */}
        <div className="flex justify-between items-start px-6 pt-6 pb-4 border-b border-gray-800">
          <div>
            <p className="text-indigo-400/70 text-[11px] uppercase tracking-widest mb-1">Işık Kirliliği Simülasyonu</p>
            <h2 className="text-white font-bold text-xl leading-tight flex items-center gap-2">
              <span>🌌</span> Gökyüzünü Keşfet
            </h2>
            <p className="text-gray-600 text-xs mt-1">
              Fotoğrafına yıldızlar ekle — ışık kirliliği olmasaydı böyle görünürdü
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-1 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition active:scale-95"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-8 pt-5">

          {/* ADIM 1: Fotoğraf yükle */}
          {step === "idle" && (
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 rounded-2xl border-2 border-dashed border-indigo-800 hover:border-indigo-600 bg-indigo-950/20 hover:bg-indigo-950/40 flex flex-col items-center justify-center gap-3 text-indigo-400 hover:text-indigo-300 transition active:scale-[0.98]"
              >
                <span className="text-5xl">🔭</span>
                <span className="text-sm font-medium">Gökyüzü Fotoğrafı Ekle</span>
                <span className="text-xs text-indigo-600">Galeriden seç veya kamera aç</span>
              </button>

              {errorMsg && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-red-400 text-xs">{errorMsg}</p>
                </div>
              )}

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 space-y-2">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Nasıl Çalışır?</p>
                <ul className="space-y-1.5 text-xs text-gray-500">
                  <li className="flex items-start gap-2"><span className="text-indigo-500 mt-0.5">①</span> Gece ya da alacakaranlık gökyüzü fotoğrafı çek</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-500 mt-0.5">②</span> Yapay zeka gökyüzü alanını tespit eder</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-500 mt-0.5">③</span> Konumuna ve saatine göre görünmesi gereken yıldızlar eklenir</li>
                </ul>
              </div>
            </div>
          )}

          {/* ADIM 2: Analiz ediliyor */}
          {step === "analyzing" && (
            <div className="space-y-4">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Yüklenen fotoğraf"
                  className="w-full h-48 object-cover rounded-2xl border border-gray-800 opacity-50"
                />
              )}
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-indigo-500/30 flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-xl">🔭</span>
                </div>
                <p className="text-indigo-300 text-sm font-medium">Gökyüzü analiz ediliyor...</p>
                <p className="text-gray-600 text-xs text-center">
                  Konumun ve saatine göre<br />görünür yıldızlar hesaplanıyor
                </p>
              </div>
            </div>
          )}

          {/* ADIM 3: Sonuç */}
          {step === "result" && starData && previewUrl && (
            <div className="space-y-4">
              {/* Önce / Sonra */}
              <div className="space-y-2">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Önce (Işık Kirliliği)</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Önce" className="w-full h-48 object-cover rounded-2xl border border-gray-800" />
              </div>

              <div className="space-y-2">
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Sonra (Işık Kirliliği Olmasaydı)</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={starData.generatedUrl} alt="Sonra" className="w-full h-48 object-cover rounded-2xl border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20" />
              </div>

              <div className="bg-indigo-950/50 border border-indigo-500/20 rounded-xl px-4 py-3">
                <p className="text-indigo-200 text-sm font-semibold">Işık kirliliği azalsaydı böyle görünürdü</p>
                <p className="text-indigo-400/70 text-xs mt-0.5">
                  📍 {lat.toFixed(4)}, {lng.toFixed(4)} · {new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <button
                onClick={reset}
                className="w-full py-3 border border-indigo-800 hover:border-indigo-600 text-indigo-400 hover:text-indigo-300 rounded-xl text-sm font-medium transition active:scale-95"
              >
                Başka Fotoğraf Dene
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
