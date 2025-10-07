"use client";

import React, { useEffect, useRef, useState } from "react";
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
  // Motion-safe mount animation: fade + slight upward slide for the line path
  const [mounted, setMounted] = useState(false);
  const prefReduced = useRef(false);

  useEffect(() => {
    try {
      prefReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      prefReduced.current = false;
    }
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const seriesClass = prefReduced.current
    ? ""
    : mounted
    ? "recharts-line-entered"
    : "recharts-line-enter";

  return (
    <div className="card p-4 h-64 u-transition focus-ring" tabIndex={0} role="group" aria-label="Line chart">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line className={seriesClass} type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        </RLineChart>
      </ResponsiveContainer>
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          :global(.recharts-line-enter) {
            opacity: 0;
            transform: translateY(6px);
            transition: opacity 180ms ease-out, transform 180ms ease-out;
            will-change: opacity, transform;
          }
          :global(.recharts-line-entered) {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 180ms ease-out, transform 180ms ease-out;
          }
        }
      `}</style>
    </div>
  );
}
