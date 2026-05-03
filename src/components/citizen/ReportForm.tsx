"use client";

import { useState, useRef } from "react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import type { ReportCategory } from "@/types";

let faceApiLoaded = false;

async function detectFaces(imageElement: HTMLImageElement): Promise<number> {
  const mod = await import("face-api.js");
  // CJS bundle'da her şey .default içinde, ESM'de namespace'de olur
  const faceapi = (mod as any).default?.nets ? (mod as any).default : mod;
  if (!faceApiLoaded) {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    faceApiLoaded = true;
  }
  const detections = await faceapi.detectAllFaces(
    imageElement,
    new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 })
  );
  return detections.length;
}

const CATEGORIES: { key: ReportCategory; label: string; icon: string }[] = [
  { key: "sokak_lambasi",  label: "Sokak Lambası Arızası",   icon: "🔦" },
  { key: "bos_ofis_isigi", label: "Gereksiz Işık Kullanımı", icon: "💡" },
  { key: "reklam_panosu", label: "Reklam Panosu Şikayeti",  icon: "📋" },
  { key: "otopark",        label: "Otopark Aydınlatması",    icon: "🅿️" },
  { key: "diger",          label: "Diğer",                   icon: "📌" },
];

interface ReportFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  lat: number;
  lng: number;
}

type Step = "form" | "uploading" | "done" | "error";

export default function ReportForm({ onClose, onSuccess, lat, lng }: ReportFormProps) {
  const [step, setStep]               = useState<Step>("form");
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null);
  const [category, setCategory]       = useState<ReportCategory | null>(null);
  const [note, setNote]               = useState("");
  const [errorMsg, setErrorMsg]       = useState("");
  const [faceError, setFaceError]     = useState("");
  const [faceChecking, setFaceChecking] = useState(false);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setFaceError("");
    setFaceChecking(true);
    setPreviewUrl(objectUrl);

    try {
      const img = new Image();
      img.src = objectUrl;
      await new Promise((res) => { img.onload = res; });
      const count = await detectFaces(img);
      if (count > 0) {
        setFaceError("Fotoğrafta kişi tespit edildi. Lütfen kişi içermeyen bir fotoğraf yükleyiniz.");
        setPreviewUrl(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setImageFile(file);
    } catch (err) {
      console.error("[FaceDetect] Hata:", err);
      setFaceError("Fotoğraf kontrol edilemedi. Lütfen tekrar deneyin.");
      setPreviewUrl(null);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setFaceChecking(false);
    }
  }

  function removePhoto() {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!category) return;
    setStep("uploading");

    let image_url: string | null = null;

    if (imageFile) {
      try {
        const supabase = createClientSupabaseClient();
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("reports")
          .upload(filename, imageFile, { contentType: imageFile.type, upsert: false });
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from("reports").getPublicUrl(uploadData.path);
          image_url = urlData.publicUrl;
        }
      } catch { /* Supabase yoksa base64 */ }

      if (!image_url) {
        image_url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }
    }

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": "citizen" },
        body: JSON.stringify({
          lat,
          lng,
          category,
          description: note.trim() || CATEGORIES.find(c => c.key === category)!.label,
          image_url,
        }),
      });
      if (!res.ok) throw new Error();
      setStep("done");
      onSuccess?.();
    } catch {
      setErrorMsg("Bildirim gönderilemedi. Lütfen tekrar deneyiniz.");
      setStep("error");
    }
  }

  const canSubmit = !!category;

  return (
    <div className="absolute inset-0 z-20 bg-black/75 flex items-end justify-center backdrop-blur-sm">
      <div
        className="bg-gray-950 border border-gray-800 rounded-t-3xl w-full max-w-lg shadow-2xl"
        style={{ maxHeight: "92dvh", overflowY: "auto" }}
      >
        {/* Başlık */}
        <div className="flex justify-between items-start px-6 pt-6 pb-4 border-b border-gray-800">
          <div>
            <p className="text-gray-500 text-[11px] uppercase tracking-widest mb-1">Işık Kirliliği Bildirimi</p>
            <h2 className="text-white font-bold text-xl leading-tight">Şikayet &amp; Bildirim Formu</h2>
            <p className="text-gray-600 text-xs mt-1">📍 {lat.toFixed(5)}, {lng.toFixed(5)}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-1 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition active:scale-95"
          >
            ✕
          </button>
        </div>

        {step === "form" && (
          <div className="px-6 pb-8 pt-5 space-y-6">

            {/* Fotoğraf */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Fotoğraf <span className="text-gray-600 normal-case tracking-normal font-normal">(isteğe bağlı)</span>
              </p>

              {faceChecking ? (
                <div className="w-full h-36 rounded-2xl border border-gray-800 bg-gray-900/60 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-500 text-xs">Fotoğraf kontrol ediliyor...</span>
                </div>
              ) : !previewUrl ? (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-700 hover:border-gray-500 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-400 transition active:scale-[0.98]"
                  >
                    <span className="text-3xl">📷</span>
                    <span className="text-sm">Fotoğraf Ekle</span>
                    <span className="text-xs text-gray-600">Galeriden seç veya kamera aç</span>
                  </button>
                  {faceError && (
                    <div className="mt-2 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5">
                      <span className="text-red-400 text-base leading-none mt-0.5">⚠️</span>
                      <p className="text-red-400 text-xs leading-relaxed">{faceError}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Yüklenen fotoğraf"
                    className="w-full h-44 object-cover rounded-2xl border border-gray-800"
                  />
                  <button
                    onClick={removePhoto}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white text-xs px-2.5 py-1 rounded-full transition"
                  >
                    Kaldır
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Sorun türü */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Sorun Türü <span className="text-red-500">*</span>
              </p>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition active:scale-[0.98] ${
                      category === cat.key
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                        : "bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                    {category === cat.key && (
                      <span className="ml-auto text-amber-400 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Not */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Ek Açıklama <span className="text-gray-600 normal-case tracking-normal font-normal">(isteğe bağlı)</span>
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Sorunu kısaca açıklayınız..."
                rows={3}
                maxLength={500}
                className="w-full bg-gray-900 border border-gray-800 focus:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 resize-none outline-none transition"
              />
              <p className="text-right text-gray-700 text-xs mt-1">{note.length}/500</p>
            </div>

            {/* Gönder */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-xl transition active:scale-95 text-sm tracking-wide"
            >
              Belediyeye Gönder
            </button>

            {!canSubmit && (
              <p className="text-center text-gray-600 text-xs -mt-2">Devam etmek için sorun türü seçiniz</p>
            )}
          </div>
        )}

        {/* Gönderiliyor */}
        {step === "uploading" && (
          <div className="px-6 py-16 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 text-sm">Bildiriminiz iletiliyor...</p>
          </div>
        )}

        {/* Başarı */}
        {step === "done" && (
          <div className="px-6 py-14 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Bildirim Alındı</p>
              <p className="text-gray-500 text-sm mt-1">
                Şikayetiniz belediyeye iletilmiştir.<br />En kısa sürede değerlendirilecektir.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-gray-700 text-xs mb-4">Referans Konumu: {lat.toFixed(5)}, {lng.toFixed(5)}</p>
              <button
                onClick={onClose}
                className="px-10 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition active:scale-95 text-sm"
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* Hata */}
        {step === "error" && (
          <div className="px-6 py-14 text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/15 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Gönderim Başarısız</p>
              <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
            </div>
            <button
              onClick={() => setStep("form")}
              className="px-10 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition active:scale-95 text-sm"
            >
              Geri Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
