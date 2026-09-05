# Tasks — Faisal Nasir portfolio website

Execute in order. Each task names the requirements it satisfies (`requirements.md`) and the design sections it follows (`design.md`). A task is done only when its "Done when" line is true and CI is green. Sizes: S ≈ under an hour, M ≈ a few hours, L ≈ a day.

**Ship order.** Phases 0–2 plus 3.1 (hero) and 3.2 with only the Order-Saga screen give a launchable first version. Phase 5 (SEO) must be complete before the first production deploy; 6.5 happens on launch day. The other four screens can ship one at a time after that.

---

## Phase 0 — Foundation

- [ ] **0.1 Create the project** (S) — R18.1, R14.4
  Next.js with App Router and TypeScript `strict`; Tailwind; ESLint; Prettier; `output: "export"` and `trailingSlash: false` in `next.config`. Read `NEXT_PUBLIC_SITE_URL` at build and fail with a clear message if it is unset. Pin all dependencies to current stable releases.
  Done when: `npm run build` produces `out/` with a placeholder home page, fails without the site URL, and `npm run lint` passes.

- [ ] **0.2 Add dependencies** (S) — R3, R12, R13, R18
  `motion`; Vitest + Testing Library + jsdom; Playwright; `@axe-core/playwright`; `@lhci/cli`; a bundle-size checker.
  Done when: each tool runs with an empty test and exits 0.

- [ ] **0.3 Tokens and global styles** (S) — design §2
  `styles/tokens.css` with every color, type, space, radius, and motion token from §2 as CSS custom properties; `globals.css` with the type roles (name, h2, h3, body, caption, identifier), measure limit, focus ring styles, `scroll-margin-top`, and the reduced-motion media query that collapses motion tokens.
  Done when: a scratch page shows every type role and a 14:1 ink-on-vellum swatch, and the reduced-motion query is visible in the built CSS.

- [ ] **0.4 Fonts** (S) — R13.3, R13.4, design §2.2
  `next/font/google` for IBM Plex Mono (Regular, Italic) and IBM Plex Sans (Regular, Medium), Latin subset, `display: swap`, `adjustFontFallback`. Wire IBM Plex Sans Arabic and Hebrew behind a flag that is false while the name placeholders remain.
  Done when: first load requests four font files and Lighthouse reports no font-related layout shift.

- [ ] **0.5 Content files** (S) — R15.1, design §9
  Create `src/content/site.ts`, `projects.ts`, `experience.ts`, `skills.ts`, `seo.ts` with the exact strings from design §9. No other file may contain a factual string.
  Done when: `grep -R "Ben-Gurion" src/components src/lib` returns nothing.

- [ ] **0.6 Content check script** (S) — R15.2, R15.3, R9.3
  `scripts/content-check.ts`: fail on any `TODO_` in `src/content` when `NODE_ENV=production`; fail if the project slug set is not exactly the five; warn if `public/resume.pdf` is missing. Run it from `prebuild`.
  Done when: a production build fails with the placeholder set and passes on a branch where placeholders are temporarily replaced with dummy values; the resume warning prints.

- [ ] **0.7 App shell** (M) — R10, R12.3
  `layout.tsx` with landmarks, `SkipLink`, `Nav` (sticky, section underline via IntersectionObserver, "Menu"/"Close" below 768), `Footer`, `not-found.tsx`; `<html lang="en">`. Page metadata is Phase 5.
  Done when: axe reports zero serious/critical issues on the shell; keyboard reaches every nav link; the skip link is first in tab order; an unknown path serves `404.html`.

---

## Phase 1 — Screen engine

Build this before any project screen. Everything in Phase 2 reuses it.

- [ ] **1.1 Types and schema** (S) — design §6.1
  `screens/engine/types.ts` exactly as specified: `Scene`, `SceneNode`, `SceneEdge`, `Step`, `Scenario`.
  Done when: the file type-checks and a sample scene/scenario literal compiles.

- [ ] **1.2 Scene, Node, Edge, Bus** (M) — design §6.3, §6.4
  `Scene` renders the SVG with the 8px grid; `Node` with label and optional `StatusChip`; `Edge` as a path whose length is measured once on mount; `Bus` as a band with a label; `via` routing through a bus (edge path = from → bus entry → bus exit → to).
  Done when: a dev-only route `/dev/engine` renders a scene with six nodes, a bus, and routed edges at 720 × 400 and at the narrow viewBox.

- [ ] **1.3 Scheduler** (M) — R4.3, R4.4, R4.7, R3.5, design §6.2
  `useScenario(scenarios, { autoplay })` with one rAF loop, `play/pause/reset`, elapsed-time mapping to steps, per-node status state, per-target `set` values, `say` events, packet queue capped at 6, `useInView` (0.5) for autoplay-once and pause, `usePageVisible` for tab-hide pause, reduced-motion stepping with 150 ms crossfade and a per-screen "Play with motion" override.
  Done when: unit tests cover step ordering, pause/resume math, queue overflow, autoplay-once, and reduced-motion stepping; all pass.

- [ ] **1.4 Packet** (M) — R4.10, design §6.2, §6.3
  `Packet` moves along its edge with `getPointAtLength`, label above in identifier style, two-ghost trail, `signal`/`fault` tones; trails off and cap 3 on slow devices.
  Done when: six packets run on `/dev/engine` at 60 fps in Chrome's performance panel with no layout work per frame.

- [ ] **1.5 StatusChip, Gauge, Terminal** (S) — design §6.3
  Chip tone transitions in 300 ms; gauge with threshold tick and fault tone below it; terminal that streams words at a given rate and flicks side lines (`event: token`).
  Done when: each primitive has a component test for its states.

- [ ] **1.6 Screen chrome, controls, text alternative, boundary** (M) — R4.4–R4.6, R4.8, R14.16, design §6.3, §6.5
  `Screen` (6px radius, title strip, controls row ≥ 44 px on touch, "Show as text"), `ScreenControls`, `ScreenText` (polite `aria-live`, ordered narration rendered in the static HTML), `ScreenBoundary` (static end-state fallback + narration).
  Done when: throwing inside a test screen renders the fallback and the page still scrolls; screen readers announce `say` steps (verify with VoiceOver or NVDA once); the narration list is present in `out/*.html`.

- [ ] **1.7 Server-rendered first frame** (S) — R13, R14.1, design §8
  Ensure each screen's initial frame renders at build time in the static export, with controls hidden and the "Turn on JavaScript to run the scenarios" note when JS is off.
  Done when: `out/index.html` contains the SVG of the dev scene and the page is readable with JavaScript disabled.

---

## Phase 2 — The five screens

Each screen: `scene.ts` (wide + narrow), `scenarios.ts`, the component, unit tests for scenario step lists, Playwright coverage of each control changing the expected chip text, and wide/narrow screenshots. Every node, edge, label, and value must trace to the README; keep a comment with the README section it came from.

- [ ] **2.1 Order-Saga** (L) — R4.11–R4.14, design §7.1
  Nodes, bus, registry marker, status timeline strip, processed counters; scenarios "Place order", "Fail payment", "Out of stock" with the exact step tables in §7.1.
  Done when: "Fail payment" shows the inventory release before `FAILED`; all three scenarios pass their e2e assertions; wide and narrow screenshots approved.

- [ ] **2.2 rag-document-qa** (L) — R4.15–R4.18, design §7.2
  Ingestion lane with the three-strategy pills, chunk split, embedding dots into the vector panel, store; query lane with question pill, nearest-five highlight, prompt box, streaming terminal, source chips, confidence with the "example from the README" caption. Scenarios "Ingest a document", "Ingest a scanned page", "Ask a question".
  Done when: the scanned-page scenario visibly falls through to Tesseract; the answer streams and two source chips appear; e2e and screenshots pass.

- [ ] **2.3 tech-news-agent** (L) — R4.19–R4.21, design §7.3
  Orchestrator ring, five agents, two tools, gauge with the 0.6 tick, output card with markers. Scenarios "Run pipeline", "Force a retry" (first pass labeled illustrative).
  Done when: the retry scenario shows the fault packet back to Reporter and a second pass; e2e and screenshots pass.

- [ ] **2.4 Emergency-Alert-System** (L) — R4.22–R4.24, design §7.4
  Server with `tpc`/`reactor` internals and `morph` layouts, three clients, channel label; scenarios "Connect clients", "Broadcast an alert"; mode toggle with `aria-pressed` and narration.
  Done when: broadcasting sends `MESSAGE` to A and B and `RECEIPT` to C only; the morph animates in 600 ms and is instant under reduced motion; e2e and screenshots pass.

- [ ] **2.5 con-Detection** (M) — R4.25–R4.27, design §7.5
  Vector road scene, three cones, frame counter, tracking bracket boxes labeled `cone`, pipeline strip, one-cycle autoplay then stop, "Play"/"Pause".
  Done when: no numeric confidence is rendered anywhere in the screen; the caption is present; e2e and screenshots pass.

- [ ] **2.6 Cross-screen review** (S) — R3, R4.2, R4.9
  Walk every screen against its README once more; remove any node, label, or number that is not in the README; confirm every example value carries its label.
  Done when: a written checklist per screen is committed under `docs/readme-trace.md` with a line per element and its README source.

---

## Phase 3 — Sections

- [ ] **3.1 Hero** (L) — R1, R2, design §5.1
  `Name` with hidden-while-placeholder Arabic/Hebrew spans (`lang`, `dir`); role, location, languages from `site.ts`; tagline slot; three controls. `HeroAscii` (`<pre>`, `aria-hidden`) and `HeroScreen` (SVG map, nodes as buttons that scroll and move focus, ambient packet every ~2.5 s carrying a real identifier). The moment: 200 ms hold, ASCII 200–900 ms, crossfade and edge draw 900–1400 ms, `sessionStorage` flag, skipped under reduced motion and on non-home routes.
  Done when: the sequence finishes by 1.4 s in a Playwright timing assertion; a reload in the same session does not replay; reduced-motion emulation renders the map immediately; hero text is selectable.

- [ ] **3.2 Project sections** (M) — R4.1, R11.2, R14.18, design §5.2
  `ProjectSection` for each project: h3, locked summary, "Stack" comma list, "View on GitHub", "Read the {repo name} case study", the screen via `next/dynamic` with a server-rendered first frame; sticky screen at ≥ 1024 px; intro sentence under the "Projects" heading.
  Done when: scrolling the home page loads each screen's chunk only as its section approaches (verify in the network panel); the order is Order-Saga, rag-document-qa, tech-news-agent, Emergency-Alert-System, con-Detection; every case-study link's anchor text contains the repository name.

- [ ] **3.3 Case-study pages** (M) — R5, R14.19, design §5.3
  `app/projects/[slug]/page.tsx` with `generateStaticParams`; `Breadcrumb`; screen with `layoutId`; "What it does", "How it works", "Design decisions", "Stack" table, "Source"; `ProjectPager` with previous and next project by name (wrapping). Shared-element transition; crossfade under reduced motion. Prose quality and length are finished in 5.4.
  Done when: all five routes exist in `out/`; back/forward works; deep links render without the hero sequence; previous/next cycle through all five.

- [ ] **3.4 About and experience** (S) — R6, design §5.4
  Two columns; three paragraphs from `about`; two-entry log with the date column omitted while `period === "TODO_DATES"`.
  Done when: a component test proves the date column is absent with placeholders and present with a value.

- [ ] **3.5 Skills** (M) — R7, design §5.5, §9.4
  Grouped inline lists; hover/focus dimming; caption "Used in …" from `skillsIndex`; coursework and language items labeled instead; items are focusable buttons.
  Done when: unit tests show "Spring Cloud (Eureka, Gateway, OpenFeign)" maps to Order-Saga and "Apache Kafka" maps to Order-Saga; no bars or percentages exist in the DOM.

- [ ] **3.6 Community** (S) — R8, design §5.6
  Done when: the block renders the role and the three activities and nothing else.

- [ ] **3.7 Contact** (S) — R9, design §5.7
  Large mono email as `mailto:`, `CopyButton` with "Copied" for 2 s and an announcement, GitHub and LinkedIn with `rel="noopener"`, resume button hidden when the file is missing.
  Done when: the copy test passes and a missing resume hides every resume control on the page.

- [ ] **3.8 Footer and 404** (S) — design §5.8
  Done when: both render with correct landmarks and no extra copy.

---

## Phase 4 — Quality

- [ ] **4.1 Accessibility pass** (M) — R12
  Keyboard-only traversal of the whole site including every screen control and the mode toggle; focus visible everywhere; heading outline; axe in Playwright on `/` and one case study; manual screen-reader pass of one screen's narration.
  Done when: zero serious/critical axe violations and the manual checklist is signed off in the PR.

- [ ] **4.2 Reduced-motion pass** (S) — R2.3, R3.5, R4
  Playwright with `reducedMotion: "reduce"` on every route: no hero sequence, no ambient packets, scenarios step through states, "Play with motion" opts in per screen.
  Done when: screenshots under reduced motion match the wide end-state screenshots from Phase 2.

- [ ] **4.3 Performance pass** (M) — R13
  Lighthouse CI mobile thresholds (≥ 90 on all four); LCP, INP, CLS budgets; first-load JS ≤ 180 KB gz; each screen chunk ≤ 60 KB gz; one rAF loop per visible screen only.
  Done when: CI enforces the thresholds and the bundle assertion, and both pass on `main`.

- [ ] **4.4 Responsive pass** (S) — R11
  Check 360, 390, 768, 1024, 1440 widths: no horizontal overflow, narrow scenes, scrollable control rows, ≥ 44 px targets, measure ≤ 70 ch.
  Done when: a Playwright test asserts `document.documentElement.scrollWidth <= innerWidth` at each width.

- [ ] **4.5 Cross-browser** (S) — R11, R12
  Chrome, Firefox, Safari (macOS and iOS): SVG `getPointAtLength`, sticky screens, font rendering, `aria-live`.
  Done when: no browser-specific defects remain open.

---

## Phase 5 — SEO and discoverability

Complete before the first production deploy. Every string used here comes from `content/seo.ts`, `site.ts`, and `projects.ts`; nothing is written inside components.

- [ ] **5.1 Canonical host and indexing controls** (S) — R14.2–R14.7, design §13.1
  `lib/seo.ts` with `absoluteUrl(path)` from `NEXT_PUBLIC_SITE_URL`; `vercel.json` 301s for `www`/apex and for the host's default production URL once a custom domain exists; `robots.ts` (allow all, sitemap URL); `sitemap.ts` (six URLs, `lastmod` at build); `<meta name="robots" content="index, follow, max-image-preview:large">`; confirm previews carry `X-Robots-Tag: noindex`.
  Done when: `out/robots.txt` names the sitemap, `out/sitemap.xml` lists six absolute URLs on the configured host, and a preview URL returns the `noindex` header while the production build's HTML contains none.

- [ ] **5.2 Per-page metadata** (S) — R14.8–R14.10, design §9.5, §13.2
  `lib/seo.ts` builds the `Metadata` object for the home page and each case study from `seo.ts`: title (suffix appended on case studies), description, canonical, Open Graph, Twitter card. One `h1` per page containing the primary term.
  Done when: each of the six pages has a unique title within the length rule, a unique 120–160 character description, and a canonical equal to `absoluteUrl(path)`.

- [ ] **5.3 Structured data** (M) — R14.11–R14.14, design §13.3
  JSON-LD builders in `lib/seo.ts`: `ProfilePage` with `Person` (`sameAs`, `affiliation`, `knowsLanguage`, `alternateName` only when the name placeholders are gone) and `WebSite` on the home page; `SoftwareSourceCode` and `BreadcrumbList` on each case study. A unit test asserts each block's required properties and that no property outside the allowed set appears.
  Done when: all blocks parse in the unit test and the owner has pasted the home page and one case study into Google's Rich Results Test with no errors.

- [ ] **5.4 Case-study prose** (L) — R14.15–R14.17, design §13.4
  Write "What it does", "How it works", and "Design decisions" for each of the five pages as case studies: at least 300 words, paraphrased from the README with its structure changed, headings that name the real concept (§13.4 examples), no copied code blocks. Every claim traces to the README; add each page to `docs/readme-trace.md`.
  Done when: a test counts ≥ 300 words in `main` outside the screens on every case-study page, and a reviewer confirms no paragraph is a copy of README text.

- [ ] **5.5 Internal linking** (S) — R14.18–R14.19, design §13.5
  Verify home links each case study with the repository name in the anchor; each case study has breadcrumb, GitHub link, and previous/next by name; footer links home; no `nofollow`.
  Done when: a test walks the six pages and asserts every required link and anchor text is present.

- [ ] **5.6 Share images** (M) — R14.21, design §13.6
  `app/opengraph-image.tsx` (name plus static hero map) and `app/projects/[slug]/opengraph-image.tsx` with `generateStaticParams` (repository name plus the screen's default end state); 1200 × 630, under 300 KB, no text under 40 px. If the static export cannot render image routes, implement `scripts/og.ts` (satori + resvg) writing `public/og/*.png` and point metadata at those files.
  Done when: six PNGs exist in `out/`, each 1200 × 630 and under 300 KB, and every page's `og:image` resolves to its own image.

- [ ] **5.7 SEO test suite in CI** (M) — R14.6, R14.8–R14.13, R14.20, R18.2, design §13.8
  `tests/seo/` Playwright spec over `out/` covering: one `h1`, one title, one description, one canonical per page; uniqueness and lengths; no `noindex` in production; JSON-LD parses with required properties and both `sameAs` URLs; all `og:*` and `twitter:card` tags present with images that resolve; sitemap has six URLs and robots names it; ≥ 300 words and required links on each case study. Wire into the pull-request workflow.
  Done when: the suite passes on `main`, and deliberately breaking a canonical, a description length, or a JSON-LD property fails it.

---

## Phase 6 — Content and launch

- [ ] **6.1 Collect Faisal's inputs** (S) — requirements §5
  Tagline (or a decision to omit it permanently), name in Arabic and Hebrew, role dates, `public/resume.pdf`, domain choice, `NEXT_PUBLIC_SITE_URL`. Replace placeholders; enable the Arabic/Hebrew fonts and the `alternateName` values; re-run the content check.
  Done when: a production build passes the content check with no placeholders.

- [ ] **6.2 Final copy review against PRD v2** (S) — R15, R14.28
  Read every string in `src/content` (including `seo.ts`), every screen caption, and every JSON-LD value against the PRD and the READMEs. Remove anything that is not there.
  Done when: the reviewer signs the `docs/readme-trace.md` checklist and the PRD diff is empty.

- [ ] **6.3 CI/CD and hosting** (M) — R18
  GitHub Actions: install, lint, type-check, unit, production build (content check), Playwright, SEO suite, Lighthouse CI, bundle size; Vercel preview per PR and production on `main`; custom domain, redirects from 5.1, and HTTPS.
  Done when: a PR shows a preview URL and a merge deploys production automatically; `www` and the host's default URL 301 to the canonical host.

- [ ] **6.4 Launch checklist** (S)
  Favicon, 404, resume link, GitHub profile link back to the site, a final read on a phone in daylight.
  Done when: every item is ticked in the launch PR.

- [ ] **6.5 Launch day: Search Console and the name results page** (S) — R14.22–R14.25, design §13.7
  Verify the site in Google Search Console; submit the sitemap; request indexing for the six URLs. Set the website field on the LinkedIn profile and the GitHub profile to the canonical URL and confirm the display name reads "Faisal Nasir" on all three. Run LinkedIn's Post Inspector on the home page and one case study. If Hasoub has a public page listing community managers, ask for a link.
  Done when: Search Console shows the sitemap as processed, both profile links resolve to the site, and both previews render the intended image and text.

- [ ] **6.6 Thirty-day review** (S) — R14.26, design §13.9
  In Search Console: position, impressions, and clicks for "Faisal Nasir" and for each repository name; Page indexing coverage; the Core Web Vitals report. Open a task for each finding; repeat monthly.
  Done when: the first review is written up as an issue with one line per finding.

---

## Phase 7 — Later (P2)

- [ ] **7.1 Dark page theme** — R16: page tokens only; screens unchanged; no theme flash.
- [ ] **7.2 Analytics** — R17: cookieless provider; page views, resume downloads, GitHub clicks, scenario plays.
- [ ] **7.3 Hebrew and Arabic versions** — full localization with RTL layouts and `hreflang` (R14.29); a separate design pass.
- [ ] **7.4 Open-source the site repository** — a sixth showcase; add "Source on GitHub" to the footer.
- [ ] **7.5 New projects** — when a new public repository with a README exists, add one content entry, one `seo.ts` entry, one share image, and one screen; the content check will refuse anything else.
