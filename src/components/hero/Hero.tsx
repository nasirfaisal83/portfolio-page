"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Name } from "./Name";
import { HeroAscii } from "./HeroAscii";
import { HeroScreen } from "./HeroScreen";
import { site } from "@/content/site";

const SESSION_KEY = "hero-played";

export function Hero() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Hero moment states
  const [asciiOpacity, setAsciiOpacity] = useState(prefersReducedMotion ? 0 : 0);
  const [svgOpacity, setSvgOpacity] = useState(prefersReducedMotion ? 1 : 0);
  const [edgesDrawn, setEdgesDrawn] = useState(prefersReducedMotion);
  const hasResume = false; // set to true when public/resume.pdf exists (content-check warns)

  // Tagline is hidden when empty (intentionally omitted) or a TODO_ placeholder.
  const taglineValue: string = site.tagline;
  const hasTagline = taglineValue.length > 0 && !taglineValue.startsWith("TODO_");

  useEffect(() => {
    if (prefersReducedMotion) {
      setEdgesDrawn(true);
      setSvgOpacity(1);
      return;
    }

    // Check sessionStorage — do not replay
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setEdgesDrawn(true);
      setSvgOpacity(1);
      return;
    }

    // Timeline: 0–200ms hold | 200–900ms ASCII visible | 900–1400ms crossfade to SVG
    const t1 = setTimeout(() => setAsciiOpacity(1), 200);
    const t2 = setTimeout(() => {
      setAsciiOpacity(0);
      setSvgOpacity(1);
      setEdgesDrawn(true);
      if (typeof sessionStorage !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
    }, 900);

    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      (el.querySelector("h3") as HTMLElement | null)?.focus();
    }
  };

  return (
    <section
      aria-label="Introduction"
      style={{ padding: "var(--section-padding) var(--gutter)" }}
    >
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "48px",
          alignItems: "center",
        }}
      >
        {/* Left — text */}
        <div style={{ gridColumn: "span 5" }} className="min-[1024px]:col-span-5 col-span-12">
          <Name />

          <div className="mt-5" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p className="type-body" style={{ color: "var(--graphite)" }}>{site.roleLine}</p>
            <p className="type-body" style={{ color: "var(--graphite)" }}>{site.location}</p>
            <p className="type-body" style={{ color: "var(--graphite)" }}>{site.languages}</p>
          </div>

          {hasTagline && (
            <p
              className="type-identifier mt-4"
              style={{ fontStyle: "italic", color: "var(--graphite)" }}
            >
              {site.tagline}
            </p>
          )}

          {/* Primary actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="type-body no-underline px-5 py-3 shrink-0"
              style={{
                backgroundColor: "var(--ink)",
                color: "var(--vellum)",
                textDecoration: "none",
                borderRadius: "var(--radius-control)",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              See the projects
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="type-body no-underline px-5 py-3 shrink-0"
              style={{
                color: "var(--ink)",
                textDecoration: "none",
                border: "1px solid var(--ink)",
                borderRadius: "var(--radius-control)",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              GitHub
            </a>
            {hasResume && (
              <a
                href={site.resumeUrl}
                download
                className="type-body no-underline px-5 py-3 shrink-0"
                style={{
                  color: "var(--ink)",
                  textDecoration: "none",
                  border: "1px solid var(--ink)",
                  borderRadius: "var(--radius-control)",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Download resume
              </a>
            )}
          </div>
        </div>

        {/* Right — hero screen (stacked layers) */}
        <div
          style={{
            gridColumn: "span 7",
            position: "relative",
          }}
          className="min-[1024px]:col-span-7 col-span-12 mt-10 min-[1024px]:mt-0"
        >
          {/* ASCII layer */}
          {!prefersReducedMotion && asciiOpacity > 0 && (
            <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
              <HeroAscii opacity={asciiOpacity} />
            </div>
          )}
          {/* SVG layer */}
          <HeroScreen
            opacity={svgOpacity}
            edgesDrawn={edgesDrawn}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>
    </section>
  );
}
