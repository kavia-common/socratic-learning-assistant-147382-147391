"use client";
import React from "react";

type Padding = "none" | "sm" | "md" | "lg";
type Elevation = "none" | "soft" | "interactive";

/**
 * PUBLIC_INTERFACE
 * Card – Surface wrapper using theme tokens
 * - padding: none | sm | md | lg
 * - elevation: none | soft | interactive (adds hover elevation/translate)
 */
export function Card({
  children,
  className,
  padding = "none",
  elevation = "soft",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: Padding;
  elevation?: Elevation;
}) {
  const paddings: Record<Padding, string> = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const base = "card u-transition";
  const elev: Record<Elevation, string> = {
    none: "",
    soft: "",
    interactive:
      "hover:shadow-md hover:-translate-y-[1px] active:translate-y-0",
  };

  return <div className={[base, paddings[padding], elev[elevation], className || ""].join(" ")}>{children}</div>;
}
