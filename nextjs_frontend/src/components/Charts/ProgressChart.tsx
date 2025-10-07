"use client";

import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

/**
 * PUBLIC_INTERFACE
 * ProgressChart displays a circular progress indicator using recharts RadialBarChart.
 */
export default function ProgressChart({
  progress = 62,
  color = "#2563EB",
}: {
  progress?: number;
  color?: string;
}) {
  const data = [{ name: "progress", value: Math.max(0, Math.min(100, progress)) }];

  return (
    <div className="card p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={10} fill={color} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl font-semibold text-gray-900">{data[0].value}%</p>
          <p className="text-xs text-gray-500">Mastery</p>
        </div>
      </div>
    </div>
  );
}
