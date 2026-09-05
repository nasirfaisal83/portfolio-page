"use client";

import { useState } from "react";
import { skills } from "@/content/skills";
import { buildSkillsIndex } from "@/lib/skillsIndex";

export function Skills() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <section
      id="skills"
      aria-labelledby="heading-skills"
      style={{ padding: "var(--section-padding) 0" }}
    >
      <h2 id="heading-skills" className="type-h2 mb-10" style={{ maxWidth: "none" }}>
        Skills
      </h2>

      <div className="flex flex-col gap-10">
        {skills.map(({ group, items }) => {
          const index = buildSkillsIndex(group, items);

          return (
            <div key={group}>
              <h3
                className="type-body-em mb-3"
                style={{ color: "var(--graphite)", maxWidth: "none" }}
              >
                {group}
              </h3>

              {/* Inline list separated by hairline dividers */}
              <div className="flex flex-wrap gap-0" role="list">
                {items.map((item, i) => {
                  const caption = index.get(item);
                  const isActive = activeItem === `${group}::${item}`;
                  const isOtherActive = activeItem !== null && !isActive;

                  return (
                    <div key={item} role="listitem" className="flex items-center">
                      {i > 0 && (
                        <span
                          aria-hidden="true"
                          style={{
                            display: "inline-block",
                            width: "1px",
                            height: "14px",
                            backgroundColor: "var(--hairline)",
                            margin: "0 10px",
                          }}
                        />
                      )}
                      <button
                        onClick={() =>
                          setActiveItem(isActive ? null : `${group}::${item}`)
                        }
                        onMouseEnter={() => setActiveItem(`${group}::${item}`)}
                        onMouseLeave={() => setActiveItem(null)}
                        onFocus={() => setActiveItem(`${group}::${item}`)}
                        onBlur={() => setActiveItem(null)}
                        className="type-body"
                        aria-label={
                          caption?.projectTitles.length
                            ? `${item} — used in ${caption.projectTitles.join(", ")}`
                            : caption?.groupLabel
                            ? `${item} — ${caption.groupLabel}`
                            : item
                        }
                        style={{
                          background: "none",
                          border: "none",
                          padding: "2px 0",
                          cursor: "pointer",
                          color: isOtherActive ? "var(--graphite)" : "var(--ink)",
                          transition: "color var(--t-hover)",
                          textAlign: "left",
                        }}
                      >
                        {item}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Caption — "Used in …" or group label */}
              {activeItem?.startsWith(`${group}::`) && (
                <p
                  className="type-caption mt-2"
                  style={{ color: "var(--graphite)" }}
                  aria-live="polite"
                >
                  {(() => {
                    const itemName = activeItem.split("::")[1];
                    const caption = index.get(itemName);
                    if (!caption) return null;
                    if (caption.groupLabel) return caption.groupLabel;
                    if (caption.projectTitles.length > 0)
                      return `Used in ${caption.projectTitles.join(", ")}`;
                    return null;
                  })()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
