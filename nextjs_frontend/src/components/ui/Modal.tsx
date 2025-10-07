"use client";
import React from "react";
import { Button } from "./Button";

// PUBLIC_INTERFACE
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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="secondary" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
