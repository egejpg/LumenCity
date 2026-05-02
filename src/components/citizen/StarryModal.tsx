import type { Report, ReportCategory } from "@/types";

const CATEGORY_META: Record<ReportCategory, { label: string; icon: string; color: string }> = {
  bos_ofis_isigi: { label: "Gereksiz Işık Kullanımı", icon: "💡", color: "text-blue-400" },
  reklam_panosu:  { label: "Reklam Panosu Şikayeti",  icon: "📋", color: "text-purple-400" },
  sokak_lambasi:  { label: "Sokak Lambası Arızası",    icon: "🔦", color: "text-yellow-400" },
  otopark:        { label: "Otopark Aydınlatması",     icon: "🅿️", color: "text-emerald-400" },
  diger:          { label: "Diğer",                    icon: "📌", color: "text-gray-400" },
};

interface StarryModalProps {
  report: Report;
  onClose: () => void;
}

export default function StarryModal({ report, onClose }: StarryModalProps) {
  const meta = CATEGORY_META[report.category] ?? CATEGORY_META["diger"];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-lg shadow-2xl"
        style={{ maxHeight: "85dvh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-3 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-2xl border border-gray-800">
              {meta.icon}
            </div>
            <div>
              <p className={`font-bold text-base ${meta.color}`}>{meta.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {new Date(report.created_at).toLocaleString("tr-TR", {
                  day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-1 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Fotoğraf */}
          {report.image_url && (
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Fotoğraf</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={report.image_url}
                alt="Bildirim fotoğrafı"
                className="w-full h-52 object-cover rounded-2xl border border-gray-800"
              />
            </div>
          )}

          {/* Açıklama */}
          {report.description && (
            <div className="bg-gray-900 rounded-2xl px-4 py-3">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1.5">Açıklama</p>
              <p className="text-gray-200 text-sm leading-relaxed">{report.description}</p>
            </div>
          )}

          {/* Konum */}
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <span>📍</span>
            <span>{report.lat.toFixed(5)}, {report.lng.toFixed(5)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
