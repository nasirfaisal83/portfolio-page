/**
 * tests/seo/seo.spec.ts
 * Playwright SEO test suite — runs over the built `out/` directory served locally.
 * Design §13.8 / R14.6, 14.8–14.13, 14.20, 18.2
 *
 * Covers:
 *   - Exactly one h1, one <title>, one meta description, one canonical per page
 *   - Titles and descriptions unique across 6 pages and within length rules
 *   - No noindex on production pages
 *   - JSON-LD blocks parse and contain required properties; sameAs has both profile URLs
 *   - og:title, og:description, og:url, og:image, og:type, twitter:card present
 *   - sitemap.xml lists exactly 6 URLs; robots.txt names the sitemap
 *   - Each case-study page has ≥300 words in <main>, required links (home, GitHub, prev/next)
 */

import { test, expect, type Page } from "@playwright/test";
import { projects } from "../../src/content/projects";
import { site } from "../../src/content/site";

// ── helpers ──────────────────────────────────────────────────────────────────

async function getMeta(page: Page, name: string): Promise<string> {
  return page.$eval(
    `meta[name="${name}"], meta[property="${name}"]`,
    (el) => (el as HTMLMetaElement).content
  ).catch(() => "");
}

async function getCanonical(page: Page): Promise<string> {
  return page.$eval(
    `link[rel="canonical"]`,
    (el) => (el as HTMLLinkElement).href
  ).catch(() => "");
}

async function getJsonLd(page: Page): Promise<object[]> {
  const texts = await page.$$eval(
    'script[type="application/ld+json"]',
    (els) => els.map((el) => el.textContent ?? "")
  );
  return texts.map((t) => JSON.parse(t));
}

async function getTitle(page: Page): Promise<string> {
  return page.title();
}

async function wordCount(page: Page): Promise<number> {
  // Count words in <main>, excluding any SVG/script content
  const text = await page.$eval("main", (el) => {
    // Remove script and SVG elements from clone
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("script, svg, noscript").forEach((n) => n.remove());
    return clone.textContent ?? "";
  });
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── test configuration ────────────────────────────────────────────────────────

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? BASE;

const PAGES = [
  { path: "/", label: "home", isHome: true },
  ...projects.map((p) => ({
    path: `/projects/${p.slug}`,
    label: p.slug,
    isHome: false,
    project: p,
  })),
];

// ── uniqueness trackers ───────────────────────────────────────────────────────
const seenTitles = new Set<string>();
const seenDescriptions = new Set<string>();

// ── per-page tests ────────────────────────────────────────────────────────────

for (const pg of PAGES) {
  test.describe(`Page: ${pg.label}`, () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(`${BASE}${pg.path}`);
    });

    test.afterEach(async () => {
      await page.close();
    });

    // ── Exactly one h1 ──
    test("has exactly one h1", async () => {
      const h1s = await page.$$("h1");
      expect(h1s).toHaveLength(1);
    });

    // ── Exactly one <title> ──
    test("has a non-empty title within 60 chars (prefix)", async () => {
      const title = await getTitle(page);
      expect(title.trim().length).toBeGreaterThan(0);
      // The part before " | " should be ≤60 chars
      const prefix = title.split(" | ")[0];
      expect(prefix.length).toBeLessThanOrEqual(60);
    });

    // ── Title uniqueness ──
    test("title is unique across all pages", async () => {
      const title = await getTitle(page);
      expect(seenTitles.has(title)).toBe(false);
      seenTitles.add(title);
    });

    // ── Meta description ──
    test("has a description of 120–160 characters", async () => {
      const desc = await getMeta(page, "description");
      expect(desc.length).toBeGreaterThanOrEqual(120);
      expect(desc.length).toBeLessThanOrEqual(160);
    });

    // ── Description uniqueness ──
    test("description is unique across all pages", async () => {
      const desc = await getMeta(page, "description");
      expect(seenDescriptions.has(desc)).toBe(false);
      seenDescriptions.add(desc);
    });

    // ── Canonical URL ──
    test("canonical URL equals absolute path on configured host", async () => {
      const canonical = await getCanonical(page);
      const expected = `${SITE_URL}${pg.path}`;
      expect(canonical).toBe(expected);
    });

    // ── No noindex on production ──
    test("does not carry noindex", async () => {
      const robots = await getMeta(page, "robots");
      expect(robots.toLowerCase()).not.toContain("noindex");
    });

    // ── Open Graph tags ──
    test("has required Open Graph tags", async () => {
      const required = ["og:title", "og:description", "og:url", "og:image", "og:type"];
      for (const prop of required) {
        const val = await getMeta(page, prop);
        expect(val.trim(), `missing ${prop}`).not.toBe("");
      }
    });

    // ── Twitter card ──
    test("has twitter:card", async () => {
      const card = await getMeta(page, "twitter:card");
      expect(card).toBe("summary_large_image");
    });

    // ── JSON-LD ──
    test("has at least one valid JSON-LD block with required properties", async () => {
      const blocks = await getJsonLd(page);
      expect(blocks.length).toBeGreaterThanOrEqual(1);
      for (const block of blocks) {
        expect(block).toHaveProperty("@context", "https://schema.org");
        expect(block).toHaveProperty("@type");
      }
    });

    // Home-page-specific JSON-LD
    if (pg.isHome) {
      test("home JSON-LD: ProfilePage has Person with sameAs pointing to GitHub and LinkedIn", async () => {
        const blocks = await getJsonLd(page);
        const profilePage = blocks.find(
          (b: any) => b["@type"] === "ProfilePage"
        ) as any;
        expect(profilePage).toBeDefined();
        const person = profilePage?.mainEntity;
        expect(person?.["@type"]).toBe("Person");
        expect(person?.name).toBe(site.name);
        const sameAs: string[] = person?.sameAs ?? [];
        expect(sameAs).toContain(site.github);
        expect(sameAs).toContain(site.linkedin);
      });
    }

    // Case-study-specific checks
    if (!pg.isHome && "project" in pg) {
      test("case study has ≥300 words in main", async () => {
        const count = await wordCount(page);
        expect(count).toBeGreaterThanOrEqual(300);
      });

      test("case study links home (breadcrumb)", async () => {
        const homeLinks = await page.$$('a[href="/"]');
        expect(homeLinks.length).toBeGreaterThanOrEqual(1);
      });

      test("case study links to its GitHub repository", async () => {
        const githubHrefs = await page.$$eval(
          `a[href="${pg.project!.github}"]`,
          (els) => els.map((el) => (el as HTMLAnchorElement).href)
        );
        expect(githubHrefs.length).toBeGreaterThanOrEqual(1);
      });

      test("case study has previous and next project links", async () => {
        // ProjectPager renders two <a> elements with /projects/ hrefs
        const projectLinks = await page.$$eval(
          'a[href^="/projects/"]',
          (els) => els.map((el) => (el as HTMLAnchorElement).href)
        );
        // At least 2 navigation links (prev + next)
        expect(projectLinks.length).toBeGreaterThanOrEqual(2);
      });

      test("case study JSON-LD: SoftwareSourceCode has required properties", async () => {
        const blocks = await getJsonLd(page);
        const ssc = blocks.find((b: any) => b["@type"] === "SoftwareSourceCode") as any;
        expect(ssc).toBeDefined();
        expect(ssc?.name).toBeTruthy();
        expect(ssc?.description).toBeTruthy();
        expect(ssc?.codeRepository).toBeTruthy();
        expect(ssc?.programmingLanguage).toBeTruthy();
        expect(ssc?.author?.name).toBe(site.name);
      });

      test("case study JSON-LD: BreadcrumbList present", async () => {
        const blocks = await getJsonLd(page);
        const breadcrumb = blocks.find((b: any) => b["@type"] === "BreadcrumbList") as any;
        expect(breadcrumb).toBeDefined();
        const items = breadcrumb?.itemListElement ?? [];
        expect(items.length).toBeGreaterThanOrEqual(3);
      });
    }
  });
}

// ── Global: sitemap.xml ───────────────────────────────────────────────────────

test.describe("sitemap.xml", () => {
  test("lists exactly 6 URLs", async ({ request }) => {
    const resp = await request.get(`${BASE}/sitemap.xml`);
    expect(resp.ok()).toBe(true);
    const body = await resp.text();
    const matches = body.match(/<loc>/g) ?? [];
    expect(matches).toHaveLength(6);
  });
});

// ── Global: robots.txt ───────────────────────────────────────────────────────

test.describe("robots.txt", () => {
  test("allows all user agents and names the sitemap", async ({ request }) => {
    const resp = await request.get(`${BASE}/robots.txt`);
    expect(resp.ok()).toBe(true);
    const body = await resp.text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("sitemap.xml");
  });
});
