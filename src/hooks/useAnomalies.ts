"use client";

import { useEffect, useState } from "react";
import type { Anomaly } from "@/types";

interface UseAnomaliesOptions {
  zoneId?: string;
  minScore?: number;
}

export function useAnomalies(options: UseAnomaliesOptions = {}) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (options.zoneId) params.set("zone_id", options.zoneId);
    if (options.minScore) params.set("min_score", String(options.minScore));

    const url = `/api/anomalies${params.toString() ? `?${params}` : ""}`;

    fetch(url, {
      headers: {
        "x-user-role": "municipality"
      }
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setAnomalies(Array.isArray(data) ? data : []))
      .catch(() => setAnomalies([]))
      .finally(() => setLoading(false));
  }, [options.zoneId, options.minScore]);

  return { anomalies, loading };
}
