# Requirements — Faisal Nasir portfolio website

**Source of truth for facts:** `faisal-nasir-portfolio-website-prd.md` (PRD v2). This document specifies *behavior*. It introduces no new facts about Faisal. Where a fact is missing (tagline, dates, name in Arabic/Hebrew, resume, domain), the site carries a `TODO_*` placeholder that blocks a production build.

---

## 1. Introduction

A single-page-plus-detail-routes portfolio whose job is to get a recruiter or hiring manager at an Israeli tech company from "opened a cold link" to "this person builds real systems" in under a minute.

The differentiating idea: the site does not *describe* the five GitHub projects, it *runs* them. Each project is shown as a small animated system, faithful to the architecture in its own README, that the visitor can drive (place an order, fail a payment, ask a question, broadcast an alert). Everything around those five screens is quiet, typographic, and fast.

Priorities: **P0** = launch blocker, **P1** = ship in the first month, **P2** = later.

---

## 2. Definitions

| Term | Meaning |
|---|---|
| Screen | The dark instrument panel that holds one project's animated diagram |
| Scenario | A scripted sequence of diagram steps (e.g. "payment failure") |
| Packet | A moving marker that represents one message or event on an edge |
| Locked content | Strings that must match PRD v2 §5 exactly |
| Placeholder | A `TODO_*` token that must be replaced before production |
| Documented value | A number that appears verbatim in a project README (e.g. `chunkSize=500`) |
| Reduced motion | The OS/browser `prefers-reduced-motion: reduce` setting |

The five projects, by slug: `rag-document-qa`, `order-saga`, `tech-news-agent`, `emergency-alert-system`, `con-detection`. No others.

---

## 3. Requirements

### R1 — First impression (P0)

**User story:** As a recruiter opening the link cold on a phone or laptop, I want to know who this is and what he builds within five seconds, so I decide to keep scrolling.

**Acceptance criteria**
1. WHEN the page loads, THE SYSTEM SHALL render the name, the factual role line from PRD §5.1, and the primary actions (See the projects, GitHub, Download resume) above the fold on any viewport ≥ 360 px wide.
2. THE SYSTEM SHALL render all hero text as real DOM text (selectable, indexable), never as canvas or image.
3. THE SYSTEM SHALL show the name in Latin script and, beside or below it, in Arabic and Hebrew script, with `lang` and `dir="rtl"` attributes on those spans.
4. WHILE the Arabic or Hebrew spellings are placeholders (`TODO_NAME_AR`, `TODO_NAME_HE`), THE SYSTEM SHALL hide those spans rather than render the placeholder text.
5. WHILE the tagline is a placeholder (`TODO_TAGLINE`), THE SYSTEM SHALL hide the tagline slot rather than render it.

### R2 — Hero moment (P0)

**User story:** As a visitor, I want one memorable opening that tells me this is an engineer's site, so it stands apart from template portfolios.

**Acceptance criteria**
1. WHEN the page first loads with motion enabled, THE SYSTEM SHALL play exactly one orchestrated sequence: the hero screen renders as monospaced box-drawing text (the "README" state) and resolves into its vector diagram (the "running" state).
2. THE SYSTEM SHALL complete the sequence within 1.6 s of first paint and SHALL NOT replay it on scroll, focus, or route change within the same session.
3. WHEN reduced motion is enabled, THE SYSTEM SHALL render the "running" state immediately with no sequence.
4. THE SYSTEM SHALL keep the hero screen's ambient packets slow (one packet in flight at a time, ≤ 1 launch per 2.5 s), pause them when the tab is hidden or the screen leaves the viewport, and disable them under reduced motion.
5. WHEN a hero-screen node is activated (click, tap, Enter, Space), THE SYSTEM SHALL scroll to that project's section and move focus to its heading.

### R3 — Motion policy (P0)

**User story:** As a visitor, I want motion only where it shows me something, so the site feels precise rather than busy.

**Acceptance criteria**
1. THE SYSTEM SHALL NOT apply entrance animations (fade, slide, scale) to sections, headings, paragraphs, lists, tags, or cards.
2. THE SYSTEM SHALL limit non-user-triggered motion to three things: the hero moment (R2.1), the hero screen's ambient packets (R2.4), and each project screen's single autoplay (R4.3).
3. THE SYSTEM SHALL limit hover and focus feedback to color, underline, and border changes of ≤ 150 ms; no scale, lift, tilt, glow, or parallax.
4. THE SYSTEM SHALL animate only `transform` and `opacity` on page-level elements; inside screens, SVG attribute animation is allowed.
5. WHEN reduced motion is enabled, THE SYSTEM SHALL step user-triggered scenarios through their states instantly (crossfade ≤ 150 ms, no packet travel) and offer a "Play with motion" control that opts in for that screen only.
6. THE SYSTEM SHALL NOT include typewriter effects, blinking cursors, particle fields, cursor-following elements, background video, or infinite loops outside the hero screen.

### R4 — Project screens (P0)

**User story:** As a hiring manager, I want to see how each project actually works, not just read a stack list, so I can judge depth.

**Acceptance criteria — common to all five**
1. THE SYSTEM SHALL present exactly the five projects in §2, each with: title, summary (locked to PRD §5.4), stack list (locked), GitHub link, "Read the case study" link (R5), and one screen.
2. THE SYSTEM SHALL build every screen's structure (nodes, edges, labels, state names) only from that project's README; no node, topic, frame, or state that the README does not name.
3. WHEN a screen first becomes ≥ 50 % visible, THE SYSTEM SHALL autoplay its default scenario once, then rest at the final state. THE SYSTEM SHALL NOT loop.
4. WHEN a scenario control is activated, THE SYSTEM SHALL reset the screen and play that scenario; controls SHALL be real `<button>` elements, keyboard operable, with visible focus.
5. WHILE a scenario plays, THE SYSTEM SHALL announce step changes through a polite `aria-live` region ("Payment failure, step 3 of 5: inventory released").
6. THE SYSTEM SHALL provide, per screen, a text alternative: an `aria-label` summarizing the system and a "Show as text" control that reveals the scenario as an ordered list.
7. THE SYSTEM SHALL pause any running scenario when the screen leaves the viewport or the document is hidden, and resume or reset on return.
8. IF a screen throws at runtime, THEN THE SYSTEM SHALL render a static SVG of the final state plus the text alternative, and the rest of the page SHALL be unaffected.
9. THE SYSTEM SHALL show documented values (ports, token sizes, confidence figures, timings) only where the README states them, and SHALL label README example outputs as "example from the README" in the UI.
10. THE SYSTEM SHALL keep each screen's lazy-loaded chunk ≤ 60 KB gzipped and cap concurrent packets at 6.

**Acceptance criteria — Order-Saga**
11. THE SYSTEM SHALL model: Gateway, Order, Inventory, Payment, Shipping, Notification, and a Kafka bus; Eureka may appear as a registry marker.
12. THE SYSTEM SHALL offer scenarios "Place order" (default), "Fail payment", and "Out of stock".
13. THE SYSTEM SHALL move packets labeled with the README's topics (`order.created`, `inventory.reserved`, `inventory.failed`, `payment.succeeded`, `payment.failed`, `shipment.created`) and update the Order status chip through the README's states (`PENDING`, `INVENTORY_RESERVED`, `PAYMENT_PROCESSING`, `COMPLETED`, `FAILED`, `COMPENSATING`).
14. WHEN "Fail payment" runs, THE SYSTEM SHALL visibly release reserved inventory (compensation) before Order reaches `FAILED`.

**Acceptance criteria — rag-document-qa**
15. THE SYSTEM SHALL model two flows: ingestion (upload → extract → chunk → embed → store) and query (question → embed → nearest chunks → prompt → streamed answer → sources).
16. THE SYSTEM SHALL show the three-strategy extraction waterfall (PDFBox, Tesseract, GPT-4o Vision) and demonstrate a fall-through on a scanned page.
17. THE SYSTEM SHALL show chunking with the documented defaults (500 tokens, 50 overlap) and retrieval with the documented default top-k of 5.
18. THE SYSTEM SHALL stream the answer token by token and then append source chips with page numbers; the confidence readout SHALL be labeled as an example from the README.

**Acceptance criteria — tech-news-agent**
19. THE SYSTEM SHALL model the OrchestratorAgent's ReAct loop and the five agents (Scout, Reporter, Editor, FactChecker, LinkedInWriter) plus the two tools (Tavily, GitHub MCP).
20. THE SYSTEM SHALL offer scenarios "Run pipeline" (default) and "Force a retry", where the second drives the fact-check confidence below 0.6 and shows the loop back to fact extraction.
21. THE SYSTEM SHALL end with a post card carrying the README's `[HIGH]`, `[MEDIUM]`, `[UNVERIFIED]` markers.

**Acceptance criteria — Emergency-Alert-System**
22. THE SYSTEM SHALL model one server, a channel, and at least three clients, with a mode switch between `tpc` (thread-per-client) and `reactor`.
23. WHEN the mode switches, THE SYSTEM SHALL morph the server's internal structure (one lane per client vs. one selector loop with a small thread pool).
24. THE SYSTEM SHALL label packets with the README's STOMP frames (`CONNECT`, `CONNECTED`, `SUBSCRIBE`, `SEND`, `MESSAGE`, `RECEIPT`, `UNSUBSCRIBE`, `DISCONNECT`, `ERROR`) and demonstrate a broadcast fanning out to subscribers only.

**Acceptance criteria — con-Detection**
25. THE SYSTEM SHALL render a stylized vector road scene (no real footage) with a ticking frame counter and bounding boxes that appear and track cone shapes across frames.
26. THE SYSTEM SHALL show the pipeline `video → frame → YOLOv5 → boxes` with the active stage highlighted.
27. THE SYSTEM SHALL caption the screen as an illustration of the detection loop, and SHALL NOT display numeric confidence values (none are documented).

### R5 — Project detail pages (P1)

**User story:** As an interested reviewer, I want to go deeper on one project without leaving the site.

**Acceptance criteria**
1. THE SYSTEM SHALL expose `/projects/{slug}` for each of the five slugs, statically generated.
2. Each page SHALL contain: the screen, the summary, a "How it works" section and "Design decisions" list drawn only from the README, the full stack table, and the GitHub link.
3. WHEN navigating between a project section and its page, THE SYSTEM SHALL animate the screen as a shared element; under reduced motion it SHALL crossfade.
4. THE SYSTEM SHALL support browser back/forward and direct deep links.

### R6 — About and experience (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL render only the facts in PRD §5.2 and §5.3 (TA role, Hasoub role, coursework, self-directed learning).
2. THE SYSTEM SHALL render the two roles as a chronological log; WHILE dates are `TODO_DATES`, THE SYSTEM SHALL omit the date column entirely rather than show placeholders.
3. THE SYSTEM SHALL NOT render any employer, internship, or role not in PRD v2.

### R7 — Skills map (P0)

**User story:** As a recruiter scanning for keywords, I want a scannable skills list that I can trust.

**Acceptance criteria**
1. THE SYSTEM SHALL render the groups and items in PRD §5.5, and only those.
2. THE SYSTEM SHALL NOT render proficiency bars, percentages, years, or star ratings.
3. WHEN a skill is hovered or focused, THE SYSTEM SHALL highlight the projects whose stack includes it, computed from the project data (not hand-maintained); skills with no project SHALL show their group (coursework, language) instead.

### R8 — Community (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL render the Hasoub role and its three stated activities (talks, industry events, a hackathon) with no attendance figures, dates, or partner names.

### R9 — Contact and resume (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL provide the email `nasirfaisal83@gmail.com` as a `mailto:` link and a "Copy email" button that confirms with "Copied" for 2 s.
2. THE SYSTEM SHALL link to `https://github.com/nasirfaisal83` and `https://www.linkedin.com/in/faisal-nasir-381a33131`, opening in a new tab with `rel="noopener"`.
3. THE SYSTEM SHALL serve the resume at `/resume.pdf`; WHILE the file is absent, THE SYSTEM SHALL hide every "Download resume" control and log a build warning.

### R10 — Navigation (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL provide a sticky top navigation with links to Projects, About, Skills, Community, Contact, and GitHub.
2. THE SYSTEM SHALL indicate the section currently in view with an underline, and SHALL respect `scroll-margin-top` so headings are not hidden under the bar.
3. THE SYSTEM SHALL provide a skip link as the first focusable element.

### R11 — Responsive (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL be fully usable from 360 px to 1920 px wide without horizontal scrolling.
2. THE SYSTEM SHALL switch each screen to its narrow layout below 768 px, with controls in a horizontally scrollable row.
3. THE SYSTEM SHALL keep all interactive targets ≥ 44 × 44 px on touch devices.
4. THE SYSTEM SHALL keep text measure ≤ 70 characters per line at every width.

### R12 — Accessibility (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL meet WCAG 2.2 AA: text contrast ≥ 4.5:1, large text and UI ≥ 3:1, focus indicators ≥ 3:1 against adjacent colors.
2. THE SYSTEM SHALL be fully operable by keyboard, including every screen control, in a logical order, with no traps.
3. THE SYSTEM SHALL use landmarks (`header`, `nav`, `main`, `footer`), one `h1`, and a strict heading hierarchy.
4. THE SYSTEM SHALL never convey state by color alone; every status chip carries its text.
5. THE SYSTEM SHALL NOT flash any element more than 3 times per second.
6. THE SYSTEM SHALL pass an automated axe scan with zero violations of impact "serious" or "critical".

### R13 — Performance (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL score ≥ 90 on Lighthouse mobile for Performance, Accessibility, Best Practices, and SEO in CI.
2. THE SYSTEM SHALL achieve LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on a simulated mid-range phone.
3. THE SYSTEM SHALL ship ≤ 180 KB gzipped JavaScript on first load, lazy-load each screen as its section approaches, and load ≤ 4 subsetted font files initially.
4. THE SYSTEM SHALL cause no layout shift from font loading (size-adjusted fallbacks).

### R14 — SEO and discoverability (P0)

**User story:** As a recruiter who searches his name after seeing a resume or a LinkedIn message, I want his site to be the first result; and when a link to one of his projects is shared on LinkedIn, I want it to look right.

SEO has three jobs here, in order: own the results page for "Faisal Nasir" together with LinkedIn and GitHub; make each project page findable by its repository name and by the technical terms in its README; make every shared link render a correct preview. It is not about traffic volume.

**Acceptance criteria — crawling and indexing**
1. THE SYSTEM SHALL serve every page as static HTML that contains all text content (summaries, case-study prose, screen narrations) without requiring JavaScript.
2. THE SYSTEM SHALL serve `robots.txt` that allows all user agents on all paths and names the sitemap URL.
3. THE SYSTEM SHALL emit `sitemap.xml` listing the home page and the five case-study pages, with `lastmod` set at build time.
4. THE SYSTEM SHALL set a self-referencing canonical URL on every page derived from one configured site URL (`NEXT_PUBLIC_SITE_URL`), and SHALL 301-redirect the host's default URL and the `www`/non-`www` variant to that single canonical host.
5. THE SYSTEM SHALL return HTTP 404 (not 200) for unknown paths.
6. WHEN a preview deployment is built, THE SYSTEM SHALL carry `noindex` (header or meta) so previews never enter the index; WHEN the production build runs, CI SHALL fail if any production page carries `noindex`.
7. THE SYSTEM SHALL set `<html lang="en">`, keep `lang="ar"` and `lang="he"` on the name spans (R1.3), and set `<meta name="robots" content="index, follow, max-image-preview:large">`.

**Acceptance criteria — per-page metadata**
8. THE SYSTEM SHALL give every page a unique `<title>` built only from locked content, with the name first on the home page and the repository name first on case-study pages, and SHALL keep the part before any suffix within 60 characters.
9. THE SYSTEM SHALL give every page a unique meta description of 120–160 characters built only from locked content.
10. THE SYSTEM SHALL keep exactly one `h1` per page containing the page's primary term: the name on the home page, the repository name on a case-study page.

**Acceptance criteria — structured data**
11. The home page SHALL carry JSON-LD for `ProfilePage` whose `mainEntity` is a `Person` with `name`, `url`, `sameAs` (GitHub, LinkedIn), `affiliation` (Ben-Gurion University of the Negev), `knowsLanguage` (Arabic, Hebrew, English), and, once supplied, `alternateName` for the Arabic and Hebrew spellings; and JSON-LD for `WebSite` (`name`, `url`).
12. Each case-study page SHALL carry JSON-LD for `SoftwareSourceCode` (`name`, `description` = locked summary, `codeRepository` = GitHub URL, `programmingLanguage`, `author` = the Person) and for `BreadcrumbList` (Home, Projects, the repository name).
13. THE SYSTEM SHALL validate every JSON-LD block in CI (parses, required properties present) and the owner SHALL run Google's Rich Results Test once before launch.
14. THE SYSTEM SHALL NOT include any structured-data property whose value is not a fact in PRD v2 or a README (no `jobTitle`, no employer, no ratings, no dates that are still placeholders).

**Acceptance criteria — indexable content**
15. Each case-study page SHALL carry at least 300 words of prose across "What it does", "How it works", and "Design decisions", written as a case study and paraphrased from the README — not copied — so the page is neither thin nor a duplicate of the GitHub page.
16. Screen narrations (R4.6) SHALL be present in the static HTML, not injected on interaction.
17. Case-study headings SHALL name the real concepts in the README (for example, "What happens when a payment fails"), never generic labels ("Overview", "Details").

**Acceptance criteria — internal linking**
18. The home page SHALL link to all five case-study pages using the repository name as the anchor text; no "read more" or "click here".
19. Every case-study page SHALL link to the home page (breadcrumb), to its GitHub repository, and to the previous and next case-study pages by name.

**Acceptance criteria — sharing previews**
20. Every page SHALL carry Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:type`) and Twitter card tags (`summary_large_image`), with the same locked title and description as R14.8–9.
21. THE SYSTEM SHALL generate a 1200 × 630 share image at build time for the home page (name plus the static hero map) and for each case-study page (repository name plus that screen's static end state), each under 300 KB, with no text smaller than 40 px.
22. The owner SHALL check the home page and one case-study page in LinkedIn's Post Inspector before launch and after any metadata change (LinkedIn caches previews).

**Acceptance criteria — the name results page (owner actions, off-site)**
23. The LinkedIn profile's website field and the GitHub profile's website field SHALL link to the canonical site URL, and the display name on the site, LinkedIn, and GitHub SHALL match exactly.
24. The site SHALL be verified in Google Search Console and its sitemap submitted on launch day; indexing SHALL be requested for the home page and the five case-study pages.
25. IF Hasoub publishes a page that lists its community managers, THEN a link from that page to the site SHALL be requested.
26. WHEN the site has been live for 30 days, the owner SHALL review Search Console for the query "Faisal Nasir" (position, impressions, clicks), for each repository name, and for coverage or Core Web Vitals errors, and SHALL open a task for each finding.

**Acceptance criteria — limits**
27. THE SYSTEM SHALL NOT use hidden text, keyword-stuffed headings, generated filler pages, paid or exchanged links, or any page that exists only to rank.
28. All SEO copy (titles, descriptions, image text, structured data) is subject to R15: nothing beyond PRD v2 and the READMEs.
29. THE SYSTEM SHALL NOT emit `hreflang` until a localized version exists (Phase 7).

### R15 — Content integrity (P0)

**User story:** As Faisal, I want it to be impossible for the site to claim something I did not do.

**Acceptance criteria**
1. THE SYSTEM SHALL keep every factual string in `src/content/*`; components SHALL contain no factual copy.
2. WHEN building for production, THE SYSTEM SHALL fail if any `TODO_` token remains in `src/content/*`.
3. WHEN building, THE SYSTEM SHALL fail if the set of project slugs differs from the five in §2.
4. THE SYSTEM SHALL NOT display employer or target-company logos, testimonials, or client names.
5. THE SYSTEM SHALL NOT display any metric, count, or outcome that is not a documented value from a README or a fact in PRD v2.

### R16 — Theming (P2)

**Acceptance criteria**
1. THE SYSTEM SHALL ship the light page with dark screens as the only theme at launch.
2. IF a dark page variant is added later, THEN THE SYSTEM SHALL keep screens visually identical and SHALL NOT flash the wrong theme on load.

### R17 — Analytics (P2)

**Acceptance criteria**
1. IF analytics is enabled, THEN THE SYSTEM SHALL use a cookieless, privacy-respecting provider and SHALL track page views, resume downloads, GitHub clicks, and per-screen scenario plays only.

### R18 — Deployment and maintenance (P0)

**Acceptance criteria**
1. THE SYSTEM SHALL build to a fully static export with no server runtime.
2. WHEN a pull request opens, CI SHALL run lint, type-check, unit tests, end-to-end tests, the content check (R15), the SEO checks (R14.6, R14.8–R14.13, R14.20), and Lighthouse, and SHALL publish a preview URL.
3. WHEN `main` updates and CI passes, THE SYSTEM SHALL deploy automatically.
4. THE SYSTEM SHALL allow content edits (summaries, stack lists, dates) without touching component code.

---

## 4. Out of scope (v1)

- Blog, CMS, or comments
- Full Hebrew/Arabic localization (the trilingual name is the only non-English element)
- Contact form with a server; any backend
- Dark page theme (R16), analytics (R17)
- Any project that is not one of the five public repositories

---

## 5. Inputs still required from Faisal

Each is a placeholder that R15.2 blocks in production.

| Placeholder | What it needs |
|---|---|
| `TODO_TAGLINE` | One sentence under the name, in his words (or leave it out permanently) |
| `TODO_NAME_AR`, `TODO_NAME_HE` | His preferred spelling of his name in Arabic and Hebrew |
| `TODO_DATES` | Start dates (and end dates if any) for the TA role and the Hasoub role |
| `public/resume.pdf` | The general-purpose resume to link |
| Domain | Custom domain, or accept the host's default URL |
| `NEXT_PUBLIC_SITE_URL` | The canonical URL (the custom domain, or the host's production URL until one is chosen); every canonical tag, sitemap entry, and share URL is derived from it |
| Search Console | A Google account to verify the site and submit the sitemap on launch day (R14.24) |
