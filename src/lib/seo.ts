// src/lib/seo.ts
// Utilities for building Metadata objects, canonical URLs, and JSON-LD blocks.
// All factual values come from src/content/* — nothing is hardcoded here.

import type { Metadata } from "next";
import { site } from "@/content/site";
import { seo, type ProjectSlug } from "@/content/seo";
import type { Project } from "@/content/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Build an absolute URL for a given path. */
export function absoluteUrl(path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Shared OG image for the home page */
const homeOgImage = absoluteUrl("/og/home.png");

/** Build Metadata for the home page. */
export function buildHomeMetadata(): Metadata {
  const { title, description } = seo.home;
  const url = absoluteUrl("/");
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: homeOgImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [homeOgImage],
    },
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  };
}

/** Build Metadata for a case-study page. */
export function buildProjectMetadata(slug: ProjectSlug): Metadata {
  const projectSeo = seo.projects[slug];
  const title = `${projectSeo.title}${seo.suffix}`;
  const { description } = projectSeo;
  const url = absoluteUrl(`/projects/${slug}`);
  const ogImage = absoluteUrl(`/og/${slug}.png`);
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  };
}

// ----------------------------------------------------------------
// JSON-LD builders
// ----------------------------------------------------------------

/** ProfilePage + Person + WebSite for the home page. */
export function buildHomeJsonLd() {
  const personBase: Record<string, unknown> = {
    "@type": "Person",
    name: site.name,
    url: absoluteUrl("/"),
    sameAs: [site.github, site.linkedin],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Ben-Gurion University of the Negev",
    },
    knowsLanguage: ["ar", "he", "en"],
  };

  // Only add alternateName when the renderings exist (not empty, not a TODO_ placeholder)
  const arabicValue: string = site.nameArabic;
  const hebrewValue: string = site.nameHebrew;
  const hasArabic = arabicValue.length > 0 && !arabicValue.startsWith("TODO_");
  const hasHebrew = hebrewValue.length > 0 && !hebrewValue.startsWith("TODO_");
  if (hasArabic || hasHebrew) {
    const alts: string[] = [];
    if (hasArabic) alts.push(arabicValue);
    if (hasHebrew) alts.push(hebrewValue);
    personBase.alternateName = alts.length === 1 ? alts[0] : alts;
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      mainEntity: personBase,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: absoluteUrl("/"),
    },
  ];
}

/** SoftwareSourceCode + BreadcrumbList for a case-study page. */
export function buildProjectJsonLd(slug: ProjectSlug, project: Project) {
  const projectSeo = seo.projects[slug];
  const programmingLanguage =
    projectSeo.programmingLanguage.length === 1
      ? projectSeo.programmingLanguage[0]
      : [...projectSeo.programmingLanguage];

  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: project.title,
      description: project.summary,
      codeRepository: project.github,
      programmingLanguage,
      author: {
        "@type": "Person",
        name: site.name,
        url: absoluteUrl("/"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: absoluteUrl("/#projects"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: project.title,
          item: absoluteUrl(`/projects/${slug}`),
        },
      ],
    },
  ];
}
