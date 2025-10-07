"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageSquare, Upload, BarChart3 } from "lucide-react";

/**
 * PUBLIC_INTERFACE
 * AppShell provides the responsive application layout with a collapsible sidebar and top header.
 * - Sidebar nav: Chat (/chat), Materials (/materials), Analytics (/analytics)
 * - Header: brand name and avatar placeholder
 * - Mobile: sidebar transforms into a drawer with overlay, toggled via header menu button
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const NavItems = [
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/materials", label: "Materials", icon: Upload },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-72 md:w-64 bg-white border-r border-gray-200 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Primary"
      >
        <div className="h-14 border-b flex items-center px-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">S</span>
          <span className="ml-2 font-semibold">Socratic Assistant</span>
        </div>
        <nav className="p-3 space-y-1">
          {NavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-50 focus-ring"
                onClick={() => setOpen(false)}
              >
                <Icon size={18} aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-3 text-xs text-gray-500 hidden md:block">
          Ocean Professional • v0.1
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-2 rounded-md border hover:bg-gray-50 focus-ring"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
              <Link href="/" className="font-semibold focus-ring">
                Socratic
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
                <span>Beta</span>
              </div>
              <button
                className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-semibold focus-ring"
                aria-label="User menu"
                title="User"
              >
                SA
              </button>
            </div>
          </div>
          <div className="h-[3px] bg-gradient-to-r from-blue-500/10 to-gray-50" />
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>

        <footer className="px-4 md:px-6 py-4 text-sm text-gray-500 bg-white border-t">
          <div className="flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} Socratic Learning Assistant</span>
            <nav className="flex gap-4">
              <Link className="hover:underline focus-ring" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:underline focus-ring" href="/security">
                Security
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
