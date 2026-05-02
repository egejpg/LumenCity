"use client";

import { useEffect, useState } from "react";
import { useRole } from "./useRole";
import type { Anomaly } from "@/types";

interface UseAnomaliesOptions {
  zoneId?: string;
  minScore?: number;
}

export function useAnomalies(options: UseAnomaliesOptions = {}) {
  const { role } = useRole();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (options.zoneId) params.set("zone_id", options.zoneId);
    if (options.minScore) params.set("min_score", String(options.minScore));

    const url = `/api/anomalies${params.toString() ? `?${params}` : ""}`;

    fetch(url, {
      headers: {
        "x-user-role": role
      }
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setAnomalies(Array.isArray(data) ? data : []))
      .catch(() => setAnomalies([]))
      .finally(() => setLoading(false));
  }, [options.zoneId, options.minScore, role]);

  return { anomalies, loading };
}
