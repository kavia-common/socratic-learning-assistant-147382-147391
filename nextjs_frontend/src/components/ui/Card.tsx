"use client";
import React from "react";

// PUBLIC_INTERFACE
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`card ${className || ""}`}>{children}</div>;
}
