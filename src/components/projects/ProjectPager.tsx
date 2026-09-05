import Link from "next/link";
import { projects } from "@/content/projects";

interface ProjectPagerProps {
  currentSlug: string;
}

export function ProjectPager({ currentSlug }: ProjectPagerProps) {
  const idx = projects.findIndex((p) => p.slug === currentSlug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <nav
      aria-label="Project navigation"
      className="flex justify-between items-center mt-16 pt-8"
      style={{ borderTop: "1px solid var(--hairline)" }}
    >
      <Link
        href={`/projects/${prev.slug}`}
        className="type-body no-underline"
        style={{ color: "var(--signal-deep)" }}
      >
        ← {prev.title}
      </Link>
      <Link
        href={`/projects/${next.slug}`}
        className="type-body no-underline"
        style={{ color: "var(--signal-deep)" }}
      >
        {next.title} →
      </Link>
    </nav>
  );
}
