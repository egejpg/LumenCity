"use client";

import { useEffect, useState, useCallback } from "react";
import type { Report } from "@/types";

export function useReports(refreshTrigger?: number) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(() => {
    setLoading(true);
    fetch(`/api/reports?t=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, refreshTrigger]);

  return { reports, loading, refetch: fetchReports };
}
