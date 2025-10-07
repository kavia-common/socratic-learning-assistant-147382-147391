"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMentorDashboard } from "@/lib/api";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import LineChart from "@/components/analytics/LineChart";
import BarChart from "@/components/analytics/BarChart";
import { Modal } from "@/components/ui/Modal";

export default function MentorPage() {
  const { data } = useQuery({
    queryKey: ["mentor", "dashboard"],
    queryFn: getMentorDashboard,
    initialData: {
      trends: [
        { date: "Mon", value: 3 },
        { date: "Tue", value: 5 },
        { date: "Wed", value: 2 },
        { date: "Thu", value: 6 },
        { date: "Fri", value: 4 },
      ],
      distribution: [
        { label: "Concept A", value: 12 },
        { label: "Concept B", value: 8 },
        { label: "Concept C", value: 5 },
      ],
      topStudents: [
        { id: "1", name: "Alice", streak: 4, sessions: 12 },
        { id: "2", name: "Bob", streak: 2, sessions: 8 },
      ],
    },
  });

  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);

  return (
    <section className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Mentor Dashboard</h1>
        <p className="mt-2 text-gray-600">Track student progress, misconceptions, and engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard title="Active Students" value={data.topStudents.length} />
        <AnalyticsCard title="Avg. Streak" value={(data.topStudents.reduce((a, b) => a + b.streak, 0) / data.topStudents.length).toFixed(1)} />
        <AnalyticsCard title="Sessions (7d)" value={data.trends.reduce((a, b) => a + b.value, 0)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LineChart data={data.trends} dataKey="value" />
        <BarChart data={data.distribution} dataKey="value" />
      </div>

      <div className="card p-4">
        <h2 className="font-semibold">Students</h2>
        <ul className="mt-2 divide-y">
          {data.topStudents.map((s) => (
            <li key={s.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-gray-500">
                  Streak: {s.streak} • Sessions: {s.sessions}
                </p>
              </div>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setSelected({ id: s.id, name: s.name })}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Student: ${selected.name}` : "Student"}
      >
        <p className="text-sm text-gray-700">Recent sessions and performance would appear here with a sparkline. TODO: wire to backend.</p>
      </Modal>
    </section>
  );
}
