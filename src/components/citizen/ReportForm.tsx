"use client";

import { useState } from "react";
import { useRole } from "@/hooks/useRole";
import CameraCapture from "./CameraCapture";
import StarrySky from "./StarrySky";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type { ReportCategory } from "@/types";

const CATEGORIES: { key: ReportCategory; label: string; icon: string }[] = [
  { key: "diger", label: "Diğer", icon: "❓" },
];

interface ReportFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  lat: number;
  lng: number;
}

type Step = "capture" | "ai-loading" | "preview" | "uploading" | "done" | "error";

export default function ReportForm({ onClose, onSuccess, lat, lng }: ReportFormProps) {
  const { role } = useRole();
  
  // Role kontrolü - Sadece citizen yapabilir
  if (role !== "citizen") {
    return (
      <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 max-w-sm text-center shadow-2xl">
          <p className="text-gray-400 text-lg mb-4">⛔ Yetkiniz Yok</p>
          <p className="text-gray-500 text-sm mb-6">
            Bu işlemi yapmak için vatandaş rolüne geçmeniz gerekmektedir.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition"
          >
            Kapat
          </button>
        </div>
      </div>
    );
  }

  const [step, setStep] = useState<Step>("capture");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Yıldız özelliği state'leri
  const [starData, setStarData] = useState<{
    visibleStars: { name: string; description: string }[];
    skyBox: { ymin: number; xmin: number; ymax: number; xmax: number } | null;
  } | null>(null);
  const [starLoading, setStarLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // Fotoğraf seçildi → preview adımına geç, yıldızları otomatik hesapla
  function handleCapture(file: File) {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep("preview");
    setStarData(null);
    setShowCanvas(false);
    
    // Otomatik yıldız hesaplama
    if (lat && lng) {
      setStarLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("lat", lat.toString());
      formData.append("lng", lng.toString());
      formData.append("time", new Date().toISOString());

      fetch("/api/ai/stars", { 
        method: "POST", 
        body: formData,
        headers: {
          "x-user-role": role
        }
      })
        .then((res) => res.json())
        .then((data) => setStarData(data))
        .catch(() => console.error("Yıldızlar hesaplanamadı"))
        .finally(() => setStarLoading(false));
    }
  }



  // Formu gönder: Storage'a yükle → reports API'sine POST
  async function handleSubmit() {
    if (!starData) return;
    setStep("uploading");

    let image_url: string | null = null;

    // Storage upload
    if (imageFile) {
      try {
        const supabase = createClientSupabaseClient();
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("reports")
          .upload(filename, imageFile, { contentType: imageFile.type, upsert: false });
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from("reports")
            .getPublicUrl(uploadData.path);
          image_url = urlData.publicUrl;
        }
      } catch {
        // Upload başarısız → base64'e çevirip devam et (mock data için)
      }
      
      // Eğer Supabase'e yüklenemediyse ve bir image_url yoksa, dosyayı base64 string'ine çevirelim
      if (!image_url) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
        image_url = base64;
      }
    }

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-role": role
        },
        body: JSON.stringify({ 
          lat, 
          lng, 
          category: "diger", 
          description: "Gökyüzü Analizi", 
          image_url,
          star_data: starData
        }),
      });
      if (!res.ok) throw new Error("Sunucu hatası");
      setStep("done");
      onSuccess?.();
    } catch {
      setErrorMsg("Bildirim gönderilemedi. Tekrar dene.");
      setStep("error");
    }
  }

  return (
    <div className="absolute inset-0 z-20 bg-black/75 flex items-end justify-center backdrop-blur-sm">
      <div
        className="bg-gray-950 border border-gray-800 rounded-t-3xl w-full max-w-lg shadow-2xl"
        style={{ maxHeight: "90dvh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-indigo-400 font-bold text-xl leading-tight flex items-center gap-2">
              <span>🔭</span> Yıldız Haritası
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              📍 {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition active:scale-95"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-8 pt-4">
          {/* ADIM 1: Fotoğraf çek */}
          {step === "capture" && <CameraCapture onCapture={handleCapture} />}

          {/* ADIM 2: Preview + AI + Chip override + Textarea */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Fotoğraf preview veya Yıldızlı Gökyüzü */}
              {previewUrl && (
                <div className="relative">
                  {showCanvas && starData ? (
                    <StarrySky 
                      imageUrl={previewUrl} 
                      skyBox={starData.skyBox} 
                      visibleStars={starData.visibleStars} 
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Bildirim görseli"
                      className="w-full h-44 object-cover rounded-2xl border border-gray-800"
                    />
                  )}
                  <button
                    onClick={() => { setStep("capture"); setPreviewUrl(null); setStarData(null); setShowCanvas(false); }}
                    className="absolute top-2 right-2 z-30 bg-black/60 text-white text-xs px-2 py-1 rounded-full hover:bg-black/80 transition"
                  >
                    Yeniden çek
                  </button>
                </div>
              )}

              {/* Yıldız Listesi ve Canvas Göster Butonu */}
              {starLoading && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-3 py-2">
                  <span className="inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Astronomik veriler hesaplanıyor...</span>
                </div>
              )}

              {starData && (
                <div className="bg-gray-900/50 border border-indigo-500/20 rounded-xl p-3.5 mt-2">
                  <h4 className="text-indigo-300 text-xs font-bold mb-2.5 flex items-center gap-1.5">
                    <span>🔭</span> Şu An Tepedeki Yıldızlar
                  </h4>
                  <ul className="space-y-2.5 mb-3">
                    {starData.visibleStars.map((star, i) => (
                      <li key={i} className="flex gap-2.5 text-xs">
                        <span className="text-indigo-400 mt-0.5 opacity-80">✦</span>
                        <div>
                          <strong className="text-gray-200 block mb-0.5">{star.name}</strong>
                          <span className="text-gray-500 leading-relaxed">{star.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {!showCanvas && (
                    <button
                      onClick={() => setShowCanvas(true)}
                      className="w-full py-2.5 rounded-xl border-2 border-indigo-500/30 text-indigo-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-indigo-500/10 transition active:scale-95"
                    >
                      ✨ Yıldızları Fotoğrafa Ekle (Işık Kirliliğini Kaldır)
                    </button>
                  )}
                </div>
              )}

              {/* Gönder butonu - Sadece yıldızlar yüklendikten sonra çıksın */}
              {starData && (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-4"
                >
                  📍 Haritaya Kaydet
                </button>
              )}
            </div>
          )}

          {/* ADIM 3: Upload + Gönderme */}
          {step === "uploading" && (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 text-sm">Gönderiliyor...</p>
            </div>
          )}

          {/* ADIM 4: Başarı */}
          {step === "done" && (
            <div className="text-center py-10 space-y-3">
              <div className="text-5xl animate-bounce">✅</div>
              <p className="text-white font-bold text-lg">Haritaya Eklendi!</p>
              <p className="text-gray-400 text-sm">Gökyüzü keşfiniz başarıyla haritaya eklendi.</p>
              <button
                onClick={onClose}
                className="mt-2 px-8 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition active:scale-95"
              >
                Kapat
              </button>
            </div>
          )}

          {/* Hata */}
          {step === "error" && (
            <div className="text-center py-10 space-y-3">
              <div className="text-5xl">⚠️</div>
              <p className="text-red-400 font-semibold">{errorMsg}</p>
              <button
                onClick={() => setStep("preview")}
                className="px-8 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition"
              >
                Geri Dön
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
