import type { Metadata } from "next";
import "./globals.css";
import ConsentModal from "@/components/ConsentModal";
import CookieBanner from "@/components/CookieBanner";
import { AuthProvider } from "@/lib/auth";
import { QueryProvider } from "@/lib/query";
import RouteTransition from "@/components/RouteTransition";

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
  // AppShell is used at each route to keep layout responsive and allow route-level variations
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <AuthProvider>
          <QueryProvider>
            <RouteTransition>{children}</RouteTransition>
            <ConsentModal />
            <CookieBanner />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
