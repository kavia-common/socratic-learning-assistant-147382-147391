"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/Button";

/**
 * PUBLIC_INTERFACE
 * Top header with basic role-aware actions and profile menu placeholders.
 * Accepts optional onToggleSidebar for integrating with a collapsible sidebar toggle.
 */
export default function Header() {
  const { role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b shadow-[var(--shadow-header)]">
      <div className="flex items-center justify-between px-4 md:px-6 header-compact">
        <Link href="/student" className="inline-flex items-center gap-2 focus-ring" aria-label="Socratic Home">
          <Image src="/logo.svg" alt="Socratic logo" width={24} height={24} priority />
          <span className="font-semibold">Socratic</span>
        </Link>
        <nav className="flex items-center gap-1.5">
          {role === "student" && (
            <>
              <Link href="/student" className="text-sm px-2 py-1.5 rounded-md hover:bg-gray-50 focus-ring">
                Student
              </Link>
              <Link href="/mentor" className="text-sm px-2 py-1.5 rounded-md hover:bg-gray-50 focus-ring">
                Mentor
              </Link>
              <Link href="/admin" className="text-sm px-2 py-1.5 rounded-md hover:bg-gray-50 focus-ring">
                Admin
              </Link>
            </>
          )}
          <Link href="/login" className="text-sm px-2 py-1.5 rounded-md hover:bg-gray-50 focus-ring">
            Login
          </Link>
          <Link href="/register" className="text-sm px-2 py-1.5 rounded-md hover:bg-gray-50 focus-ring">
            Register
          </Link>
          <Button variant="secondary" onClick={logout}>Sign out</Button>
        </nav>
      </div>
    </header>
  );
}
