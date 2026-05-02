"use client";

import { useEffect, useState } from "react";
import type { Report } from "@/types";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => setReports(data))
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading };
}
