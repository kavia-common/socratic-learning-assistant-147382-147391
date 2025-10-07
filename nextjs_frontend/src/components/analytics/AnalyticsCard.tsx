"use client";

import React from "react";

// PUBLIC_INTERFACE
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
    <div className={`card p-4 ${className || ""}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {subtitle ? <p className="text-xs text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
  );
}
