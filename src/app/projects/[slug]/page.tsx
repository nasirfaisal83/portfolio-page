import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProjectPager } from "@/components/projects/ProjectPager";
import { StackTable } from "@/components/projects/StackTable";
import { CaseStudyScreen } from "@/components/projects/CaseStudyScreen";
import { projects } from "@/content/projects";
import { caseStudies } from "@/content/casestudy";
import { buildProjectMetadata, buildProjectJsonLd } from "@/lib/seo";
import type { ProjectSlug } from "@/content/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return buildProjectMetadata(slug as ProjectSlug);
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const prose = caseStudies[slug];
  const jsonLd = buildProjectJsonLd(slug as ProjectSlug, project);

  return (
    <>
      {/* JSON-LD */}
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <article
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "var(--section-padding) var(--gutter)",
        }}
      >
        {/* Breadcrumb — Home / Projects / {repo name} */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/#projects" },
            { label: project.title },
          ]}
        />

        {/* h1 = repository name */}
        <h1 className="type-name mb-8" style={{ maxWidth: "none" }}>
          {project.title}
        </h1>

        {/* Screen — full width */}
        <div className="mb-12">
          <CaseStudyScreen screenId={project.screen} />
        </div>

        {/* What it does */}
        {prose && (
          <>
            <section aria-labelledby="what-it-does" className="mb-10">
              <h2 id="what-it-does" className="type-h2 mb-4" style={{ maxWidth: "none" }}>
                What it does
              </h2>
              <p className="type-body">{prose.whatItDoes}</p>
            </section>

            {/* How it works */}
            <section aria-labelledby="how-it-works" className="mb-10">
              <h2 id="how-it-works" className="type-h2 mb-6" style={{ maxWidth: "none" }}>
                How it works
              </h2>
              {prose.howItWorks.map(({ heading, body }) => (
                <div key={heading} className="mb-6">
                  <h3 className="type-h3 mb-2" style={{ maxWidth: "none" }}>
                    {heading}
                  </h3>
                  <p className="type-body">{body}</p>
                </div>
              ))}
            </section>

            {/* Design decisions */}
            <section aria-labelledby="design-decisions" className="mb-10">
              <h2 id="design-decisions" className="type-h2 mb-4" style={{ maxWidth: "none" }}>
                Design decisions
              </h2>
              <ul className="type-body list-disc pl-6 flex flex-col gap-2" style={{ maxWidth: "none" }}>
                {prose.designDecisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* Stack table */}
        <section aria-labelledby="stack" className="mb-10">
          <h2 id="stack" className="type-h2 mb-4" style={{ maxWidth: "none" }}>
            Stack
          </h2>
          <StackTable stack={project.stack} />
        </section>

        {/* Source */}
        <section aria-labelledby="source" className="mb-10">
          <h2 id="source" className="type-h2 mb-4" style={{ maxWidth: "none" }}>
            Source
          </h2>
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="type-body"
              style={{ color: "var(--signal-deep)" }}
            >
              View {project.title} on GitHub →
            </a>
          ) : (
            <p className="type-body" style={{ color: "var(--graphite)" }}>
              This was built for a client and the repository is private. Code and
              architecture details are available on request.
            </p>
          )}
        </section>

        {/* Previous / Next */}
        <ProjectPager currentSlug={project.slug} />
      </article>
    </>
  );
}
