"use client";

import { useState, useRef } from "react";
import CameraCapture from "./CameraCapture";

interface ReportFormProps {
  onClose: () => void;
}

export default function ReportForm({ onClose }: ReportFormProps) {
  const [step, setStep] = useState<"capture" | "preview" | "sending" | "done">("capture");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ category: string; description: string } | null>(null);

  async function handleCapture(file: File) {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setStep("sending");

    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/ai/classify", { method: "POST", body: formData });
    const data = await res.json();
    setAiResult(data);
    setStep("preview");
  }

  async function handleSubmit() {
    if (!aiResult) return;
    setStep("sending");

    // TODO: upload image to Supabase Storage, get URL
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: 40.9833,
        lng: 29.0333,
        category: aiResult.category,
        description: aiResult.description,
        image_url: null,
      }),
    });

    setStep("done");
  }

  return (
    <div className="absolute inset-0 z-20 bg-black/70 flex items-end justify-center">
      <div className="bg-gray-900 rounded-t-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-semibold text-lg">Bildirim Yap</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ×
          </button>
        </div>

        {step === "capture" && <CameraCapture onCapture={handleCapture} />}

        {step === "sending" && (
          <div className="text-center py-8 text-gray-400">AI analiz ediyor...</div>
        )}

        {step === "preview" && aiResult && (
          <div>
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Bildirim görseli" className="w-full h-40 object-cover rounded-lg mb-4" />
            )}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-amber-400 text-sm font-medium mb-1">AI Tespiti</p>
              <p className="text-white text-sm">{aiResult.description}</p>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg transition"
            >
              Bildirimi Gönder
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold">Bildirim gönderildi!</p>
            <p className="text-gray-400 text-sm mt-1">Teşekkürler, belediye inceleyecek.</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
