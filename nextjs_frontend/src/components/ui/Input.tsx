"use client";
import React from "react";

type Size = "sm" | "md" | "lg";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: Size;
};

/**
 * PUBLIC_INTERFACE
 * Input – Ocean Professional text input
 * - sizes: sm, md, lg
 * - supports invalid and disabled
 * - theme-based focus ring and smooth transitions
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = "md", disabled, ...props },
  ref
) {
  const sizes: Record<Size, string> = {
    sm: "h-8 text-sm px-2.5",
    md: "h-9 text-sm px-3",
    lg: "h-11 text-base px-3.5",
  };

  // Ensure TypeScript understands the key is constrained to Size
  const sizeKey: Size = (["sm", "md", "lg"] as const).includes(size as Size) ? (size as Size) : "md";

  return (
    <input
      ref={ref}
      disabled={disabled}
      className={[
        "u-transition w-full rounded-md border outline-none focus-ring placeholder:text-gray-400",
        "bg-white border-[var(--border)] text-[var(--color-text)]",
        "hover:border-gray-300",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        sizes[sizeKey],
        className || "",
      ].join(" ")}
      {...props}
    />
  );
});
