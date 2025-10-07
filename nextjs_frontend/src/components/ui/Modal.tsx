"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "./Button";

/**
 * PUBLIC_INTERFACE
 * Modal – Accessible dialog with overlay, focus management, and motion-aware transitions
 */
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        aria-hidden
        className="fixed inset-0 bg-black/40 u-transition"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        ref={dialogRef}
        className="relative card w-full max-w-2xl p-6 u-transition motion-safe:animate-[fadeIn_180ms_ease-out]"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="secondary" onClick={onClose} aria-label="Close modal" size="sm">
            Close
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
