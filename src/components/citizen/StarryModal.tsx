import StarrySky from "./StarrySky";
import type { Report } from "@/types";

interface StarryModalProps {
  report: Report;
  onClose: () => void;
}

export default function StarryModal({ report, onClose }: StarryModalProps) {
  const hasStars = report.star_data && report.star_data.visibleStars;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-950 border border-indigo-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-xl">🌌</span> Gökyüzü Keşfi
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          
          {/* Before / After Images */}
          {report.image_url ? (
            <div className="space-y-4">
              {/* İlk Hali (Before) */}
              <div>
                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Öncesi (Işık Kirliliği)</h4>
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-800 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={report.image_url} 
                    alt="Gökyüzü Öncesi" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Sonrası (After) */}
              {hasStars ? (
                <div>
                  <h4 className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">Sonrası (Yıldızlı Gökyüzü)</h4>
                  <div className="relative w-full rounded-xl overflow-hidden border-2 border-indigo-500/50 bg-black shadow-lg shadow-indigo-500/20">
                    <div className="pointer-events-none">
                      <StarrySky 
                        imageUrl={report.image_url}
                        skyBox={report.star_data.skyBox}
                        visibleStars={report.star_data.visibleStars}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-500 text-xs">
                  Star data is missing! Raw: {JSON.stringify(report.star_data || null)}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-40 bg-gray-900 flex items-center justify-center text-gray-500 rounded-xl border border-gray-800">
              Fotoğraf bulunamadı
            </div>
          )}

          {/* Stars List */}
          {hasStars && (
            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4">
              <h4 className="text-indigo-300 text-sm font-bold mb-3 flex items-center gap-1.5">
                <span>🔭</span> Tespit Edilen Yıldızlar
              </h4>
              <ul className="space-y-3">
                {report.star_data.visibleStars.map((star: any, i: number) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-indigo-400 mt-0.5 opacity-80">✦</span>
                    <div>
                      <strong className="text-gray-200 block mb-0.5">{star.name}</strong>
                      <span className="text-gray-400 leading-relaxed text-xs">{star.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="text-xs text-gray-500 text-right">
            Eklenme: {new Date(report.created_at).toLocaleDateString("tr-TR")}
          </p>
        </div>
      </div>
    </div>
  );
}
