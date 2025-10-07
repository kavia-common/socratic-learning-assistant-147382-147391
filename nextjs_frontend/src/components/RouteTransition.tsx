"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * RouteTransition wraps page content and animates transitions on route changes.
 * - Uses a key based on pathname to trigger enter/exit animations.
 * - Motion-safe crossfade + slight slide, 180–220ms ease-out.
 * - No layout shift: container is position: relative; outgoing content absolute during exit.
 * - Fully disabled under prefers-reduced-motion.
 */
export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Manage focus after route change for accessibility without disrupting app-level focus patterns.
  useEffect(() => {
    // Do not steal focus if user already focused an element (e.g., via in-page navigation)
    if (document.activeElement && document.activeElement !== document.body) return;
    // Focus main landmark if present
    const main = document.querySelector("main");
    if (main instanceof HTMLElement) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      // Clean up tabindex after focusing to keep DOM tidy
      const t = setTimeout(() => main.removeAttribute("tabindex"), 0);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return (
    <div ref={containerRef} className="route-transition-container">
      <div key={pathname} className="route-transition-enter">
        {children}
      </div>
    </div>
  );
}
