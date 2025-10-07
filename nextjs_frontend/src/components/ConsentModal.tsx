"use client";

import { useEffect, useState } from "react";
import { safeStorage } from "@/lib/security";

/**
 * PUBLIC_INTERFACE
 * GDPR-style consent modal for data processing/analytics.
 */
export default function ConsentModal() {
  const [open, setOpen] = useState(false);
  const required = process.env.NEXT_PUBLIC_CONSENT_REQUIRED === "true";

  useEffect(() => {
    if (!required) return;
    const consent = safeStorage.get("consent");
    if (!consent) setOpen(true);
  }, [required]);

  if (!required || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Consent Required"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="card w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold">Your consent matters</h2>
        <p className="mt-2 text-gray-700">
          We use your data to provide Socratic guidance and basic analytics. You can withdraw consent anytime in Privacy.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => {
              safeStorage.set("consent", "granted");
              setOpen(false);
            }}
            className="u-transition px-3 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-blue-700 focus-ring"
          >
            I agree
          </button>
          <button
            onClick={() => {
              safeStorage.set("consent", "denied");
              setOpen(false);
            }}
            className="u-transition px-3 py-2 rounded-md border border-[var(--border)] hover:bg-gray-50 focus-ring"
          >
            I decline
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          See our <a href="/privacy" className="underline">Privacy Policy</a> for details.
        </p>
      </div>
    </div>
  );
}
