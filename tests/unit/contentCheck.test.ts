/**
 * tests/unit/contentCheck.test.ts
 * Verifies that the project slug set is exactly the required five,
 * and that content files import cleanly.
 * R15.2 / R15.3
 */

import { describe, it, expect } from "vitest";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { site } from "@/content/site";
import { seo } from "@/content/seo";
import { experience, about } from "@/content/experience";
import { caseStudies } from "@/content/casestudy";

const REQUIRED_SLUGS = new Set([
  "order-saga",
  "rag-document-qa",
  "tech-news-agent",
  "emergency-alert-system",
  "con-detection",
]);

describe("projects.ts", () => {
  it("exports exactly five projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("has exactly the required five slugs", () => {
    const actual = new Set(projects.map((p) => p.slug));
    for (const slug of REQUIRED_SLUGS) expect(actual.has(slug)).toBe(true);
    expect(actual.size).toBe(5);
  });

  it("every project has a non-empty summary, stack, and github", () => {
    for (const p of projects) {
      expect(p.summary.length).toBeGreaterThan(50);
      expect(p.stack.length).toBeGreaterThan(0);
      expect(p.github).toMatch(/^https:\/\/github\.com\//);
    }
  });
});

describe("site.ts", () => {
  it("has the correct email address", () => {
    expect(site.email).toBe("nasirfaisal83@gmail.com");
  });

  it("has valid github and linkedin URLs", () => {
    expect(site.github).toBe("https://github.com/nasirfaisal83");
    expect(site.linkedin).toContain("linkedin.com");
  });
});

describe("seo.ts", () => {
  it("home title is under 60 characters", () => {
    expect(seo.home.title.length).toBeLessThanOrEqual(60);
  });

  it("home description is 120–160 characters", () => {
    expect(seo.home.description.length).toBeGreaterThanOrEqual(120);
    expect(seo.home.description.length).toBeLessThanOrEqual(160);
  });

  it("all five project entries exist in seo.projects", () => {
    const slugs = Object.keys(seo.projects);
    for (const required of REQUIRED_SLUGS) expect(slugs).toContain(required);
  });
});

describe("skills.ts", () => {
  it("has 10 skill groups", () => {
    expect(skills).toHaveLength(10);
  });

  it("every group has at least one item", () => {
    for (const g of skills) expect(g.items.length).toBeGreaterThan(0);
  });
});

describe("experience.ts", () => {
  it("has exactly two experience entries", () => {
    expect(experience).toHaveLength(2);
  });

  it("about paragraphs are non-empty", () => {
    expect(about.study.length).toBeGreaterThan(20);
    expect(about.community.length).toBeGreaterThan(20);
    expect(about.learning.length).toBeGreaterThan(20);
  });
});

describe("casestudy.ts", () => {
  it("has prose for all five projects", () => {
    for (const slug of REQUIRED_SLUGS) {
      expect(caseStudies[slug]).toBeDefined();
    }
  });

  it("each case study has non-empty whatItDoes", () => {
    for (const slug of REQUIRED_SLUGS) {
      expect(caseStudies[slug].whatItDoes.length).toBeGreaterThan(100);
    }
  });

  it("each case study has at least 2 howItWorks sections", () => {
    for (const slug of REQUIRED_SLUGS) {
      expect(caseStudies[slug].howItWorks.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("each case study has at least 2 design decisions", () => {
    for (const slug of REQUIRED_SLUGS) {
      expect(caseStudies[slug].designDecisions.length).toBeGreaterThanOrEqual(2);
    }
  });
});
