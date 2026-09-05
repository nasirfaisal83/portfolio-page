"use client";

export function SkipLink() {
  return (
    <a
      href="#projects"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-vellum focus:rounded focus:text-sm focus:font-sans"
      style={{ color: "var(--vellum)", backgroundColor: "var(--ink)" }}
    >
      Skip to projects
    </a>
  );
}
