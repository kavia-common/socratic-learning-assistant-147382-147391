"use client";

import { useEffect, useState } from "react";
import { safeStorage } from "@/lib/security";

/**
 * PUBLIC_INTERFACE
 * Simple cookie consent banner with local preference.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const enabled = process.env.NEXT_PUBLIC_COOKIE_BANNER_ENABLED === "true";

  useEffect(() => {
    if (!enabled) return;
    const pref = safeStorage.get("cookies.accepted");
    if (!pref) setOpen(true);
  }, [enabled]);

  if (!enabled || !open) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3">
      <div className="card p-4 max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="text-sm text-gray-700">
          We use essential cookies to operate this site and optional cookies for analytics.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              safeStorage.set("cookies.accepted", "all");
              setOpen(false);
            }}
            className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus-ring"
          >
            Accept all
          </button>
          <button
            onClick={() => {
              safeStorage.set("cookies.accepted", "essential");
              setOpen(false);
            }}
            className="px-3 py-2 rounded-md border hover:bg-gray-50 focus-ring"
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}
