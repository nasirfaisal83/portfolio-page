#!/usr/bin/env ts-node
/**
 * scripts/content-check.ts
 * Pre-build safety guard. Run via `prebuild` in package.json.
 *
 * Fails in production when:
 *   1. Any TODO_ placeholder remains in src/content/*
 *   2. The project slug set differs from the required five
 *
 * Warns (non-fatal) when:
 *   3. public/resume.pdf is missing
 */

import * as fs from "fs";
import * as path from "path";
import { projects } from "../src/content/projects";

const isProduction = process.env.NODE_ENV === "production";
const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "src", "content");
const resumePath = path.join(root, "public", "resume.pdf");

const REQUIRED_SLUGS = new Set([
  "salon-appointment-system",
  "order-saga",
  "rag-document-qa",
  "tech-news-agent",
  "emergency-alert-system",
  "con-detection",
]);

let errors = 0;
let warnings = 0;

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`  ⚠ ${msg}`);
  warnings++;
}

// ----------------------------------------------------------------
// 1. Check for TODO_ placeholders in src/content/*
// ----------------------------------------------------------------
const contentFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith(".ts"));

for (const file of contentFiles) {
  const filePath = path.join(contentDir, file);
  const src = fs.readFileSync(filePath, "utf8");
  const matches = [...src.matchAll(/TODO_[A-Z_]+/g)];
  for (const m of matches) {
    if (isProduction) {
      fail(`Placeholder "${m[0]}" found in src/content/${file}. Replace before building for production.`);
    }
    // In development, silently skip — placeholders are expected while setting up
  }
}

// ----------------------------------------------------------------
// 2. Check project slug set
// ----------------------------------------------------------------
const actualSlugs = new Set(projects.map((p) => p.slug));

for (const required of REQUIRED_SLUGS) {
  if (!actualSlugs.has(required)) {
    fail(`Required project slug "${required}" is missing from src/content/projects.ts.`);
  }
}

for (const actual of actualSlugs) {
  if (!REQUIRED_SLUGS.has(actual)) {
    fail(`Unexpected project slug "${actual}" in src/content/projects.ts. Only the five specified slugs are allowed.`);
  }
}

// ----------------------------------------------------------------
// 3. Check resume.pdf (warning only, non-blocking)
// ----------------------------------------------------------------
if (!fs.existsSync(resumePath)) {
  warn("public/resume.pdf is missing. All 'Download resume' controls will be hidden at runtime.");
  warnings++;
}

// ----------------------------------------------------------------
// Result
// ----------------------------------------------------------------
if (errors > 0) {
  console.error(`\ncontent-check: ${errors} error(s). Build aborted.\n`);
  process.exit(1);
}

if (warnings > 0) {
  console.warn(`\ncontent-check: ${warnings} warning(s). Build continuing.\n`);
}

if (errors === 0 && warnings === 0) {
  console.log("content-check: all checks passed.");
}
