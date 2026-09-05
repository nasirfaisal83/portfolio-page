"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#community", label: "Community" },
  { href: "#contact", label: "Contact" },
  { href: site.github, label: "GitHub", external: true },
];

const SECTION_IDS = ["projects", "about", "skills", "community", "contact"];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sticky border on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for active section underline
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 h-16 flex items-center transition-shadow"
      style={{
        backgroundColor: "var(--vellum)",
        borderBottom: scrolled ? "1px solid var(--hairline)" : "1px solid transparent",
      }}
    >
      <div
        className="w-full flex items-center justify-between"
        style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "0 var(--gutter)" }}
      >
        {/* Site name */}
        <Link
          href="/"
          className="type-identifier no-underline hover:no-underline"
          style={{ color: "var(--ink)", textDecoration: "none", fontSize: "15px" }}
          aria-label="Faisal Nasir — home"
        >
          {site.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label, external }) => {
            const sectionId = href.startsWith("#") ? href.slice(1) : null;
            const isActive = sectionId ? activeSection === sectionId : false;
            return (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="type-caption no-underline transition-colors relative"
                style={{
                  color: "var(--ink)",
                  textDecoration: "none",
                  paddingBottom: "2px",
                  borderBottom: isActive
                    ? "2px solid var(--signal-deep)"
                    : "2px solid transparent",
                  transition: "color var(--t-hover), border-color var(--t-hover)",
                }}
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden type-caption"
          style={{ color: "var(--ink)", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 top-16 z-50 md:hidden flex flex-col pt-8 gap-6 px-6"
          style={{ backgroundColor: "var(--vellum)", borderTop: "1px solid var(--hairline)" }}
        >
          {NAV_LINKS.map(({ href, label, external }) => (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="type-h3 no-underline"
              style={{ color: "var(--ink)", textDecoration: "none" }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
