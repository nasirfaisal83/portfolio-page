// src/lib/skillsIndex.ts
// Computes which projects use each skill, for the hover/focus caption in the Skills section.
// Matching is case-insensitive on the first significant token of each skill item.

import { projects, type Project } from "@/content/projects";

// Groups that are coursework or human languages — these show their group label instead of project names
const LABEL_GROUPS = new Set([
  "Systems programming (coursework)",
  "Functional programming (coursework)",
  "Human languages",
]);

/**
 * Extract the significant matching key from a skill or stack entry:
 * strip parentheticals and version numbers, lowercase, trim.
 * "Spring Cloud (Eureka, Gateway, OpenFeign)" → "spring cloud"
 * "Apache Kafka 7.5.0" → "apache kafka"
 * "YOLOv5 object detection" → "yolov5 object detection"
 */
function normalize(item: string): string {
  return item
    .toLowerCase()
    .replace(/\s*\(.*$/, "") // drop parentheticals
    .replace(/\s+[\d.]+.*$/, "") // drop trailing version numbers
    .trim();
}

/**
 * The lead token is the first significant word of a skill, used to match
 * against a stack entry even when the skill name is longer than the entry.
 * "YOLOv5 object detection" → "yolov5"; "Retrieval-Augmented Generation" → "retrieval-augmented"
 */
function leadToken(item: string): string {
  return normalize(item).split(/\s+/)[0] ?? "";
}

/**
 * Extract distinctive tokens from a skill: its lead token plus any
 * technology names inside parentheses (e.g. "pgvector", "ReAct pattern").
 */
function skillTokens(skill: string): string[] {
  const tokens: string[] = [leadToken(skill)];
  const paren = skill.match(/\(([^)]*)\)/);
  if (paren) {
    for (const part of paren[1].split(",")) {
      const t = normalize(part).split(/\s+/)[0];
      if (t.length > 2) tokens.push(t);
    }
  }
  return tokens.filter((t) => t.length > 2);
}

/** Check if a project's stack matches a given skill via prefix or token match. */
function stackIncludes(project: Project, skill: string): boolean {
  const normSkill = normalize(skill);
  const tokens = skillTokens(skill);
  return project.stack.some((s) => {
    const normStack = normalize(s);
    const stackLead = leadToken(s);
    if (normStack.startsWith(normSkill) || normSkill.startsWith(normStack)) return true;
    // Match if any distinctive skill token equals the stack lead token,
    // or appears anywhere in the stack entry.
    return tokens.some((t) => stackLead === t || normStack.includes(t));
  });
}

export interface SkillCaption {
  /** Project titles that use this skill, or [] if none */
  projectTitles: string[];
  /** Group label for coursework/language items */
  groupLabel?: string;
}

/** Build an index: skill item → { projectTitles } or { groupLabel } */
export function buildSkillsIndex(groupLabel: string, items: readonly string[]): Map<string, SkillCaption> {
  const map = new Map<string, SkillCaption>();
  const isLabel = LABEL_GROUPS.has(groupLabel);

  for (const item of items) {
    if (isLabel) {
      map.set(item, { projectTitles: [], groupLabel });
    } else {
      const titles = projects
        .filter((p) => stackIncludes(p, item))
        .map((p) => p.title);
      map.set(item, { projectTitles: titles });
    }
  }

  return map;
}
