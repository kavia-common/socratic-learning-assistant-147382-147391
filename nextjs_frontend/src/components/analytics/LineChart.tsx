"use client";

import React from "react";
import {
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// PUBLIC_INTERFACE
type LineDatum = { date: string } & Record<string, number>;

export default function LineChart({
  data,
  dataKey,
  color = "#2563EB",
}: {
  data: LineDatum[];
  dataKey: string;
  color?: string;
}) {
  return (
    <div className="card p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}
