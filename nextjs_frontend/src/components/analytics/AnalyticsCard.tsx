"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * AnalyticsCard – KPI card using Ocean Professional tokens.
 * - Motion-safe hover lift and subtle elevation
 * - Focus-visible ring for keyboard users
 */
export default function AnalyticsCard({
  title,
  value,
  subtitle,
  className,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "card p-4 u-transition",
        "motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-md",
        "focus-ring",
        className || "",
      ].join(" ")}
      tabIndex={0}
      role="group"
      aria-label={`${title} ${typeof value === "number" ? value : String(value)}`}
    >
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {subtitle ? <p className="text-xs text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
  );
}
