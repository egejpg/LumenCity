"use client";

import { useEffect, useState } from "react";
import { useRole } from "./useRole";
import type { Anomaly } from "@/types";

export function useAnomalies() {
  const { role } = useRole();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/anomalies", {
      headers: {
        "x-user-role": role
      }
    })
      .then((r) => r.json())
      .then((data) => {
        // API 403 dönerse, boş array göster
        if (Array.isArray(data)) {
          setAnomalies(data);
        }
      })
      .finally(() => setLoading(false));
  }, [role]);

  return { anomalies, loading };
}
