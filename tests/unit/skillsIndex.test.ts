/**
 * tests/unit/skillsIndex.test.ts
 * Verifies that skill items map to the correct project titles.
 * Design §3.5 / R7.3
 */

import { describe, it, expect } from "vitest";
import { buildSkillsIndex } from "@/lib/skillsIndex";

describe("buildSkillsIndex", () => {
  it('maps "Spring Cloud (Eureka, Gateway, OpenFeign)" to Order-Saga', () => {
    const index = buildSkillsIndex("Backend", [
      "Spring Cloud (Eureka, Gateway, OpenFeign)",
    ]);
    const result = index.get("Spring Cloud (Eureka, Gateway, OpenFeign)");
    expect(result?.projectTitles).toContain("Order-Saga");
  });

  it('maps "Apache Kafka" to Order-Saga', () => {
    const index = buildSkillsIndex("Messaging & infra", ["Apache Kafka"]);
    const result = index.get("Apache Kafka");
    expect(result?.projectTitles).toContain("Order-Saga");
  });

  it('maps "YOLOv5 object detection" to con-Detection', () => {
    const index = buildSkillsIndex("AI/LLM engineering", [
      "YOLOv5 object detection",
    ]);
    const result = index.get("YOLOv5 object detection");
    expect(result?.projectTitles).toContain("con-Detection");
  });

  it('maps "Retrieval-Augmented Generation (pgvector)" to rag-document-qa', () => {
    const index = buildSkillsIndex("AI/LLM engineering", [
      "Retrieval-Augmented Generation (pgvector)",
    ]);
    const result = index.get("Retrieval-Augmented Generation (pgvector)");
    expect(result?.projectTitles).toContain("rag-document-qa");
  });

  it("labels human language items with their group instead of project titles", () => {
    const index = buildSkillsIndex("Human languages", ["Arabic", "Hebrew"]);
    expect(index.get("Arabic")?.groupLabel).toBe("Human languages");
    expect(index.get("Arabic")?.projectTitles).toHaveLength(0);
  });

  it("labels coursework items with their group", () => {
    const index = buildSkillsIndex("Systems programming (coursework)", ["C"]);
    expect(index.get("C")?.groupLabel).toBe("Systems programming (coursework)");
  });

  it("returns empty projectTitles for skills with no matching project", () => {
    const index = buildSkillsIndex("Backend", ["Some Unknown Framework"]);
    expect(index.get("Some Unknown Framework")?.projectTitles).toHaveLength(0);
  });
});
