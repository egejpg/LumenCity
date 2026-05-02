import type { Report, ReportCategory } from "@/types";

const CATEGORY_LABEL: Record<ReportCategory, string> = {
  bos_ofis_isigi: "Boş Ofis Işığı",
  reklam_panosu: "Reklam Panosu",
  sokak_lambasi: "Sokak Lambası",
  otopark: "Otopark",
  diger: "Diğer",
};

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-amber-400 font-medium text-sm">
            {CATEGORY_LABEL[report.category]}
          </p>
          <p className="text-white text-sm mt-1">{report.description}</p>
        </div>
        <span className="text-xs text-gray-500 shrink-0 ml-2">
          {new Date(report.created_at).toLocaleDateString("tr-TR")}
        </span>
      </div>
    </div>
  );
}
