"use client";

import React from "react";
import {
  BarChart as RBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// PUBLIC_INTERFACE
type BarDatum = { label: string } & { [key: string]: number | string };

export default function BarChart({
  data,
  dataKey,
  color = "#F59E0B",
}: {
  data: BarDatum[];
  dataKey: string;
  color?: string;
}) {
  return (
    <div className="card p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
