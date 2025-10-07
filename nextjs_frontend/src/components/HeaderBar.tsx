"use client";

import Link from "next/link";
import Image from "next/image";
import SecureAvatarMenu from "./SecureAvatarMenu";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <Link href="/" className="inline-flex items-center gap-2 focus-ring" aria-label="Socratic Home">
          <Image src="/logo.svg" alt="Socratic logo" width={24} height={24} priority />
          <span className="font-semibold">Socratic</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/upload" className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 focus-ring">
            Upload
          </Link>
          <SecureAvatarMenu />
        </div>
      </div>
    </header>
  );
}
