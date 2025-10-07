"use client";
import { clsx } from "clsx";
import React from "react";

type Variant = "primary" | "secondary" | "subtle" | "success" | "destructive";
type Size = "sm" | "md";

/**
 * PUBLIC_INTERFACE
 * Badge – Small label pill used across the app
 * - variants: primary, secondary, subtle, success, destructive
 * - sizes: sm, md
 */
export function Badge({
  children,
  className,
  variant = "secondary",
  size = "sm",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
}) {
  const sizes: Record<Size, string> = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };
  const variants: Record<Variant, string> = {
    primary: "bg-blue-50 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    subtle: "bg-gray-50 text-gray-700 border border-gray-200",
    success: "bg-emerald-50 text-emerald-800",
    destructive: "bg-red-50 text-red-700",
  };
  return (
    <span className={clsx("u-transition inline-flex items-center rounded-full font-medium", sizes[size], variants[variant], className)}>
      {children}
    </span>
  );
}
