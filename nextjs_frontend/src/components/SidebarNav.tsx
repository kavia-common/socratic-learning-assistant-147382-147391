"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Chat" },
  { href: "/upload", label: "Upload" },
  { href: "/analytics", label: "Analytics" },
  { href: "/privacy", label: "Privacy" },
  { href: "/security", label: "Security" },
];

export default function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Sidebar" role="navigation" className="w-full p-4">
      <div className="flex items-center gap-2 px-2 py-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">S</span>
        <span
          className={`text-sm font-semibold origin-left ${
            collapsed ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          } motion-safe:transition-all`}
          style={{ transitionDuration: "180ms" }}
          aria-hidden={collapsed}
        >
          Socratic Assistant
        </span>
      </div>
      <ul className="mt-4 space-y-1">
        {navItems.map((item, index) => {
          const active = pathname === item.href;
          const key = `${item.href}-${index}`;
          return (
            <li key={key} className="relative">
              <Link
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm focus-ring ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                }`}
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
              >
                {/* Left accent bar for active/hover state without layout shift */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-r transition-colors ${
                    active ? "bg-blue-500" : "bg-transparent group-hover:bg-blue-200 group-focus-visible:bg-blue-300"
                  }`}
                />
                <span
                  className={`whitespace-nowrap ${
                    collapsed ? "opacity-0 translate-x-[-4px] pointer-events-none" : "opacity-100 translate-x-0"
                  } motion-safe:transition-all`}
                  style={{ transitionDuration: "160ms" }}
                  aria-hidden={collapsed}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
