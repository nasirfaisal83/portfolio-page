"use client";

import type { Scenario } from "./types";

interface ScreenControlsProps {
  scenarios: Scenario[];
  activeId: string | null;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onPause: () => void;
  showText: boolean;
  onToggleText: () => void;
  reducedMotion?: boolean;
  motionOverride?: boolean;
  onToggleMotion?: () => void;
}

/** Scenario control buttons — ≥ 44px tall on touch, keyboard operable. */
export function ScreenControls({
  scenarios,
  activeId,
  isPlaying,
  onPlay,
  onPause,
  showText,
  onToggleText,
  reducedMotion,
  motionOverride,
  onToggleMotion,
}: ScreenControlsProps) {
  return (
    <div
      role="group"
      aria-label="Scenario controls"
      className="flex flex-wrap gap-2 mt-3"
      style={{ overflowX: "auto", minHeight: "44px" }}
    >
      {scenarios.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            if (activeId === s.id && isPlaying) onPause();
            else onPlay(s.id);
          }}
          aria-pressed={activeId === s.id}
          className="type-identifier px-3 shrink-0"
          style={{
            minHeight: "44px",
            minWidth: "44px",
            backgroundColor: activeId === s.id ? "var(--signal)" : "var(--screen-muted)",
            color: activeId === s.id ? "var(--screen)" : "var(--screen-ink)",
            border: "none",
            borderRadius: "var(--radius-control)",
            cursor: "pointer",
            opacity: 1,
            transition: "background-color var(--t-hover), color var(--t-hover)",
          }}
        >
          {activeId === s.id && isPlaying ? "⏸ " : ""}
          {s.label}
        </button>
      ))}

      {/* Show as text toggle */}
      <button
        onClick={onToggleText}
        aria-pressed={showText}
        className="type-identifier px-3 shrink-0"
        style={{
          minHeight: "44px",
          minWidth: "44px",
          backgroundColor: showText ? "var(--signal-deep)" : "transparent",
          color: showText ? "var(--vellum)" : "var(--screen-muted)",
          border: `1px solid var(--screen-muted)`,
          borderRadius: "var(--radius-control)",
          cursor: "pointer",
          transition: "background-color var(--t-hover), color var(--t-hover)",
        }}
      >
        Show as text
      </button>

      {/* Play with motion (shown when reduced-motion is active) */}
      {reducedMotion && onToggleMotion && (
        <button
          onClick={onToggleMotion}
          aria-pressed={motionOverride}
          className="type-identifier px-3 shrink-0"
          style={{
            minHeight: "44px",
            minWidth: "44px",
            backgroundColor: "transparent",
            color: "var(--screen-muted)",
            border: `1px solid var(--screen-muted)`,
            borderRadius: "var(--radius-control)",
            cursor: "pointer",
          }}
        >
          Play with motion
        </button>
      )}
    </div>
  );
}
