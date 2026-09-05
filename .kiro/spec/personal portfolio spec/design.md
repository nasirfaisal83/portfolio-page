# Design — Faisal Nasir portfolio website

Companion to `requirements.md` (R-numbers referenced throughout) and `faisal-nasir-portfolio-website-prd.md` (PRD v2, the only source of facts). Everything visual and technical here is a decision; everything factual is a quotation.

---

## 1. Design plan

**Subject:** a CS student at Ben-Gurion University who builds event-driven Java systems and LLM pipelines, teaches, organizes a tech community, and speaks three languages.
**Audience:** a recruiter or engineering manager at an Israeli tech company, on a laptop or phone, giving the link 60 seconds.
**The page's one job:** prove, not claim, that he builds real systems.

**Concept — "The READMEs, running."** His five repositories already contain hand-drawn ASCII architecture diagrams. The site takes those diagrams literally: it renders each project as a living system inside a dark instrument screen embedded in a calm, light, typeset page. The visitor can drive each system with a couple of plain buttons. The hero states the thesis by showing a diagram *as monospaced box-drawing text* that resolves into vector — the README becoming the running thing.

**Signature (the one memorable element):** the screens. Everything else is quiet.

**Principles**
1. Motion means something. A packet moves because a message moved. Nothing animates to decorate.
2. Structure encodes truth. Sequence numbers only where the content is a sequence (scenario steps, a dated log). No numbered project cards, no eyebrow labels.
3. Copy is plain. Buttons say what happens: "Place order", "Fail payment", "Ask a question". Headings are nouns. No arrows, no cleverness.
4. Real over impressive. Every node, topic, frame, and state comes from a README. Example values are labeled as examples.
5. Restraint. One type family, five colors, one orchestrated moment, and then discipline.

**Self-check against defaults.** First-pass instincts were a graphite-black page with a single amber accent and a serif display face — the current default look for "engineer portfolio". Changed: the page is light and cool (engineering vellum, not warm cream); dark exists only as the screens, as objects on the page; the display face is IBM Plex Mono, a subject-grounded risk (his artifacts are READMEs and terminals) set with editorial care rather than hacker chrome; the signal color is a teal phosphor (sonar blip for events), not amber or acid green; no eyebrows, no ALL-CAPS labels, no middle-dot meta strings, no arrows on links, no card kit, no per-section fade-ups.

---

## 2. Tokens

### 2.1 Color

| Token | Hex | Role |
|---|---|---|
| `--vellum` | `#ECEFF3` | Page background. Cool, slightly blue vellum |
| `--ink` | `#14202E` | Text, primary buttons, rules |
| `--graphite` | `#5B6675` | Secondary text, captions |
| `--hairline` | `#D4DAE2` | Borders, dividers on vellum |
| `--screen` | `#0F1B2D` | Screen background (deep navy, not black) |
| `--screen-ink` | `#E6EDF3` | Text inside screens |
| `--screen-muted` | `#7A8BA0` | Idle nodes, idle edges, grid inside screens |
| `--signal` | `#35D0C8` | In-screen: active node, packet, success path |
| `--signal-deep` | `#0B6E68` | On-page: links, focus ring, active nav underline |
| `--fault` | `#FF6B6B` | In-screen: failure, compensation |

Contrast (approximate, verify with axe in CI — R12.1): ink on vellum ≈ 14:1; graphite on vellum ≈ 5:1; signal-deep on vellum ≈ 5.3:1; screen-ink on screen ≈ 14:1; signal on screen ≈ 9:1; fault on screen ≈ 6:1.

Rules: `--signal` and `--fault` never appear on vellum as text. Semantic states inside screens use exactly three tones: idle (`--screen-muted`), active/success (`--signal`), fault (`--fault`). Pending states are idle plus a text chip, never a fourth color.

### 2.2 Type

One family, IBM Plex, chosen because it was designed as a system (Mono, Sans, Sans Arabic, Sans Hebrew share proportions) and because a monospaced display voice is *his* material: READMEs, topics, frames, enums.

| Role | Face | Weight | Size | Leading | Tracking |
|---|---|---|---|---|---|
| Name (h1) | Plex Mono | 400 | `clamp(56px, 9vw, 112px)` | 1.0 | −0.02em |
| Section heading (h2) | Plex Mono | 400 | `clamp(32px, 4vw, 44px)` | 1.1 | −0.01em |
| Project title (h3) | Plex Mono | 400 | 28px | 1.2 | 0 |
| Body | Plex Sans | 400 | 17px | 1.6 | 0 |
| Body emphasis | Plex Sans | 500 | 17px | 1.6 | 0 |
| Caption | Plex Sans | 400 | 15px | 1.5 | 0 |
| Identifier | Plex Mono | 400 | 13px | 1.4 | 0 |
| Name, Arabic | Plex Sans Arabic | 400 | matched optically to h1 x-height | — | — |
| Name, Hebrew | Plex Sans Hebrew | 400 | matched optically to h1 x-height | — | — |

"Identifier" is reserved for strings that exist in code: Kafka topics, STOMP frames, status enums, file names, configuration keys, ports. Tags, captions, navigation, and buttons are Plex Sans. This is the line between "typeset README" and "hacker template".

Measure ≤ 70 ch (R11.4). Sentence case everywhere. No single-word color or italic accents in headings. Italic Plex Mono is allowed for one thing: the hero tagline, if Faisal supplies one.

Loading: `next/font/google`, `display: swap`, Latin subsets for Plex Mono (Regular, Italic) and Plex Sans (Regular, Medium) — four files on first load (R13.3). Plex Sans Arabic and Hebrew load after first paint, subset to the name's glyphs, and are only fetched once the placeholders are replaced.

### 2.3 Space, radius, borders

- Base unit 8px. Section padding `clamp(64px, 10vh, 128px)`. Content max-width 1120px, side gutters `clamp(20px, 4vw, 48px)`.
- Radius: page controls 4px; screens 6px; nothing else rounded. Shadows: none on vellum. Screens use a 1px `--hairline` border and a 1px inner ring of `rgba(255,255,255,0.04)`.
- Inside screens: an 8px grid at 6% `--screen-muted` as the diagram canvas. No grid on the page.

### 2.4 Motion

| Token | Value | Use |
|---|---|---|
| `--t-hover` | 120ms ease-out | Color, underline, border feedback |
| `--t-ui` | 240ms `cubic-bezier(0.16, 1, 0.3, 1)` | Open/close, crossfade, copy confirmation |
| `--t-status` | 300ms ease-out | Status chip change |
| `--t-packet` | 700–1200ms ease-in-out | One edge traversal; longer edges take longer |
| `--t-gap` | 350ms | Pause between scenario steps |
| `--t-morph` | 600ms `cubic-bezier(0.16, 1, 0.3, 1)` | Layout morph (server mode switch, shared element) |
| Hero moment | 1.4s total | R2.1 |

Reduced motion: every token collapses to 0 except crossfades, which cap at 150ms (R3.5).

---

## 3. Layout

Left-aligned throughout. The page is one continuous column with no alternating backgrounds; the screens provide all the contrast. Two-column only where a screen sits beside its text (hero, each project) at ≥ 1024px.

### 3.1 Desktop, hero and one project section

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Faisal Nasir                          Projects  About  Skills  Community │
│                                       Contact   GitHub                   │
│                                                                          │
│  Faisal Nasir                    ┌ five projects ───────────────────┐    │
│  [TODO_NAME_AR]  [TODO_NAME_HE]  │                                  │    │
│                                  │   rag-document-qa    order-saga  │    │
│  CS student at Ben-Gurion        │            \          /          │    │
│  University of the Negev         │   tech-news ── ● ── emergency    │    │
│  (expected graduation 2028)      │        -agent      -alert-system │    │
│  Based in Israel                 │            con-detection         │    │
│  Arabic, Hebrew, English         │                                  │    │
│                                  └──────────────────────────────────┘    │
│  [See the projects] [GitHub] [Download resume]                           │
├──────────────────────────────────────────────────────────────────────────┤
│  Projects                                                                │
│                                                                          │
│  Order-Saga                      ┌ order-saga ──────────────────────┐    │
│  A choreography-based saga       │ Gateway  Order   Inventory       │    │
│  across five services...         │ ═══════ kafka ═══════════════    │    │
│                                  │ Payment  Shipping  Notification  │    │
│  Stack                           │ order: COMPLETED                 │    │
│  Spring Boot 3.4.3, Java 17,     │ [Place order] [Fail payment]     │    │
│  Apache Kafka, PostgreSQL ...    │ [Out of stock]   Show as text    │    │
│                                  └──────────────────────────────────┘    │
│  View on GitHub   Read the case study                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

Text column 5/12, screen column 7/12, 48px gap. The screen is `position: sticky; top: 96px` inside its section so it stays in view while the text is read.

### 3.2 Mobile (< 768px)

```
┌────────────────────────────┐
│ Faisal Nasir        Menu   │
│                            │
│ Faisal Nasir               │
│ [TODO_NAME_AR]             │
│ [TODO_NAME_HE]             │
│ CS student at Ben-Gurion   │
│ University of the Negev    │
│ ...                        │
│ [See the projects]         │
│ [GitHub] [Download resume] │
│ ┌ five projects ─────────┐ │
│ │  (narrow map)          │ │
│ └────────────────────────┘ │
├────────────────────────────┤
│ Order-Saga                 │
│ A choreography-based ...   │
│ ┌ order-saga ────────────┐ │
│ │  (narrow scene:        │ │
│ │   nodes stacked,       │ │
│ │   bus vertical)        │ │
│ │ ◂ [Place order] [Fail  │ │
│ │   payment] [Out of ▸   │ │
│ └────────────────────────┘ │
│ Stack ...                  │
│ View on GitHub             │
└────────────────────────────┘
```

Screens are not sticky on mobile. Controls scroll horizontally (R11.2).

### 3.3 Navigation

Sticky bar, 64px, vellum with a bottom hairline that appears after 24px of scroll. Left: "Faisal Nasir" (Plex Mono, links to top). Right: Projects, About, Skills, Community, Contact, GitHub in Plex Sans. Current section gets a 2px `--signal-deep` underline driven by an IntersectionObserver. Below 768px the links collapse into a "Menu" button that opens a full-height list (no hamburger icon; the word "Menu" / "Close"). Skip link "Skip to projects" is the first focusable element (R10.3).

---

## 4. Do-not list

Typewriter titles; blinking cursors; terminal prompts; particles; cursor trails; parallax; 3D tilt; card hover lift; gradient meshes; glassmorphism; skill bars or percentages; tech-logo clouds; numbered project cards; ALL-CAPS eyebrows; middle-dot meta strings; arrows appended to links; identical rounded cards with soft grey shadows; auto-playing loops outside the hero screen; company logos; testimonials; any metric not in a README or the PRD.

---

## 5. Sections

### 5.1 Hero

**Left:** name (h1), the Arabic and Hebrew renderings on the next line (hidden while placeholders, R1.4), then three lines of Plex Sans body from `site.ts`: role line, location, languages. Tagline slot below in Plex Mono Italic (hidden while placeholder). Three controls: primary "See the projects" (ink button, vellum text), secondary "GitHub" and "Download resume" (ink outline).

**Right — the hero screen.** A navigation map: five nodes, one per project, around a small central node labeled "portfolio". Edges are plain (they mean "built by", nothing more). Ambient behavior: every ~2.5s one packet leaves a random project node toward the center carrying an identifier from that project — `order.created`, `event: token`, `MESSAGE`, `ScoutAgent`, `frame 0412` — a true fragment of each system. Nodes are buttons (R2.5).

**The moment (R2).** The screen mounts with two stacked layers:
1. `HeroAscii` — a `<pre>` in Plex Mono, `--signal` on `--screen`, containing the map as box-drawing characters (below). Real text, `aria-hidden`.
2. `HeroScreen` — the SVG map, `opacity: 0`.

Timeline: 0–200ms nothing (let the page paint). 200–900ms the ASCII layer is fully visible. 900–1400ms the ASCII fades out while the SVG fades in and its edges draw from the center outward (`stroke-dashoffset`); nodes settle from 0.96 to 1.0 scale. Done at 1.4s. A `sessionStorage` flag prevents replay (R2.2). Under reduced motion only layer 2 mounts.

```
                  rag-document-qa
                        │
   order-saga ──────────┼────────── tech-news-agent
                        │
                   ┌────┴────┐
                   │portfolio│
                   └────┬────┘
                        │
 emergency-alert-system ┴──────────── con-detection
```

### 5.2 Projects

Heading "Projects" and one sentence of body: "Five public repositories. Each screen runs the system described in that repository's README; the buttons drive real scenarios from it." Then five sections in this order (a judgment about interest, not a ranking, so no numbers): Order-Saga, rag-document-qa, tech-news-agent, Emergency-Alert-System, con-Detection.

Each section: h3 title (repo name as written on GitHub), summary (locked), "Stack" as a caption heading followed by a comma-separated Plex Sans list (no pills), two links "View on GitHub" and "Read the {repo name} case study" (the name is the anchor text, §13.5), and the screen. Screens lazy-load when their section is within one viewport of the fold.

### 5.3 Case study page (`/projects/[slug]`, R5)

Same nav. A breadcrumb (Home, Projects, the repository name) above the h1; h1 = repo name. The screen first, full content width, with the same controls. Then "What it does" (summary), "How it works" (2–5 short paragraphs paraphrased from the README's architecture and flow sections, no code, under headings that name the real concept — §13.4), "Design decisions" (bulleted, from the README's "Key Design" section), "Stack" (two-column table: layer, technology), "Source" (GitHub link), and "Previous project" / "Next project" links by name. The screen carries `layoutId="screen-{slug}"` so Motion animates it between the section and the page (R5.3).

### 5.4 About and experience (R6)

Two columns at ≥ 1024px. Left, "About": three short paragraphs assembled only from PRD §5.2 — study and teaching; Hasoub; self-directed learning and coursework. Right, "Experience": a two-entry log. Each entry is a row with a 6px `--signal-deep` dot on a vertical hairline, role in Plex Sans 500, organization in Plex Sans, one line of detail. The date column renders only when `period !== "TODO_DATES"` (R6.2).

### 5.5 Skills (R7)

Heading "Skills". Groups from PRD §5.5 as subheadings in Plex Sans 500; items as a wrapped inline list separated by hairline dividers, Plex Sans, no pills, no bars. Interaction: on hover/focus of an item, the rest of the list drops to `--graphite` and a caption appears under the group: "Used in Order-Saga, rag-document-qa" — computed from `projects[].stack` by `skillsIndex.ts` (case-insensitive match on a normalized token). Items with no project match show "Coursework" or "Language" as their caption. Keyboard: items are focusable buttons with the same behavior.

### 5.6 Community (R8)

Heading "Community". One block: "On-Campus Community Manager, Hasoub" in Plex Sans 500; body: "Organizes talks, industry events, and a hackathon for the tech community in Israel." Nothing else.

### 5.7 Contact (R9)

Heading "Contact". The email set large in Plex Mono (it is an identifier) as a `mailto:` link, with a "Copy email" button that becomes "Copied" for 2s. Below: "GitHub", "LinkedIn", "Download resume" as ink outline buttons. Under reduced motion the "Copied" swap is instant.

### 5.8 Footer

One line in caption size: "Faisal Nasir" and, if the site's repository is public, "Source on GitHub". No year, no "made with".

---

## 6. Screen engine

One engine, five scenes. A screen is a declarative *scene* (what exists) plus *scenarios* (what happens), run by a small scheduler.

### 6.1 Schema (`screens/engine/types.ts`)

```ts
export type NodeId = string;

export interface SceneNode {
  id: NodeId;
  label: string;            // identifier or plain name
  x: number; y: number;     // viewBox units
  w?: number; h?: number;   // default 120 × 40
  kind?: "service" | "bus" | "store" | "client" | "agent" | "tool" | "stage" | "registry";
  status?: string;          // initial chip text, e.g. "PENDING"
}

export interface SceneEdge {
  id: string;
  from: NodeId; to: NodeId;
  via?: NodeId;             // route through a bus node
  dashed?: boolean;
}

export interface Scene {
  viewBox: [number, number]; // wide layout, e.g. [720, 400]
  nodes: SceneNode[];
  edges: SceneEdge[];
  narrow?: Pick<Scene, "viewBox" | "nodes">; // positions for < 768px; edges reused
}

export type Step =
  | { t: number; kind: "packet"; edge: string; label?: string; tone?: "signal" | "fault"; duration?: number }
  | { t: number; kind: "pulse"; node: NodeId; tone?: "signal" | "fault" }
  | { t: number; kind: "status"; node: NodeId; value: string; tone?: "idle" | "signal" | "fault" }
  | { t: number; kind: "set"; target: string; value: string | number | boolean } // gauges, counters, text strips
  | { t: number; kind: "morph"; layout: string }                                  // named alternate positions
  | { t: number; kind: "say"; text: string };                                     // aria-live narration

export interface Scenario {
  id: string;
  label: string;            // button copy, imperative: "Place order"
  steps: Step[];            // t in ms from scenario start, ascending
  narration: string[];      // ordered list for "Show as text" (R4.6)
}
```

### 6.2 Runtime

- `useScenario(scenarios, { autoplay: id })` owns one `requestAnimationFrame` loop per mounted screen, maps elapsed time to steps, and exposes `play(id)`, `pause()`, `reset()`, `state` (per-node status, per-target values, in-flight packets, current step index).
- Visibility: `useInView(threshold 0.5)` triggers the single autoplay (R4.3) and pauses when the screen leaves; `usePageVisible` pauses on tab hide (R4.7). Resume continues from the paused elapsed time.
- Packets: each edge path is an SVG `<path>`; length is read once on mount. A packet is a `motion.g` translated along `path.getPointAtLength(progress × length)` with progress driven by `animate(0 → 1, { duration, ease: "easeInOut" })`. Cap 6 in flight (R4.10); extra launches queue.
- Reduced motion (R3.5): `useReducedMotion()` from Motion. The scheduler jumps to each step's end state in order with a 150ms crossfade; packets are skipped, but `status`, `set`, `morph`, and `say` steps still apply. "Play with motion" sets a per-screen override.
- Errors: `ScreenBoundary` catches, renders the scene's static end state as SVG plus `ScreenText`, and reports to console (R4.8).
- SSR: the scene's initial frame is rendered at build time (static export) so the screen is visible before hydration and with JavaScript disabled.

### 6.3 Primitives

`Screen` (chrome: 6px radius, title strip in Plex Mono with the repo name, controls row, "Show as text"), `Scene` (SVG, viewBox, grid), `Node` (rect, label, optional `StatusChip`), `Bus` (a 6px horizontal or vertical band with the label `kafka` and topic labels that ride on packets), `Edge`, `Packet` (8px circle, 2px `--screen` stroke, label above in Identifier size, trail of two ghosts at 40% and 15%), `StatusChip` (Identifier text on a 1px outline that changes tone), `Gauge` (horizontal bar with threshold tick), `Terminal` (a 3-line monospaced strip for streamed text), `ScreenControls` (buttons ≥ 44px tall on touch), `ScreenText` (aria-live region + ordered narration list).

### 6.4 Visual grammar inside screens

Stroke 1.5px for idle edges (`--screen-muted`), 2px when a packet is on them (`--signal` or `--fault`). Node fill `--screen`, 1px stroke `--screen-muted`; active node stroke `--signal` with a single 300ms pulse (stroke-width 1 → 2 → 1), no glow filters. Labels: node names in Plex Sans 13px `--screen-ink`; identifiers (topics, frames, enums, ports) in Plex Mono 12px `--signal`/`--screen-muted`. Fault tone is used only for failure events and compensation packets. Nothing blinks.

### 6.5 Accessibility of screens

`<figure role="group" aria-label="{repo}: {one-sentence system summary}">`. The SVG is `aria-hidden`; the narration list is the accessible content. `aria-live="polite"` announces each `say` step. Controls are buttons with `aria-pressed` for the mode toggle. Focus rings 2px `--signal` inside screens, 2px `--signal-deep` on vellum, 2px offset.

---

## 7. The five screens

Every node, edge, label, state, and value below is taken from the project's README. Wide viewBox 720 × 400 unless stated.

### 7.1 Order-Saga — choreography saga

**Scene.** Top row: Gateway (client entry), Order, Inventory. Center: Bus `kafka` spanning the width. Bottom row: Payment, Shipping, Notification. Right edge: a small registry marker `eureka` with dashed edges to every service (drawn once, never animated). Order carries a `StatusChip`. Below the bus, a status timeline strip listing `PENDING → INVENTORY_RESERVED → PAYMENT_PROCESSING → COMPLETED` with `FAILED` and `COMPENSATING` as side states; the current state is highlighted. Each service shows a tiny counter `processed 0` (the idempotency table).

**Controls.** "Place order" (default), "Fail payment", "Out of stock".

**Scenario: Place order**
| t (ms) | step |
|---|---|
| 0 | packet Gateway→Order, label `POST /api/orders` |
| 700 | status Order `PENDING`; say "Order created, status PENDING" |
| 900 | packet Order→bus→Inventory, label `order.created` |
| 1900 | pulse Inventory; set `inventory.processed` +1 |
| 2100 | packet Inventory→bus→Order, `inventory.reserved`; packet Inventory→bus→Payment, same label |
| 3100 | status Order `INVENTORY_RESERVED`; pulse Payment |
| 3400 | packet Payment→(loop to a small `mock payment` stub)→Payment, label `payment gateway` |
| 4200 | packet Payment→bus→Order, `payment.succeeded`; packet Payment→bus→Shipping, same |
| 5200 | status Order `PAYMENT_PROCESSING`; pulse Shipping |
| 5500 | packet Shipping→bus→Order, `shipment.created`; packet Shipping→bus→Notification, same |
| 6500 | status Order `COMPLETED` (signal); pulse Notification; say "Shipment created, order COMPLETED, notification sent" |

**Scenario: Fail payment.** Steps through 3400 identical, then: packet Payment→bus→Inventory `payment.failed` (fault), packet Payment→bus→Order `payment.failed` (fault), packet Payment→bus→Notification `payment.failed` (fault); status Order `COMPENSATING`; pulse Inventory (fault) with set `inventory.stock` from `reserved` to `released`; status Order `FAILED`; say "Payment failed; inventory released; order FAILED; failure email sent".

**Scenario: Out of stock.** After `order.created` arrives: packet Inventory→bus→Order `inventory.failed` (fault), packet Inventory→bus→Notification `inventory.failed` (fault); status Order `FAILED`; say "Inventory unavailable; order FAILED; out-of-stock email sent".

**Documented values shown:** ports 8080–8085 as node subtitles; topic names; status enum. **Narrow layout:** two columns of services with the bus vertical between them.

### 7.2 rag-document-qa — RAG pipeline

**Scene.** Left-to-right ingestion lane: `upload` (a document glyph), `extract` (three stacked stage pills `PDFBox`, `Tesseract`, `GPT-4o Vision`), `chunk` (a page rectangle that splits into shingled blocks, caption `500 tokens, 50 overlap`), `embed` (blocks become dots that fly into a square "vector space" panel), `store` (a store node `PostgreSQL + pgvector`, caption `ivfflat`). Below, the query lane: `question` pill, the same vector-space panel (shared), `prompt` box, `answer` Terminal, `sources` chip row. The Document node has a `StatusChip` for `PROCESSING → READY / FAILED`.

**Controls.** "Ingest a document" (default), "Ask a question", "Ingest a scanned page".

**Scenario: Ingest a document.** Upload packet to Document; status `PROCESSING`; say "Upload accepted, 202, processing in the background". Extract: `PDFBox` pill lights (signal). Chunk: page splits into 8 shingled blocks. Embed: each block becomes a dot and flies into the vector panel (8 packets, staggered 90ms). Store: dots settle; status `READY`; set `chunks` = 8; say "Chunks embedded and stored, document READY".

**Scenario: Ingest a scanned page.** Same, but `PDFBox` lights then dims with a small `< min text` caption, `Tesseract` lights and holds; say "Digital text too short; OCR fallback produced the page text". (A third fall-through to `GPT-4o Vision` is shown only as a dimmed pill with caption `last resort`, since it is the README's third strategy.)

**Scenario: Ask a question.** Question pill appears (`What are the payment terms?` — README example); packet to embed; a signal dot lands in the vector panel; the 5 nearest dots light with short lines to the query dot (`top-k 5`); those 5 fly into the prompt box; the Terminal streams an answer word by word over 2.4s with a side strip flicking `event: token` lines; then `event: sources` and two chips `Chunk 12, page 4` and `Chunk 7, page 2`, plus `confidence 0.87` with the caption "example from the README". Say: "Question embedded; five nearest chunks retrieved; answer streamed with two cited sources".

**Documented values shown:** 500/50 chunking, top-k 5, `text-embedding-3-small` (1536 dimensions) as a caption, example question, chunk and page numbers, 0.87. **Narrow layout:** ingestion lane stacked vertically above the query lane.

### 7.3 tech-news-agent — multi-agent ReAct pipeline

**Scene.** Top: `OrchestratorAgent` drawn as a node with a ring around it labeled `reason → act → observe`. Middle row, five agent nodes: `ScoutAgent`, `ReporterAgent`, `EditorAgent`, `FactCheckerAgent`, `LinkedInWriterAgent`. Under Scout, two tool nodes: `Tavily` and `GitHub MCP`. Under FactChecker, a `Gauge` with a threshold tick at `0.6`. Right: an output card slot. Top-left: a topic pill.

**Controls.** "Run pipeline" (default), "Force a retry".

**Scenario: Run pipeline.** Topic pill `NVIDIA Blackwell GPU` (README example) travels to Orchestrator; ring rotates once. Packet Orchestrator→Scout; Scout pulses; dashed packets Scout↔Tavily and Scout↔GitHub MCP. Packet Scout→Reporter; set `facts` counter to 6. Packet Reporter→Editor; Editor pulses. Packet Editor→FactChecker; Gauge fills to 0.83; say "Fact check passed with confidence 0.83". Packet FactChecker→LinkedInWriter; output card slides in with the markers `[HIGH]`, `[MEDIUM]`, `[UNVERIFIED]` and a caption "example response from the README, ~63 s".

**Scenario: Force a retry.** Same through the first fact check, but the Gauge stops at 0.52 (fault), a fault packet returns FactChecker→Reporter labeled `re-extract facts`, the ring rotates again, then the second pass fills to 0.83 and continues. Caption under the gauge during the loop: "retry decided by the model, not by hardcoded Java" (README).

**Documented values shown:** agent names, tool names, threshold 0.6, example confidence 0.83, fact count 6, processing time ~63 s, markers. The 0.52 first pass is not documented and is labeled "illustrative" on screen. **Narrow layout:** agents stacked vertically, tools beside Scout, gauge beside FactChecker.

### 7.4 Emergency-Alert-System — STOMP pub/sub

**Scene.** Center: `StompServer` with a mode switch `tpc | reactor` in the chrome. Inside the server: in `tpc`, one lane per connected client (`thread 1..n`); in `reactor`, a single `selector` loop ring plus a `thread pool` of three small bars. Around the server: three client terminals `client A`, `client B`, `client C` (C++), and a channel label `germany` (README example) between server and subscribers.

**Controls.** "Connect clients" (default), "Broadcast an alert", mode toggle (`aria-pressed`).

**Scenario: Connect clients.** For each client: packet client→server `CONNECT`, packet server→client `CONNECTED`, a lane (tpc) or a selector registration tick (reactor) appears; then A and B send `SUBSCRIBE germany`, server replies `RECEIPT`. Say: "Three clients connected; A and B subscribed to germany".

**Scenario: Broadcast an alert.** Packet C→server `SEND` with a small event card `Fire in Berlin` (README example); server pulses; packets server→A and server→B `MESSAGE`; packet server→C `RECEIPT`; C does not receive `MESSAGE`. Say: "C published to germany; A and B received MESSAGE; C received RECEIPT".

**Mode toggle.** `morph` step: lanes collapse into the selector ring or expand back, 600ms. Narration: "Reactor mode: one non-blocking selector thread hands work to an actor thread pool" / "Thread-per-client mode: one OS thread per connection".

**Documented values shown:** frame names, modes, channel and event example, `UNSUBSCRIBE`/`DISCONNECT`/`ERROR` appear only in the "Show as text" frame list. **Narrow layout:** server on top, clients in a row below.

### 7.5 con-Detection — YOLOv5 detection loop

**Scene.** A 16:9 "frame" panel with a vector road in one-point perspective and three cone silhouettes at different depths; a frame counter `frame 0412` in the corner. Below: a pipeline strip `video → frame → YOLOv5 → boxes` with the active stage highlighted. Caption inside the chrome: "Illustration of the detection loop; the notebook runs the real model."

**Controls.** "Play" / "Pause" (one toggle button, label swaps).

**Behavior.** While playing, the counter advances every 400ms, cones scale up along the perspective, and each visible cone carries a bracket-corner bounding box labeled `cone` that follows it. Every 4th frame the pipeline strip steps through its four stages in 400ms. No numeric confidences (R4.27). After 24 frames the sequence resets to frame 0400. Because this screen is inherently a loop, it plays once on view for one cycle (24 frames, ~10s) then stops on the last frame with "Play" available.

**Documented values shown:** YOLOv5, frame-by-frame processing, Colab. **Narrow layout:** same, scaled.

---

## 8. Architecture and stack

Resolves PRD §8 (Option A).

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js, App Router, `output: "export"` (current stable) | Static output, per-route code splitting, `generateStaticParams` for the five case-study pages, `next/font`, `opengraph-image` route |
| Language | TypeScript, `strict` | Content and scene schemas are typed; the content check is a type plus a script |
| Styling | Tailwind CSS (current stable) for layout utilities; all tokens as CSS custom properties in `tokens.css` | Tokens stay readable and swappable; utilities keep spacing consistent |
| Motion | Motion (`motion/react`, formerly Framer Motion) | `layoutId` shared-element transitions, `useReducedMotion`, SVG attribute animation, `animate()` for packet progress |
| Scheduler | Hand-written (`useScenario`) | A timeline of typed steps is simpler and lighter than any animation-library timeline, and testable without a DOM |
| Icons | None at launch | Words instead of icons; a document glyph and cone silhouettes are inline SVG paths |
| Tests | Vitest + Testing Library; Playwright; `@axe-core/playwright`; Lighthouse CI | R12.6, R13.1 |
| Hosting | Vercel from the GitHub repo (GitHub Pages as fallback) | Preview URLs per pull request (R18.2) |

Rejected: GSAP (fine, but two animation systems is one too many); Three.js/WebGL (heavy and off-concept); Astro (the interactive screens favor one React tree); a CMS (content is five objects).

Rendering: sections are server components; `Nav`, `Hero`, each `*Screen`, `Skills`, and `CopyButton` are client components. Each screen is imported with `next/dynamic` from its section; the first frame is server-rendered so the static export shows the diagram before hydration.

Version pinning happens at project creation, to the then-current stable releases; this document does not pin versions.

### 8.1 Directory layout

```
src/
  app/
    layout.tsx  page.tsx  not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx
    projects/[slug]/page.tsx  projects/[slug]/opengraph-image.tsx
  components/
    layout/    SkipLink.tsx  Nav.tsx  Footer.tsx  Breadcrumb.tsx
    hero/      Hero.tsx  HeroAscii.tsx  HeroScreen.tsx  Name.tsx
    projects/  ProjectSection.tsx  CaseStudy.tsx  StackTable.tsx  ProjectPager.tsx
    screens/
      engine/  Screen.tsx  Scene.tsx  Node.tsx  Edge.tsx  Bus.tsx  Packet.tsx  StatusChip.tsx
               Gauge.tsx  Terminal.tsx  ScreenControls.tsx  ScreenText.tsx  ScreenBoundary.tsx
               useScenario.ts  useInView.ts  usePageVisible.ts  types.ts
      order-saga/             OrderSagaScreen.tsx  scene.ts  scenarios.ts
      rag-document-qa/        RagScreen.tsx        scene.ts  scenarios.ts
      tech-news-agent/        AgentsScreen.tsx     scene.ts  scenarios.ts
      emergency-alert-system/ StompScreen.tsx      scene.ts  scenarios.ts
      con-detection/          DetectionScreen.tsx  scene.ts
    sections/  About.tsx  Experience.tsx  Skills.tsx  Community.tsx  Contact.tsx
    ui/        Button.tsx  CopyButton.tsx  SectionHeading.tsx
  content/     site.ts  projects.ts  experience.ts  skills.ts  seo.ts   ← every factual string
  lib/         motion.ts  skillsIndex.ts  seo.ts (absoluteUrl, metadata, JSON-LD builders)
  styles/      tokens.css  globals.css
scripts/       content-check.ts  og.ts (fallback share-image pre-render, §13.6)
public/        resume.pdf (supplied by Faisal)  favicon.svg
tests/         unit/  e2e/  seo/
```

---

## 9. Content model

`src/content/*` is the only place facts live (R15.1). The strings below are copied from PRD v2 and the READMEs; they are to be used verbatim.

### 9.1 `site.ts`

```ts
export const site = {
  name: "Faisal Nasir",
  nameArabic: "TODO_NAME_AR",
  nameHebrew: "TODO_NAME_HE",
  roleLine: "CS student at Ben-Gurion University of the Negev (expected graduation 2028)",
  location: "Based in Israel",
  languages: "Arabic, Hebrew, English",
  tagline: "TODO_TAGLINE",
  email: "nasirfaisal83@gmail.com",
  github: "https://github.com/nasirfaisal83",
  linkedin: "https://www.linkedin.com/in/faisal-nasir-381a33131",
  resumeUrl: "/resume.pdf",
  description:
    "CS student at Ben-Gurion University of the Negev, teaching assistant, and Hasoub on-campus community manager. Five public projects: RAG document Q&A, a choreography saga, a multi-agent news pipeline, a STOMP alert system, and YOLOv5 cone detection.",
} as const;
```

### 9.2 `projects.ts`

```ts
export type ScreenId = "order-saga" | "rag" | "agents" | "stomp" | "detection";

export interface Project {
  slug: string; title: string; github: string; screen: ScreenId;
  summary: string; stack: string[]; highlights: string[];
}

export const projects: Project[] = [
  {
    slug: "order-saga", title: "Order-Saga", screen: "order-saga",
    github: "https://github.com/nasirfaisal83/Order-Saga",
    summary: "Order-processing system across 5 microservices (order, inventory, payment, shipping, notification) using the Choreography Saga pattern — no central orchestrator, services coordinate purely through Kafka events, with automatic compensation logic if a step fails (e.g. releasing reserved stock on payment failure). Spring Boot 3.4.3, Java 17, Kafka, PostgreSQL, Spring Cloud (Eureka, Gateway, OpenFeign), Docker Compose.",
    stack: ["Spring Boot 3.4.3", "Java 17", "Apache Kafka 7.5.0", "PostgreSQL 15 (one per service)", "Spring Cloud Eureka", "Spring Cloud Gateway", "Spring Cloud OpenFeign", "Spring Cloud 2024.0.1", "Spring Data JPA", "Maven", "Docker", "Docker Compose", "Kafka UI", "Zookeeper"],
    highlights: [
      "Choreography, not orchestration: each service reacts to events and publishes its own result event; nothing coordinates centrally.",
      "Idempotent consumers: every service records processed event IDs in a ProcessedEvent table to tolerate Kafka's at-least-once delivery.",
      "Optimistic locking with @Version on the Product entity prevents double-booking inventory under concurrency.",
      "Compensation: a payment failure automatically releases reserved stock and fails the order; an inventory failure fails the order and notifies.",
      "One PostgreSQL database per service; OpenFeign clients call mock payment, shipping, and email providers that can be switched to fail for testing.",
      "Observability through the Eureka dashboard and Kafka UI; order status lifecycle PENDING, INVENTORY_RESERVED, PAYMENT_PROCESSING, COMPLETED, FAILED, COMPENSATING."
    ],
  },
  {
    slug: "rag-document-qa", title: "rag-document-qa", screen: "rag",
    github: "https://github.com/nasirfaisal83/rag-document-qa",
    summary: "Full-stack RAG (Retrieval-Augmented Generation) application: upload documents, ask natural-language questions, get streamed answers grounded in the source text. Spring Boot 3.3 + Spring AI 1.0, OpenAI GPT-4o, PostgreSQL + pgvector for vector search, with a 3-strategy PDF extraction pipeline (PDFBox → Tesseract OCR → GPT-4o Vision) and SSE token streaming with source citations.",
    stack: ["Spring Boot 3.3", "Spring MVC", "Spring AI 1.0", "OpenAI GPT-4o", "text-embedding-3-small (1536 dimensions)", "PostgreSQL 16", "pgvector", "Spring Data JPA (Hibernate)", "Flyway", "Project Reactor", "Spring WebFlux", "Apache PDFBox", "Tesseract via Tess4J", "GPT-4o Vision", "Apache POI", "JTokkit", "Lombok", "SpringDoc OpenAPI", "Vanilla HTML/CSS/JS", "Docker Compose", "Java 21"],
    highlights: [
      "Asynchronous ingestion: the upload returns 202 Accepted with a document ID at once and the frontend polls status (PROCESSING, READY, FAILED).",
      "Strategy pattern for extraction: one handler per file type behind a DocumentHandler interface; PDF, DOCX, PPTX, XLSX, text, and images.",
      "PDF three-strategy waterfall per page: PDFBox digital text, then Tesseract OCR, then GPT-4o Vision as the last resort, so no page is silently skipped.",
      "Token-aware chunking with JTokkit using OpenAI's CL100K_BASE tokenizer: 500-token chunks with 50-token overlap.",
      "Native SQL for cosine similarity search on pgvector with an IVFFlat index (100 lists); top-k 5 by default.",
      "Server-Sent Events over a Flux<ServerSentEvent> so each token is flushed past Tomcat's 8 KB buffer and reaches the browser immediately.",
      "Cross-document search implemented purely in SQL, with no schema change; confidence is the average cosine similarity of the retrieved chunks."
    ],
  },
  {
    slug: "tech-news-agent", title: "tech-news-agent", screen: "agents",
    github: "https://github.com/nasirfaisal83/tech-news-agent",
    summary: "Multi-agent pipeline that turns a tech topic into a fact-checked, LinkedIn-ready post: an OrchestratorAgent runs a ReAct loop coordinating five specialized agents (Scout, Reporter, Editor, FactChecker, LinkedInWriter), with an automatic retry if the fact-check confidence score is too low. Spring Boot, Spring AI, OpenAI GPT-4o-mini, Tavily Search API, GitHub MCP Server, Java 21.",
    stack: ["Spring Boot 3.5.0", "Spring AI 1.0.0", "OpenAI gpt-4o-mini", "Tavily Search API", "GitHub MCP Server v0.6.2", "Spring WebFlux (WebClient)", "Java 21", "Maven"],
    highlights: [
      "The orchestrator runs a ReAct loop: it reasons, calls tools, observes results, and decides the next step.",
      "The retry is decided by the model: if fact-check confidence falls below 0.6, facts are re-extracted; nothing in Java hardcodes the loop.",
      "Tools: Tavily web search, a page-fetch tool, and GitHub data through the GitHub MCP server.",
      "A ContextSizeAdvisor guards against token overflow; each agent has its own system prompt under resources/prompts.",
      "One POST /api/news/generate call returns the post, a verified article with [HIGH], [MEDIUM], and [UNVERIFIED] markers, overall confidence, fact counts, and processing time; a run takes 30–90 seconds."
    ],
  },
  {
    slug: "emergency-alert-system", title: "Emergency-Alert-System", screen: "stomp",
    github: "https://github.com/nasirfaisal83/Emergency-Alert-System",
    summary: "Distributed publish-subscribe alert broadcasting system built on the STOMP protocol: a Java 8 server (switchable between a thread-per-client model and a non-blocking reactor/NIO model) paired with a C++11 command-line client (Boost ASIO) for real-time channel subscription and event broadcast.",
    stack: ["Java 8", "Maven", "STOMP", "Java NIO selector (reactor mode)", "C++11", "Make", "Boost ASIO", "Boost Thread"],
    highlights: [
      "Two selectable server threading models: thread-per-client (one OS thread per connection) and reactor (a non-blocking NIO selector with an actor thread pool).",
      "Supported frames: CONNECT, SUBSCRIBE, UNSUBSCRIBE, SEND, DISCONNECT from clients; CONNECTED, MESSAGE, RECEIPT, ERROR from the server.",
      "The C++ client offers login, join, exit, report, summary, and logout commands, and reads events to publish from a JSON file.",
      "Subscribers on a channel receive MESSAGE frames for events other clients send to it."
    ],
  },
  {
    slug: "con-detection", title: "con-Detection", screen: "detection",
    github: "https://github.com/nasirfaisal83/con-Detection",
    summary: "Cone-detection system built on YOLOv5, processing video frame-by-frame to identify and bound traffic cones — aimed at applications like autonomous-driving tests and robotics navigation. Python, built and run in Google Colab.",
    stack: ["Python 3.7+", "YOLOv5", "PyTorch (torch, torchvision, torchaudio)", "OpenCV (opencv-python-headless 4.5.2.52)", "Jupyter Notebook", "Google Colab"],
    highlights: [
      "Runs the YOLOv5 object detection model over a video file frame by frame, drawing bounding boxes around detected cones.",
      "Built for Google Colab's hosted, Linux-based notebook environment; no local setup beyond cloning and installing dependencies.",
      "The sample video is kept out of the repository because of size; the notebook expects it on the local machine."
    ],
  },
];
```

### 9.3 `experience.ts`

```ts
export const experience = [
  { role: "Teaching Assistant", org: "Ben-Gurion University of the Negev",
    detail: "Data Structures; Introduction to CS (Java & OOP)", period: "TODO_DATES" },
  { role: "On-Campus Community Manager", org: "Hasoub",
    detail: "Organizes talks, industry events, and a hackathon", period: "TODO_DATES" },
] as const;

export const about = {
  study: "Computer Science student at Ben-Gurion University of the Negev, expected graduation 2028. Teaching Assistant for Data Structures and Introduction to CS (Java & OOP).",
  community: "On-Campus Community Manager for Hasoub, a tech community in Israel: talks, industry events, and a hackathon.",
  learning: "Self-directed: a structured AI engineering roadmap and off-campus bootcamps in microservices/DevOps, agentic AI, and Python/deep learning. Coursework includes the System Programming Laboratory (C, x86 NASM assembly, Unix processes and signals, ELF format) and Principles of Programming Languages (TypeScript functional programming, Ramda, monads, L3/Scheme).",
} as const;
```

### 9.4 `skills.ts` (groups and items exactly as PRD §5.5)

```ts
export const skills = [
  { group: "Languages", items: ["Java", "Python", "C++", "C", "JavaScript", "x86 NASM Assembly", "TypeScript", "SQL"] },
  { group: "Backend", items: ["Spring Boot", "Spring AI", "Spring Cloud (Eureka, Gateway, OpenFeign)", "Spring WebFlux", "Spring Data JPA"] },
  { group: "AI/LLM engineering", items: ["OpenAI GPT-4o / GPT-4o-mini integration", "Retrieval-Augmented Generation (pgvector)", "multi-agent orchestration (ReAct pattern)", "Tavily Search API", "GitHub MCP", "YOLOv5 object detection", "OpenCV"] },
  { group: "Data", items: ["PostgreSQL", "pgvector", "Flyway"] },
  { group: "Messaging & infra", items: ["Apache Kafka", "Docker / Docker Compose", "STOMP protocol", "Boost ASIO"] },
  { group: "Architecture", items: ["Choreography Saga pattern", "microservices", "idempotent consumers", "optimistic locking", "thread-per-client & reactor concurrency models"] },
  { group: "Document processing", items: ["Apache PDFBox", "Tesseract OCR", "Apache POI"] },
  { group: "Systems programming (coursework)", items: ["C", "x86 NASM assembly", "Unix processes/signals", "ELF format"] },
  { group: "Functional programming (coursework)", items: ["TypeScript", "Ramda", "monads (L3/Scheme)"] },
  { group: "Human languages", items: ["Arabic", "Hebrew", "English"] },
] as const;
```

`skillsIndex.ts` normalizes an item to its first significant token (e.g. "Spring Cloud (Eureka, Gateway, OpenFeign)" matches any stack entry starting with "Spring Cloud") and returns the project titles that use it; coursework and language groups are excluded from matching and labeled instead (R7.3).

### 9.5 `seo.ts` (titles and descriptions from §13.2; locked)

```ts
export const seo = {
  home: {
    title: "Faisal Nasir — CS student, Ben-Gurion University",
    description: "Faisal Nasir, CS student at Ben-Gurion University. Projects: a Kafka choreography saga, RAG document Q&A, a multi-agent news pipeline, STOMP alerts, YOLOv5.",
  },
  suffix: " | Faisal Nasir",
  projects: {
    "order-saga": {
      title: "Order-Saga: choreography saga with Spring Boot and Kafka",
      description: "Order processing across five microservices with the Choreography Saga pattern: no central orchestrator, Kafka events, and automatic compensation when a step fails.",
      programmingLanguage: ["Java"],
    },
    "rag-document-qa": {
      title: "rag-document-qa: RAG document Q&A with Spring AI and pgvector",
      description: "Upload documents and ask questions in plain language; answers stream token by token with cited sources. Spring Boot, Spring AI, GPT-4o, PostgreSQL with pgvector.",
      programmingLanguage: ["Java"],
    },
    "tech-news-agent": {
      title: "tech-news-agent: multi-agent news pipeline with Spring AI",
      description: "An orchestrator runs a ReAct loop over five agents to turn a tech topic into a fact-checked LinkedIn post, retrying when confidence is low. Spring AI, GPT-4o-mini.",
      programmingLanguage: ["Java"],
    },
    "emergency-alert-system": {
      title: "Emergency-Alert-System: STOMP pub/sub in Java and C++",
      description: "A STOMP publish-subscribe server in Java 8 with thread-per-client and reactor modes, and a C++11 Boost ASIO client for channel subscription and broadcast.",
      programmingLanguage: ["Java", "C++"],
    },
    "con-detection": {
      title: "con-Detection: YOLOv5 cone detection in Python",
      description: "YOLOv5 run over video frame by frame to detect and box traffic cones, built and run in Google Colab for autonomous-driving and robotics tests.",
      programmingLanguage: ["Python"],
    },
  },
} as const;
```

`lib/seo.ts` appends `seo.suffix` to case-study titles, derives `og:*` and Twitter tags from the same strings, and builds the JSON-LD of §13.3 from `site.ts`, `projects.ts`, and this file. The content check (R15) covers this file like any other.

---

## 10. Responsive behavior

Breakpoints: 640, 768, 1024, 1280. Below 1024 the hero and project sections become one column with the screen after the text. Below 768 screens use `scene.narrow` and horizontal control rows; targets ≥ 44px (R11.3). SVG scales through `viewBox`; labels use fixed pixel sizes inside SVG and are re-laid in the narrow scene rather than shrunk. The trilingual name wraps to its own lines below 640.

---

## 11. Accessibility

WCAG 2.2 AA (R12). Landmarks and a single h1; every screen is a `figure` with an accessible name and a narration list; live announcements are polite and rate-limited to one per step; focus is never moved except by the hero-map jump (R2.5) and skip link; the mode toggle uses `aria-pressed`; the copy button announces "Copied"; Arabic and Hebrew spans carry `lang="ar"` / `lang="he"` and `dir="rtl"`; motion respects the OS preference everywhere with the documented opt-in; no element flashes; contrast per §2.1 is verified by axe in every CI run.

---

## 12. Performance

Static export; first load carries the page shell, the hero (including the ASCII layer, which is text), and no screen code. Each screen is a dynamic import (≤ 60 KB gz, R4.10) prefetched when its section is within one viewport. Fonts: four subset files, `size-adjust` fallbacks to prevent shift (R13.4). No images except the build-time OG image. The scheduler runs one rAF loop per *visible* screen; hidden screens hold no timers. Budgets enforced by Lighthouse CI thresholds (R13.1–13.2) and a bundle-size check in CI.

---

## 13. SEO and discoverability

Implements R14. Three jobs, in priority order: own the results page for "Faisal Nasir" alongside LinkedIn and GitHub; make each case-study page findable by its repository name and the technical terms in its README; make every shared link render a correct preview. Nothing here is about volume; a portfolio needs the right dozen visitors, not thousands.

### 13.1 Host, URLs, and indexing

- One site URL, `NEXT_PUBLIC_SITE_URL`, set in the hosting project's environment (the custom domain when chosen; the host's production URL until then). `lib/seo.ts` exposes `absoluteUrl(path)` and every canonical, sitemap entry, `og:url`, and JSON-LD `url` goes through it. Nothing hardcodes a host.
- Redirects: `www` to apex (or the reverse, once, forever) and the host's default `*.vercel.app` production URL to the custom domain, both 301, configured in `vercel.json`. `trailingSlash: false` so `/projects/order-saga` is the only form of each URL.
- Preview deployments: Vercel adds `X-Robots-Tag: noindex` to previews by default; the SEO test (§13.8) asserts the header on a preview URL and asserts its absence on production HTML rather than assuming.
- `robots.ts` allows everything and names the sitemap. `sitemap.ts` lists six URLs with `lastmod` at build time. `not-found.tsx` produces `404.html`, which the host serves with a 404 status.
- `<html lang="en">`; the name spans keep `lang="ar"`/`lang="he"` (R1.3), which also lets a search for the name in Hebrew or Arabic script match the page once the spellings are in.

### 13.2 Page metadata

All strings live in `content/seo.ts` (§9.5) and are locked like everything else; `lib/seo.ts` assembles them into the framework's `Metadata` object. Rules: title within 60 characters before the suffix; description 120–160 characters; the primary term first (name on home, repository name on case studies); the suffix " | Faisal Nasir" on case-study pages so they also surface for name searches.

| Page | Title | Description |
|---|---|---|
| Home | Faisal Nasir — CS student, Ben-Gurion University | Faisal Nasir, CS student at Ben-Gurion University. Projects: a Kafka choreography saga, RAG document Q&A, a multi-agent news pipeline, STOMP alerts, YOLOv5. |
| Order-Saga | Order-Saga: choreography saga with Spring Boot and Kafka \| Faisal Nasir | Order processing across five microservices with the Choreography Saga pattern: no central orchestrator, Kafka events, and automatic compensation when a step fails. |
| rag-document-qa | rag-document-qa: RAG document Q&A with Spring AI and pgvector \| Faisal Nasir | Upload documents and ask questions in plain language; answers stream token by token with cited sources. Spring Boot, Spring AI, GPT-4o, PostgreSQL with pgvector. |
| tech-news-agent | tech-news-agent: multi-agent news pipeline with Spring AI \| Faisal Nasir | An orchestrator runs a ReAct loop over five agents to turn a tech topic into a fact-checked LinkedIn post, retrying when confidence is low. Spring AI, GPT-4o-mini. |
| Emergency-Alert-System | Emergency-Alert-System: STOMP pub/sub in Java and C++ \| Faisal Nasir | A STOMP publish-subscribe server in Java 8 with thread-per-client and reactor modes, and a C++11 Boost ASIO client for channel subscription and broadcast. |
| con-Detection | con-Detection: YOLOv5 cone detection in Python \| Faisal Nasir | YOLOv5 run over video frame by frame to detect and box traffic cones, built and run in Google Colab for autonomous-driving and robotics tests. |

Every word in the table traces to a locked summary; the SEO test asserts uniqueness and length.

### 13.3 Structured data

Emitted as `<script type="application/ld+json">` from `lib/seo.ts`, values from `content/*`, validated in CI (§13.8) and once by hand in Google's Rich Results Test before launch.

Home:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Faisal Nasir",
    "url": "<site url>",
    "sameAs": ["https://github.com/nasirfaisal83", "https://www.linkedin.com/in/faisal-nasir-381a33131"],
    "affiliation": { "@type": "CollegeOrUniversity", "name": "Ben-Gurion University of the Negev" },
    "knowsLanguage": ["ar", "he", "en"]
  }
}
```

`alternateName` (the Arabic and Hebrew spellings) is added by `lib/seo.ts` only when the placeholders are gone. A second block declares `WebSite` with `name` and `url`. No `jobTitle`, no `worksFor`, no `alumniOf`: none is a stated fact.

Each case-study page:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "Order-Saga",
  "description": "<locked summary>",
  "codeRepository": "https://github.com/nasirfaisal83/Order-Saga",
  "programmingLanguage": "Java",
  "author": { "@type": "Person", "name": "Faisal Nasir", "url": "<site url>" }
}
```

plus a `BreadcrumbList` (Home, Projects, the repository name). `programmingLanguage` per project: Java; Java; Java; Java and C++; Python.

### 13.4 Indexable content

The case-study prose is what lets a project page rank for anything beyond its name, and it is also the place where a copy of the README would hurt: GitHub already ranks for that text, so a mirror is a duplicate. Rules:

- At least 300 words per page across "What it does", "How it works", and "Design decisions", written as a case study (problem, shape of the solution, the decisions and why), paraphrased from the README with its structure changed. No copied code blocks; one short identifier inline is fine.
- Headings name the real concept from the README, so they match the queries an engineer would type. Examples per page: Order-Saga, "How five services coordinate without an orchestrator" and "What happens when a payment fails"; rag-document-qa, "Why ingestion is asynchronous", "How a scanned page still gets text", "How answers stream token by token"; tech-news-agent, "How the orchestrator decides to retry"; Emergency-Alert-System, "Thread-per-client versus reactor"; con-Detection, "Running YOLOv5 over a video frame by frame".
- Screen narrations (`ScreenText`) render in the static HTML for every screen on every page, so the described architecture is indexable even though the SVG is `aria-hidden`.
- No page exists for SEO alone; the six URLs are the whole site.

### 13.5 Internal linking

The home page links to each case study with the repository name as anchor text ("Read the case study" is replaced by "Read the Order-Saga case study"). Each case-study page carries a breadcrumb (Home, Projects, name), "View on GitHub", and "Previous project" / "Next project" links by name in the order of §5.2, wrapping at the ends. The footer links home. No `nofollow` anywhere; outbound links to GitHub are the point.

### 13.6 Share images

One image per page, 1200 × 630, generated at build time. `--screen` background, the 8 px grid at 6 %, the name (home) or repository name (case study) in Plex Mono at 96 px in `--screen-ink` at left, and the static hero map or that screen's default-scenario end state at right in `--signal`; the site URL in Plex Sans at 40 px at bottom left. Nothing under 40 px. Under 300 KB as PNG. Generated by `app/opengraph-image.tsx` and `app/projects/[slug]/opengraph-image.tsx` with `generateStaticParams`; if the framework cannot render image routes in the static export, a `scripts/og.ts` pre-render (satori + resvg) writes `public/og/*.png` and metadata points at those files instead. Twitter card `summary_large_image` reuses the same image.

### 13.7 The name results page

Google builds an entity for a person from consistent, mutually linking pages. Three links close the loop, and only the owner can make them:

1. LinkedIn profile, website field → the canonical site URL.
2. GitHub profile, website field → the canonical site URL.
3. The site's `Person.sameAs` → LinkedIn and GitHub (§13.3).

The display name must read "Faisal Nasir" on all three. On launch day: verify the site in Google Search Console (DNS record or the HTML meta tag route), submit the sitemap, request indexing for the six URLs. If Hasoub publishes a page that lists its community managers, ask for a link from it; otherwise nothing. No directories, no link exchanges.

### 13.8 The SEO test suite (CI)

A Playwright spec over the built `out/` directory, run on every pull request:

- every page has exactly one `h1`, one `<title>`, one meta description, one canonical that equals `absoluteUrl(path)`;
- titles and descriptions are unique across the six pages and within the length rules;
- no production page contains `noindex`; a preview URL returns `X-Robots-Tag: noindex`;
- every JSON-LD block parses and has its required properties; `sameAs` contains both profile URLs;
- `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, and `twitter:card` are present, and each `og:image` resolves to a 1200 × 630 file under 300 KB;
- `sitemap.xml` lists exactly six URLs and `robots.txt` names it;
- each case-study page has at least 300 words in `main` outside the screens, links home, links its repository, and links previous and next.

### 13.9 Measurement

Search Console is the only instrument, and it needs no script on the page. Thirty days after launch, and monthly after: the query "Faisal Nasir" (position, impressions, clicks), each repository name as a query, Page indexing coverage, and the Core Web Vitals report (field data, which Lighthouse cannot give). Each finding becomes a task. Analytics remains P2 (R17) and is not required for any of this.

### 13.10 Not doing

Hidden text, keyword-stuffed headings, generated filler pages, paid or exchanged links, a blog for the sake of freshness, `hreflang` before a localized version exists, and any claim in titles, descriptions, or structured data beyond PRD v2 and the READMEs (R15).

---

## 14. Error handling and edge cases

- Missing `public/resume.pdf`: build warning; all "Download resume" controls hidden (R9.3).
- Placeholder remaining: `scripts/content-check.ts` exits non-zero in production builds and prints the token and file (R15.2).
- Project set changed: the same script asserts the five slugs (R15.3).
- Screen runtime error: `ScreenBoundary` static fallback; page unaffected (R4.8).
- JavaScript disabled: server-rendered first frames, all text, working links; controls hidden with a note "Turn on JavaScript to run the scenarios".
- Slow device (`navigator.hardwareConcurrency < 4` or `saveData`): packet trails off, concurrent packets capped at 3.
- Deep link to a case study with the hero flag unset: no hero sequence runs on that route; the flag is set on the home route only.
- Preview deployment reached by a crawler: `noindex` is present (§13.1); the SEO test fails the build if production HTML ever carries it.
- Site URL not configured: the build fails with a message naming `NEXT_PUBLIC_SITE_URL`, rather than emitting relative canonicals or `localhost`.
- Share image route unsupported by the static export: `scripts/og.ts` pre-renders the six images and metadata points at `public/og/*.png` (§13.6).

---

## 15. Testing strategy

- **Unit (Vitest):** `useScenario` step ordering, pause/resume elapsed math, queueing beyond 6 packets, reduced-motion stepping; `skillsIndex` matching; `content-check` failure cases.
- **Component (Testing Library):** `Screen` renders narration and controls; `CopyButton` copies and announces; hero hides placeholder spans; Experience omits dates when placeholder.
- **End to end (Playwright):** home loads and passes axe; nav underline follows scroll; each screen's each scenario changes the expected status chip text; case-study deep links; back/forward; keyboard-only traversal of every control; `emulateMedia({ reducedMotion: "reduce" })` renders end states with no packets; 360 px viewport has no horizontal overflow.
- **Visual:** Playwright screenshots of every screen's final state per scenario, wide and narrow.
- **Performance:** Lighthouse CI mobile, four categories ≥ 90; bundle-size assertion.

---

## 16. Deployment

GitHub repository (public recommended: the site then doubles as a sixth demonstration of front-end and motion work). GitHub Actions on pull request: install, lint, type-check, unit, build with content check, Playwright, Lighthouse CI; Vercel preview deploy. On merge to `main`: production deploy. Custom domain when chosen; HTTPS by default.

---

## 17. Decisions made here, and inputs still open

Resolved from the PRD: site stack (Next.js + Motion, static export), visual direction (§1–§4), project ordering (§5.2), case-study pages included (P1), single theme at launch, no analytics at launch, SEO scope (§13: one canonical host, per-page locked metadata, ProfilePage/Person and SoftwareSourceCode structured data, per-page share images, Search Console as the only instrument).

Still Faisal's: `TODO_TAGLINE`, `TODO_NAME_AR`, `TODO_NAME_HE`, `TODO_DATES`, `public/resume.pdf`, domain, `NEXT_PUBLIC_SITE_URL`, Search Console access, and the LinkedIn and GitHub website fields — see `requirements.md` §5 and R14.23–24.
