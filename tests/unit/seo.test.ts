/**
 * tests/unit/seo.test.ts
 * Validates JSON-LD builders, absoluteUrl, and metadata shapes.
 * Design §13.3 / R14.11–14.14
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock NEXT_PUBLIC_SITE_URL before importing the module
const SITE = "https://faisalnasir.dev";

describe("lib/seo — absoluteUrl", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds absolute URLs from path with leading slash", async () => {
    const { absoluteUrl } = await import("@/lib/seo");
    expect(absoluteUrl("/projects/order-saga")).toBe(
      "https://faisalnasir.dev/projects/order-saga"
    );
  });

  it("handles path without leading slash", async () => {
    const { absoluteUrl } = await import("@/lib/seo");
    expect(absoluteUrl("projects/rag-document-qa")).toBe(
      "https://faisalnasir.dev/projects/rag-document-qa"
    );
  });
});

describe("buildHomeJsonLd", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns ProfilePage with Person mainEntity", async () => {
    const { buildHomeJsonLd } = await import("@/lib/seo");
    const blocks = buildHomeJsonLd();
    const profilePage = blocks.find((b: any) => b["@type"] === "ProfilePage") as any;
    expect(profilePage).toBeDefined();
    expect(profilePage.mainEntity["@type"]).toBe("Person");
    expect(profilePage.mainEntity.name).toBe("Faisal Nasir");
  });

  it("Person.sameAs contains GitHub and LinkedIn", async () => {
    const { buildHomeJsonLd } = await import("@/lib/seo");
    const blocks = buildHomeJsonLd();
    const person = (blocks.find((b: any) => b["@type"] === "ProfilePage") as any)?.mainEntity;
    expect(person.sameAs).toContain("https://github.com/nasirfaisal83");
    expect(person.sameAs).toContain("https://www.linkedin.com/in/faisal-nasir-381a33131");
  });

  it("includes WebSite block", async () => {
    const { buildHomeJsonLd } = await import("@/lib/seo");
    const blocks = buildHomeJsonLd();
    const website = blocks.find((b: any) => b["@type"] === "WebSite");
    expect(website).toBeDefined();
  });

  it("does not include alternateName while placeholders remain", async () => {
    const { buildHomeJsonLd } = await import("@/lib/seo");
    const blocks = buildHomeJsonLd();
    const person = (blocks.find((b: any) => b["@type"] === "ProfilePage") as any)?.mainEntity;
    // site.ts currently has TODO_ placeholders
    expect(person.alternateName).toBeUndefined();
  });
});

describe("buildProjectJsonLd", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns SoftwareSourceCode with required properties", async () => {
    const { buildProjectJsonLd } = await import("@/lib/seo");
    const { projects } = await import("@/content/projects");
    const project = projects.find((p) => p.slug === "order-saga")!;
    const blocks = buildProjectJsonLd("order-saga", project);
    const ssc = blocks.find((b: any) => b["@type"] === "SoftwareSourceCode") as any;
    expect(ssc).toBeDefined();
    expect(ssc.name).toBe("Order-Saga");
    expect(ssc.description).toBeTruthy();
    expect(ssc.codeRepository).toBe("https://github.com/nasirfaisal83/Order-Saga");
    expect(ssc.programmingLanguage).toBe("Java");
    expect(ssc.author.name).toBe("Faisal Nasir");
  });

  it("returns BreadcrumbList with 3 items", async () => {
    const { buildProjectJsonLd } = await import("@/lib/seo");
    const { projects } = await import("@/content/projects");
    const project = projects.find((p) => p.slug === "order-saga")!;
    const blocks = buildProjectJsonLd("order-saga", project);
    const breadcrumb = blocks.find((b: any) => b["@type"] === "BreadcrumbList") as any;
    expect(breadcrumb?.itemListElement).toHaveLength(3);
  });

  it("con-detection uses Python as programmingLanguage", async () => {
    const { buildProjectJsonLd } = await import("@/lib/seo");
    const { projects } = await import("@/content/projects");
    const project = projects.find((p) => p.slug === "con-detection")!;
    const blocks = buildProjectJsonLd("con-detection", project);
    const ssc = blocks.find((b: any) => b["@type"] === "SoftwareSourceCode") as any;
    expect(ssc.programmingLanguage).toBe("Python");
  });

  it("omits codeRepository for a private repository", async () => {
    const { buildProjectJsonLd } = await import("@/lib/seo");
    const { projects } = await import("@/content/projects");
    const project = projects.find((p) => p.slug === "salon-appointment-system")!;
    const blocks = buildProjectJsonLd("salon-appointment-system", project);
    const ssc = blocks.find((b: any) => b["@type"] === "SoftwareSourceCode") as any;
    expect(ssc).toBeDefined();
    // The repository is private — no inaccessible URL may be emitted.
    expect(ssc.codeRepository).toBeUndefined();
    // Everything else is still present.
    expect(ssc.name).toBe("Salon Appointment System");
    expect(ssc.description).toBeTruthy();
    expect(ssc.author.name).toBe("Faisal Nasir");
    expect(ssc.programmingLanguage).toContain("Java");
    expect(ssc.programmingLanguage).toContain("TypeScript");
  });

  it("emergency-alert-system has array of programmingLanguages", async () => {
    const { buildProjectJsonLd } = await import("@/lib/seo");
    const { projects } = await import("@/content/projects");
    const project = projects.find((p) => p.slug === "emergency-alert-system")!;
    const blocks = buildProjectJsonLd("emergency-alert-system", project);
    const ssc = blocks.find((b: any) => b["@type"] === "SoftwareSourceCode") as any;
    expect(Array.isArray(ssc.programmingLanguage)).toBe(true);
    expect(ssc.programmingLanguage).toContain("Java");
    expect(ssc.programmingLanguage).toContain("C++");
  });
});
