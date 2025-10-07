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

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sidebar" className="w-full p-4">
      <div className="flex items-center gap-2 px-2 py-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">S</span>
        <span className="text-sm font-semibold">Socratic Assistant</span>
      </div>
      <ul className="mt-4 space-y-1">
        {navItems.map((item, index) => {
          const active = pathname === item.href;
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
