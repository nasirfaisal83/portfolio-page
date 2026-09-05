import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { ProjectSection } from "@/components/projects/ProjectSection";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Community } from "@/components/sections/Community";
import { Contact } from "@/components/sections/Contact";
import { projects } from "@/content/projects";
import { buildHomeMetadata, buildHomeJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata();
}

export default function Home() {
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      {/* JSON-LD structured data */}
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <Hero />

      {/* Projects section */}
      <section
        id="projects"
        aria-labelledby="heading-projects"
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
        }}
      >
        <h2 id="heading-projects" className="type-h2 mb-4" style={{ maxWidth: "none" }}>
          Projects
        </h2>
        <p className="type-body mb-0">
          Five public repositories. Each screen runs the system described in that
          repository&apos;s README; the buttons drive real scenarios from it.
        </p>
        {projects.map((project) => (
          <ProjectSection key={project.slug} project={project} />
        ))}
      </section>

      {/* Remaining sections */}
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
        }}
      >
        <About />
        <Skills />
        <Community />
        <Contact />
      </div>
    </>
  );
}
