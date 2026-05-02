"use client";

import { useEffect, useState } from "react";
import type { Anomaly } from "@/types";

export function useAnomalies() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/anomalies")
      .then((r) => r.json())
      .then((data) => setAnomalies(data))
      .finally(() => setLoading(false));
  }, []);

  return { anomalies, loading };
}
