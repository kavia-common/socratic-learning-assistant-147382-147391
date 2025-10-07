"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/lib/api";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import BarChart from "@/components/analytics/BarChart";
import UsersTable from "@/components/tables/UsersTable";
import DepartmentsTable from "@/components/tables/DepartmentsTable";

export default function AdminPage() {
  const { data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboard,
    initialData: { users: 42, departments: 6, activeStreaks: 21, ingestions: 128 },
  });

  const chartData = [
    { label: "Sci", value: 12 },
    { label: "Math", value: 9 },
    { label: "CS", value: 15 },
    { label: "Arts", value: 6 },
  ];

  return (
    <section className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Organization analytics and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnalyticsCard title="Users" value={data.users} />
        <AnalyticsCard title="Departments" value={data.departments} />
        <AnalyticsCard title="Active Streaks" value={data.activeStreaks} />
        <AnalyticsCard title="Ingestions" value={data.ingestions} />
      </div>

      <BarChart data={chartData} dataKey="value" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UsersTable />
        <DepartmentsTable />
      </div>
    </section>
  );
}
