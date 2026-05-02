"use client";

import { useEffect, useState } from "react";
import type { Report } from "@/types";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setReports(data);
      })
      .catch(() => {
        // Supabase henüz yapılandırılmadı — boş dizi döner
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading };
}
