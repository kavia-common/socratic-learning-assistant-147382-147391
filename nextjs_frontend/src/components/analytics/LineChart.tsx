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
// Allow a string 'date' field plus any number of numeric series keys.
type LineDatum = {
  date: string;
} & {
  // series keys like "value", "score", etc. must be numbers, but 'date' stays string
  [k: string]: number | string;
};

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
