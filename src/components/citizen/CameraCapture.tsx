"use client";

import { useRef } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-20 h-20 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center text-3xl shadow-lg transition"
      >
        📷
      </button>
      <p className="text-gray-400 text-sm">Kameraya dokunarak fotoğraf çek</p>
      <p className="text-gray-500 text-xs">veya galeriden seç</p>
    </div>
  );
}
