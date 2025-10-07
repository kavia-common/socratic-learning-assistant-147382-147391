"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Badge } from "./ui/Badge";

// De-duplicated student nav to avoid two items with identical href
const studentItems = [
  { href: "/student", label: "Student Home" },
];

const mentorItems = [
  { href: "/mentor", label: "Students" },
  { href: "/mentor", label: "Analytics" },
];

const adminItems = [
  { href: "/admin", label: "Users" },
  { href: "/admin", label: "Departments" },
  { href: "/admin", label: "Analytics" },
];

/**
 * PUBLIC_INTERFACE
 * Role-aware Sidebar with streak indicator (for students).
 */
export default function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const items =
    role === "admin" ? adminItems : role === "mentor" ? mentorItems : studentItems;

  return (
    <nav aria-label="Sidebar" className="w-full p-4">
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
            S
          </span>
          <span className="text-sm font-semibold">Socratic Assistant</span>
        </div>
        {role !== "student" ? null : (
          <Badge className="bg-amber-100 text-amber-800" aria-label="Current streak">
            🔥 Streak: 3
          </Badge>
        )}
      </div>
      <ul className="mt-4 space-y-1">
        {items.map((item, index) => {
          const active = pathname === item.href;
          // Use a stable, unique key even if future items share href
          const key = `${item.href}-${index}`;
          return (
            <li key={key}>
              <Link
                className={`block rounded-md px-3 py-2 text-sm focus-ring ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                }`}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
