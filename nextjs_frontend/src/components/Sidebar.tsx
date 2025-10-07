"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Badge } from "./ui/Badge";

/**
 * PUBLIC_INTERFACE
 * Role-aware Sidebar with optional collapsed (icons-only) layout and streak indicator (for students).
 */
export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const { role } = useAuth();
  const pathname = usePathname();

  // Nav definitions
  const studentItems = [{ href: "/student", label: "Student Home" }];
  const mentorItems = [
    { href: "/mentor", label: "Students" },
    { href: "/mentor", label: "Analytics" },
  ];
  const adminItems = [
    { href: "/admin", label: "Users" },
    { href: "/admin", label: "Departments" },
    { href: "/admin", label: "Analytics" },
  ];

  const items =
    role === "admin" ? adminItems : role === "mentor" ? mentorItems : studentItems;

  return (
    <nav aria-label="Sidebar" className="w-full p-4">
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
            S
          </span>
          <span
            className={`text-sm font-semibold origin-left ${
              collapsed ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
            } motion-safe:transition-all`}
            aria-hidden={collapsed}
            style={{ transitionDuration: "180ms" }}
          >
            Socratic Assistant
          </span>
        </div>
        {role !== "student" ? null : (
          <Badge
            className={`bg-amber-100 text-amber-800 ${
              collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            } motion-safe:transition-opacity`}
            aria-label="Current streak"
            aria-hidden={collapsed}
          >
            🔥 Streak: 3
          </Badge>
        )}
      </div>
      <ul className="mt-4 space-y-1">
        {items.map((item, index) => {
          const active = pathname === item.href;
          const key = `${item.href}-${index}`;
          return (
            <li key={key} className="relative">
              <Link
                className={`group flex items-center gap-3 rounded-md pl-3 pr-3 py-2 text-sm focus-ring ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                }`}
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
              >
                {/* Left accent bar in primary color, no layout shift */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-r transition-colors ${
                    active ? "bg-blue-600" : "bg-transparent group-hover:bg-blue-200 group-focus-visible:bg-blue-300"
                  }`}
                />
                {/* In this generic Sidebar we don't have icons defined, so only label with opacity change */}
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
