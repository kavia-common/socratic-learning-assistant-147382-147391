"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import AnalyticsCards from "@/components/AnalyticsCards";
import ProgressChart from "@/components/Charts/ProgressChart";

/**
 * PUBLIC_INTERFACE
 * /analytics – Dashboard with KPI cards and a progress chart.
 */
export default function AnalyticsPage() {
  const stats = [
    { label: "Active Sessions", value: 12, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Questions (7d)", value: 87, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "Insights", value: 23, color: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  return (
    <AppShell>
      <section aria-label="Analytics" className="space-y-4">
        <div className="rounded-xl gradient-bg p-6 card">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Insights into learning progress and engagement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`card p-4 ${s.bg}`}>
              <p className="text-sm text-gray-600">{s.label}</p>
              <p className={`mt-1 text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <AnalyticsCards />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProgressChart progress={62} />
          <div className="card p-4">
            <h2 className="font-semibold">Notes</h2>
            <p className="text-sm text-gray-700 mt-2">
              This dashboard uses mock data and renders client-side only. Replace with real backend
              metrics when available. Colors and surface follow the Ocean Professional theme.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
