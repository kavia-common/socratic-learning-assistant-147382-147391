import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import SidebarNav from "@/components/SidebarNav";
import HeaderBar from "@/components/HeaderBar";
import ConsentModal from "@/components/ConsentModal";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Socratic Learning Assistant",
  description:
    "A conversational AI for Socratic learning with privacy-first and security-ready design.",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <div className="flex min-h-screen">
          <aside className="hidden md:flex w-64 shrink-0 border-r border-gray-200 bg-white">
            <SidebarNav />
          </aside>
          <div className="flex-1 flex flex-col min-w-0">
            <HeaderBar />
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

        <ConsentModal />
        <CookieBanner />
      </body>
    </html>
  );
}
