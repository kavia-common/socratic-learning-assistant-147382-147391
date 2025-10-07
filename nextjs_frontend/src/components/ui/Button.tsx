"use client";
import { clsx } from "clsx";
import React from "react";

type Variant = "primary" | "secondary" | "subtle" | "destructive" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

/**
 * PUBLIC_INTERFACE
 * Button – Ocean Professional unified button component
 * - variants: primary, secondary, subtle, destructive, ghost
 * - sizes: sm, md, lg
 * - loading/disabled supported
 * - accessible focus-visible ring using theme tokens
 */
export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  loading = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "u-transition inline-flex items-center justify-center font-medium rounded-md focus-ring select-none";
  const sizes: Record<Size, string> = {
    sm: "text-sm h-8 px-3 gap-1.5",
    md: "text-sm h-9 px-3.5 gap-2",
    lg: "text-base h-11 px-4 gap-2.5",
  };

  // Theme-aligned variants using CSS variables
  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-blue-700 active:translate-y-[0.5px] disabled:opacity-60 disabled:pointer-events-none",
    secondary:
      "border border-[var(--border)] bg-white text-gray-900 hover:bg-gray-50 active:translate-y-[0.5px] disabled:opacity-60 disabled:pointer-events-none",
    subtle:
      "bg-blue-50 text-blue-800 hover:bg-blue-100 active:translate-y-[0.5px] disabled:opacity-60 disabled:pointer-events-none",
    destructive:
      "bg-[var(--color-error)] text-white hover:bg-red-700 active:translate-y-[0.5px] disabled:opacity-60 disabled:pointer-events-none",
    ghost:
      "bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 active:translate-y-[0.5px] disabled:opacity-60 disabled:pointer-events-none",
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="inline-block h-4 w-4 rounded-full border-2 border-white/60 border-r-transparent motion-safe:animate-spin"
        />
      )}
      {children}
    </button>
  );
}
