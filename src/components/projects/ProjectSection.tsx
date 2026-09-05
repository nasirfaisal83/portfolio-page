"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { Project } from "@/content/projects";

// Lazy-load each screen — loaded only when section approaches viewport
const SCREEN_MAP: Record<string, React.ComponentType> = {
  "order-saga": dynamic(() =>
    import("@/components/screens/order-saga/OrderSagaScreen").then((m) => ({ default: m.OrderSagaScreen })),
    { ssr: false }
  ),
  rag: dynamic(() =>
    import("@/components/screens/rag-document-qa/RagScreen").then((m) => ({ default: m.RagScreen })),
    { ssr: false }
  ),
  agents: dynamic(() =>
    import("@/components/screens/tech-news-agent/AgentsScreen").then((m) => ({ default: m.AgentsScreen })),
    { ssr: false }
  ),
  stomp: dynamic(() =>
    import("@/components/screens/emergency-alert-system/StompScreen").then((m) => ({ default: m.StompScreen })),
    { ssr: false }
  ),
  detection: dynamic(() =>
    import("@/components/screens/con-detection/DetectionScreen").then((m) => ({ default: m.DetectionScreen })),
    { ssr: false }
  ),
};

interface ProjectSectionProps {
  project: Project;
}

export function ProjectSection({ project }: ProjectSectionProps) {
  const ScreenComponent = SCREEN_MAP[project.screen];

  return (
    <section
      id={project.slug}
      aria-labelledby={`heading-${project.slug}`}
      style={{
        padding: "var(--section-padding) 0",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* Text column — 5/12 */}
        <div style={{ gridColumn: "span 5" }} className="min-[1024px]:col-span-5 col-span-12">
          <h3
            id={`heading-${project.slug}`}
            className="type-h3 mb-4"
            style={{ maxWidth: "none" }}
            tabIndex={-1}
          >
            {project.title}
          </h3>
          <p className="type-body mb-6" style={{ color: "var(--graphite)" }}>
            {project.summary}
          </p>

          <p className="type-caption mb-1" style={{ color: "var(--graphite)" }}>
            Stack
          </p>
          <p className="type-body mb-6">
            {project.stack.join(", ")}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="type-body no-underline"
              style={{ color: "var(--signal-deep)" }}
            >
              View on GitHub
            </a>
            <Link
              href={`/projects/${project.slug}`}
              className="type-body no-underline"
              style={{ color: "var(--signal-deep)" }}
            >
              Read the {project.title} case study
            </Link>
          </div>
        </div>

        {/* Screen column — 7/12, sticky ≥1024px */}
        <div
          style={{ gridColumn: "span 7" }}
          className="min-[1024px]:col-span-7 col-span-12"
        >
          <div
            className="min-[1024px]:sticky"
            style={{ top: "96px" }}
          >
            {ScreenComponent && <ScreenComponent />}
          </div>
        </div>
      </div>
    </section>
  );
}
