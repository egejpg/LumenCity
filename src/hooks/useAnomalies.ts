"use client";

import { useEffect, useState } from "react";
import type { Anomaly } from "@/types";

export function useAnomalies() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/anomalies")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setAnomalies(data);
      })
      .catch(() => {
        // Supabase henüz yapılandırılmadı — boş dizi döner, bileşen kendi mock datasını kullanır
        setAnomalies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { anomalies, loading };
}
