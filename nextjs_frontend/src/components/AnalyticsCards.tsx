"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Analytics = { sessions: number; questions: number; insights: number };

/**
 * PUBLIC_INTERFACE
 * Simple KPI cards backed by /api/analytics mock.
 */
export default function AnalyticsCards() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    api
      .get<Analytics>("/api/analytics")
      .then(setData)
      .catch(() => setData({ sessions: 0, questions: 0, insights: 0 }));
  }, []);

  const metrics: Array<{
    key: keyof Analytics;
    label: string;
    color: string;
    bg: string;
  }> = [
    { key: "sessions", label: "Sessions", color: "text-blue-700", bg: "bg-blue-50" },
    { key: "questions", label: "Questions Asked", color: "text-amber-700", bg: "bg-amber-50" },
    { key: "insights", label: "Insights", color: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div key={m.key as string} className={`card p-4 ${m.bg}`}>
          <p className="text-sm text-gray-600">{m.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${m.color}`}>{data ? data[m.key] : "—"}</p>
        </div>
      ))}
    </div>
  );
}
