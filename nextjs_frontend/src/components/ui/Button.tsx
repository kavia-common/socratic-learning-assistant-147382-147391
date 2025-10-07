"use client";
import { clsx } from "clsx";
import React from "react";

// PUBLIC_INTERFACE
export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium focus-ring transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60",
    secondary: "border bg-white hover:bg-gray-50 text-gray-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
