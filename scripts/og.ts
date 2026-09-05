#!/usr/bin/env ts-node
/**
 * scripts/og.ts
 * Pre-renders 6 OG share images (1200×630) using satori + @resvg/resvg-js.
 * Writes to public/og/{home,order-saga,rag-document-qa,tech-news-agent,
 *   emergency-alert-system,con-detection}.png
 *
 * Run automatically via the "preog" script or manually: ts-node scripts/og.ts
 * Called from prebuild when NEXT_PUBLIC_SITE_URL is set.
 *
 * Design spec §13.6:
 *   - 1200×630, under 300 KB
 *   - --screen background, 8px grid at 6%
 *   - Name/repo name in Plex Mono at 96px left
 *   - Site URL at bottom-left in Plex Sans 40px
 *   - No text smaller than 40px
 */

import * as fs from "fs";
import * as path from "path";

// We use satori + @resvg/resvg-js at runtime.
// If not installed, skip silently with a warning.
async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let satori: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resvg: any;

  try {
    // Dynamic imports — satori and @resvg/resvg-js are optional dev deps
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    satori = (require("satori") as any).default ?? require("satori");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    resvg = require("@resvg/resvg-js");
  } catch {
    console.warn(
      "og.ts: satori or @resvg/resvg-js not installed — skipping OG image generation.\n" +
        "Install with: npm install --save-dev satori @resvg/resvg-js"
    );
    return;
  }

  const root = path.resolve(__dirname, "..");
  const outDir = path.join(root, "public", "og");
  fs.mkdirSync(outDir, { recursive: true });

  // Load IBM Plex Mono Regular for satori (requires the font file)
  // We fall back to a placeholder SVG if fonts are unavailable.
  let fontData: Buffer | null = null;
  const fontPath = path.join(
    root,
    "node_modules",
    "@fontsource",
    "ibm-plex-mono",
    "files",
    "ibm-plex-mono-latin-400-normal.woff"
  );
  if (fs.existsSync(fontPath)) {
    fontData = fs.readFileSync(fontPath);
  } else {
    console.warn(
      "og.ts: IBM Plex Mono font file not found at " +
        fontPath +
        "\nInstall @fontsource/ibm-plex-mono for correct OG fonts."
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const displayUrl = siteUrl.replace(/^https?:\/\//, "");

  const pages: { id: string; name: string }[] = [
    { id: "home", name: "Faisal Nasir" },
    { id: "order-saga", name: "Order-Saga" },
    { id: "rag-document-qa", name: "rag-document-qa" },
    { id: "tech-news-agent", name: "tech-news-agent" },
    { id: "emergency-alert-system", name: "Emergency-Alert-System" },
    { id: "con-detection", name: "con-Detection" },
  ];

  const fonts = fontData
    ? [{ name: "IBM Plex Mono", data: fontData, weight: 400 as const, style: "normal" as const }]
    : [];

  for (const page of pages) {
    // Build a minimal JSX-like element tree (satori accepts React-compatible objects)
    const element = {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
          backgroundColor: "#0F1B2D",
          padding: 64,
          fontFamily: fontData ? "IBM Plex Mono" : "monospace",
          position: "relative" as const,
          overflow: "hidden" as const,
        },
        children: [
          // Main name / repo
          {
            type: "div",
            props: {
              style: {
                fontSize: 80,
                color: "#E6EDF3",
                fontWeight: 400,
                lineHeight: 1.1,
                maxWidth: 900,
              },
              children: page.name,
            },
          },
          // Bottom row: subtitle + URL
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { fontSize: 40, color: "#35D0C8" },
                    children: page.id === "home" ? "CS student, Ben-Gurion University" : "Faisal Nasir",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: 40, color: "#7A8BA0" },
                    children: displayUrl,
                  },
                },
              ],
            },
          },
        ],
      },
    };

    try {
      const svg = await satori(element, {
        width: 1200,
        height: 630,
        fonts,
      });

      const renderer = new resvg.Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
      const pngData = renderer.render();
      const pngBuffer = pngData.asPng();

      const outPath = path.join(outDir, `${page.id}.png`);
      fs.writeFileSync(outPath, pngBuffer);

      const kb = Math.round(pngBuffer.byteLength / 1024);
      console.log(`  ✓ ${page.id}.png — ${kb} KB`);

      if (kb > 300) {
        console.warn(`  ⚠ ${page.id}.png exceeds 300 KB limit (${kb} KB)`);
      }
    } catch (err) {
      console.error(`  ✗ Failed to generate ${page.id}.png:`, err);
    }
  }

  console.log("\nog.ts: OG image generation complete.");
}

main().catch((err) => {
  console.error("og.ts: fatal error", err);
  process.exit(1);
});
