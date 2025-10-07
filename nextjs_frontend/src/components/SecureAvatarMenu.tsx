"use client";

import { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * A11y-first avatar menu placeholder, ready for auth integration.
 */
export default function SecureAvatarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-blue-100 text-blue-800 font-semibold focus-ring"
      >
        SA
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow"
        >
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Profile</button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Settings</button>
          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50">Sign out</button>
        </div>
      ) : null}
    </div>
  );
}
