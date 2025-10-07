"use client";

import React, { useEffect, useRef, useState } from "react";
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
  // Motion-safe mount animation: fade+slide bars without affecting layout
  const [mounted, setMounted] = useState(false);
  const prefReduced = useRef(false);

  useEffect(() => {
    try {
      prefReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      prefReduced.current = false;
    }
    const t = setTimeout(() => setMounted(true), 20); // schedule after paint
    return () => clearTimeout(t);
  }, []);

  const seriesClass = prefReduced.current
    ? ""
    : mounted
    ? "recharts-series-entered"
    : "recharts-series-enter";

  return (
    <div className="card p-4 h-64 u-transition focus-ring" tabIndex={0} role="group" aria-label="Bar chart">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar className={seriesClass} dataKey={dataKey} fill={color} />
        </RBarChart>
      </ResponsiveContainer>
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          :global(.recharts-series-enter) {
            opacity: 0;
            transform: translateY(6px);
            transition: opacity 180ms ease-out, transform 180ms ease-out;
            will-change: opacity, transform;
          }
          :global(.recharts-series-entered) {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 180ms ease-out, transform 180ms ease-out;
          }
        }
      `}</style>
    </div>
  );
}
