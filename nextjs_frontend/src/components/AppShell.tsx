"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, MessageSquare, Upload, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { safeStorage } from "@/lib/security";

/**
 * PUBLIC_INTERFACE
 * AppShell provides the responsive application layout with a collapsible sidebar and top header.
 * - Sidebar nav: Chat (/chat), Materials (/materials), Analytics (/analytics)
 * - Header: brand name and avatar placeholder
 * - Mobile: sidebar transforms into a drawer with overlay, toggled via header menu button
 * - Desktop: supports collapsed (icons-only) sidebar with animated width + label opacity
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  // Mobile drawer open/close
  const [open, setOpen] = useState(false);
  // Desktop collapsed state (icons-only)
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Persist collapsed preference
  useEffect(() => {
    const pref = safeStorage.get("ui.sidebar.collapsed");
    if (pref === "true") setCollapsed(true);
  }, []);
  useEffect(() => {
    safeStorage.set("ui.sidebar.collapsed", collapsed ? "true" : "false");
  }, [collapsed]);

  // Manage focus when expanding: focus first interactive element in the sidebar
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!collapsed) {
      // Move focus to first interactive element for keyboard users
      const firstFocusable = sidebarRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [collapsed]);

  const NavItems = useMemo(
    () => [
      { href: "/chat", label: "Chat", icon: MessageSquare },
      { href: "/materials", label: "Materials", icon: Upload },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
    []
  );

  // Toggle handlers
  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);
  const closeMobile = useCallback(() => setOpen(false), []);

  return (
    <div className="flex min-h-screen text-[var(--color-text)]">
      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      {/* Sidebar: animate width and internal label opacity; respect motion preferences via Tailwind motion-safe utilities */}
      <aside
        id="primary-sidebar"
        ref={sidebarRef}
        className={`fixed md:static z-50 top-0 left-0 h-full bg-white border-r border-gray-200 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Primary navigation"
        role="navigation"
      >
        <div
          className={`flex h-full flex-col ${
            // Width animation (motion-safe via CSS var transition)
            collapsed ? "w-16" : "w-[280px]"
          } motion-safe:transition-[width]`}
          style={{ transitionDuration: "220ms", transitionTimingFunction: "ease-out" }}
        >
          {/* Brand row */}
          <div className="h-14 border-b flex items-center px-4" role="banner" aria-label="Sidebar brand">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">S</span>
            <span
              className={`ml-2 font-semibold origin-left ${
                collapsed ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
              } motion-safe:transition-all`}
              style={{ transitionDuration: "200ms" }}
              aria-hidden={collapsed}
            >
              Socratic Assistant
            </span>
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-1" aria-label="Primary sections">
            {NavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-800 hover:bg-gray-50 focus-ring"
                  onClick={closeMobile}
                  aria-label={collapsed ? item.label : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Left accent bar appears on hover/focus without shifting layout */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-r bg-transparent group-hover:bg-blue-200 group-focus-visible:bg-blue-300 transition-colors"
                  />
                  <Icon size={18} aria-hidden />
                  {/* Hide the text visually when collapsed, but keep in DOM for layout/transition */}
                  <span
                    className={`whitespace-nowrap ${
                      collapsed ? "opacity-0 translate-x-[-4px] pointer-events-none" : "opacity-100 translate-x-0"
                    } motion-safe:transition-all`}
                    style={{ transitionDuration: "180ms" }}
                    aria-hidden={collapsed}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer text (hide when collapsed) */}
          <div
            className={`mt-auto p-3 text-xs text-gray-500 hidden md:block ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            } motion-safe:transition-opacity`}
          >
            Ocean Professional • v0.1
          </div>

          {/* Collapse/expand toggle (desktop) */}
          <div className="p-3 hidden md:block">
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-controls="primary-sidebar"
              aria-pressed={collapsed}
              className="u-transition w-full flex items-center justify-center gap-2 rounded-md border border-[var(--border)] hover:bg-gray-50 focus-ring h-9"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={16} aria-hidden /> : <ChevronLeft size={16} aria-hidden />}
              <span
                className={`text-sm ${
                  collapsed ? "opacity-0 translate-x-[-4px] pointer-events-none" : "opacity-100 translate-x-0"
                } motion-safe:transition-all`}
                style={{ transitionDuration: "160ms" }}
                aria-hidden={collapsed}
              >
                {collapsed ? "" : "Collapse"}
              </span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header: compact 56–64px, consistent padding, subtle shadow */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b shadow-[var(--shadow-header)]" role="banner" aria-label="Application header">
          <div className="flex items-center justify-between px-4 md:px-6 header-compact">
            <div className="flex items-center gap-2">
              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-md border hover:bg-gray-50 focus-ring"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="primary-sidebar"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>

              <Link href="/" className="font-semibold focus-ring" aria-label="Socratic home">
                Socratic
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {/* Desktop collapse toggle in header for quick access */}
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-controls="primary-sidebar"
                aria-pressed={collapsed}
                className="hidden md:inline-flex items-center gap-1.5 text-sm px-2 py-1.5 rounded-md border hover:bg-gray-50 focus-ring u-transition"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronRight size={16} aria-hidden /> : <ChevronLeft size={16} aria-hidden />}
                <span className="hidden lg:inline">{collapsed ? "Expand" : "Collapse"}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600" role="status" aria-live="polite">
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
          {/* Decorative gradient divider under header */}
          <div className="h-[3px] bg-gradient-to-r from-blue-500/10 to-gray-50" />
        </header>

        {/* Main content */}
        <main id="main" className="flex-1 p-4 md:p-6" role="main" aria-label="Main content area">{children}</main>

        <footer className="px-4 md:px-6 py-4 text-sm text-gray-500 bg-white border-t" role="contentinfo" aria-label="Footer">
          <div className="flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} Socratic Learning Assistant</span>
            <nav className="flex gap-4" aria-label="Legal">
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
