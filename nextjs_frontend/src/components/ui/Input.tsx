"use client";
import React from "react";

// PUBLIC_INTERFACE
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`rounded-md border px-3 py-2 focus-ring ${className || ""}`}
        {...props}
      />
    );
  }
);
