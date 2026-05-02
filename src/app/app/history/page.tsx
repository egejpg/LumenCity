"use client";

import { useReports } from "@/hooks/useReports";
import ReportCard from "@/components/citizen/ReportCard";
import Link from "next/link";

export default function HistoryPage() {
  const { reports, loading } = useReports();

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/app" className="text-amber-400 hover:underline text-sm">
          ← Haritaya Dön
        </Link>
        <h1 className="text-xl font-bold">Bildirimlerim</h1>
      </div>

      {loading ? (
        <div className="text-gray-400">Yükleniyor...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </main>
  );
}
