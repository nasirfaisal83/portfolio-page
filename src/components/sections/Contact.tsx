import { CopyButton } from "@/components/ui/CopyButton";
import { site } from "@/content/site";

// Resume visibility is determined at build time via content-check.ts
// We rely on CSS/conditional rendering here — resume.pdf presence is warned in build.
const HAS_RESUME = false; // set true when resume.pdf is in public/

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="heading-contact"
      style={{ padding: "var(--section-padding) 0" }}
    >
      <h2 id="heading-contact" className="type-h2 mb-8" style={{ maxWidth: "none" }}>
        Contact
      </h2>

      {/* Email — large mono identifier */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <a
          href={`mailto:${site.email}`}
          className="type-h3 no-underline"
          style={{
            fontFamily: "var(--font-plex-mono), monospace",
            color: "var(--ink)",
            textDecoration: "none",
            fontSize: "clamp(18px, 2.5vw, 28px)",
          }}
        >
          {site.email}
        </a>
        <CopyButton text={site.email} />
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-4">
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="type-body no-underline px-5 py-3"
          style={{
            color: "var(--ink)",
            border: "1px solid var(--ink)",
            borderRadius: "var(--radius-control)",
            textDecoration: "none",
            minHeight: "44px",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          GitHub
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="type-body no-underline px-5 py-3"
          style={{
            color: "var(--ink)",
            border: "1px solid var(--ink)",
            borderRadius: "var(--radius-control)",
            textDecoration: "none",
            minHeight: "44px",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          LinkedIn
        </a>
        {HAS_RESUME && (
          <a
            href={site.resumeUrl}
            download
            className="type-body no-underline px-5 py-3"
            style={{
              color: "var(--ink)",
              border: "1px solid var(--ink)",
              borderRadius: "var(--radius-control)",
              textDecoration: "none",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Download resume
          </a>
        )}
      </div>
    </section>
  );
}
