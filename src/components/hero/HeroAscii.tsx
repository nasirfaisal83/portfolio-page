"use client";

// The ASCII hero map — box-drawing text version of the five-project navigation map.
// Rendered as <pre>, aria-hidden (visual only), fades out during the hero moment.
export function HeroAscii({ opacity }: { opacity: number }) {
  return (
    <pre
      aria-hidden="true"
      style={{
        opacity,
        transition: `opacity 500ms ease-out`,
        color: "var(--signal)",
        backgroundColor: "var(--screen)",
        fontFamily: "var(--font-plex-mono), monospace",
        fontSize: "clamp(8px, 1.2vw, 13px)",
        lineHeight: 1.5,
        padding: "20px",
        borderRadius: "var(--radius-screen)",
        width: "100%",
        overflow: "hidden",
        margin: 0,
        userSelect: "none",
      }}
    >
{`              salon-appointment-system
                         │
  con-detection ─┐       │       ┌─ order-saga
                 └───────┼───────┘
                    ┌────┴────┐
                    │portfolio│
                    └────┬────┘
                 ┌───────┼───────┐
  emergency-alert┘       │       └─ rag-document-qa
       -system           │
                  tech-news-agent`}
    </pre>
  );
}
