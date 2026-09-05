import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "@/styles/globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

// Task 0.4 — IBM Plex Mono + IBM Plex Sans via next/font/google
// Latin subsets only, display: swap, size-adjusted fallbacks
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-plex-mono",
  adjustFontFallback: true,
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
  variable: "--font-plex-sans",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  // Default metadata — overridden per-page via generateMetadata
  title: {
    default: "Faisal Nasir — CS student, Ben-Gurion University",
    template: "%s | Faisal Nasir",
  },
  description:
    "CS student at Ben-Gurion University of the Negev, teaching assistant, and Hasoub on-campus community manager. Five public projects: RAG document Q&A, a choreography saga, a multi-agent news pipeline, a STOMP alert system, and YOLOv5 cone detection.",
  // R14.7 — robots meta + max-image-preview
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large" },
  },
  // Favicon — R12, design §14
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexMono.variable} ${plexSans.variable}`}>
      <body>
        {/* Skip link must be the first focusable element — R10.3 */}
        <SkipLink />
        <Nav />
        <main id="main" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
