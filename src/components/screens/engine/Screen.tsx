"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ScreenControls } from "./ScreenControls";
import { ScreenText } from "./ScreenText";
import type { Scenario, ScenarioControls, ScenarioState } from "./types";

interface ScreenProps {
  /** Repository name shown in the title strip */
  repoName: string;
  /** One-sentence summary for the aria-label */
  summary: string;
  scenarios: Scenario[];
  state: ScenarioState & ScenarioControls;
  children: React.ReactNode;
  /** Aspect ratio (w/h) for the SVG container — defaults to 720/400 = 1.8 */
  aspectRatio?: number;
}

/**
 * Screen chrome: 6px radius dark container, title strip, controls row,
 * "Show as text" toggle, accessible figure wrapper, autoplay-once on inView.
 */
export function Screen({
  repoName,
  summary,
  scenarios,
  state,
  children,
  aspectRatio = 720 / 400,
}: ScreenProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [showText, setShowText] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayedRef = useRef(false);

  const activeScenario = scenarios.find((s) => s.id === state.scenarioId);

  // Expose motion override to useScenario
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (state.play as any).__setMotionOverride;
    if (typeof fn === "function") fn(motionOverride);
  }, [motionOverride, state.play]);

  // Autoplay once when ≥ 50% visible
  useEffect(() => {
    if (!containerRef.current || !scenarios.length) return;
    const defaultScenario = scenarios[0];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoplayedRef.current) {
          autoplayedRef.current = true;
          state.play(defaultScenario.id);
        }
        // Pause when leaving viewport
        if (!entry.isIntersecting && state.isPlaying) {
          state.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarios]);

  return (
    <figure
      ref={containerRef}
      role="group"
      aria-label={`${repoName}: ${summary}`}
      style={{
        backgroundColor: "var(--screen)",
        borderRadius: "var(--radius-screen)",
        border: "1px solid var(--hairline)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        padding: "12px 14px 14px",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Title strip */}
      <div
        className="type-identifier mb-2 shrink-0"
        style={{ color: "var(--screen-muted)" }}
        aria-hidden="true"
      >
        {repoName}
      </div>

      {/* SVG canvas area */}
      <div
        style={{ position: "relative", width: "100%", paddingBottom: `${(1 / aspectRatio) * 100}%` }}
      >
        <div
          style={{ position: "absolute", inset: 0 }}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>

      {/* No-JS note — hidden when JS is active */}
      <noscript>
        <p
          className="type-caption mt-2"
          style={{ color: "var(--screen-muted)" }}
        >
          Turn on JavaScript to run the scenarios.
        </p>
      </noscript>

      {/* Controls */}
      <ScreenControls
        scenarios={scenarios}
        activeId={state.scenarioId}
        isPlaying={state.isPlaying}
        onPlay={state.play}
        onPause={state.pause}
        showText={showText}
        onToggleText={() => setShowText((v) => !v)}
        reducedMotion={prefersReducedMotion}
        motionOverride={motionOverride}
        onToggleMotion={() => setMotionOverride((v) => !v)}
      />

      {/* Text alternative */}
      <ScreenText
        narrationLines={state.narrationLines}
        activeScenarioLabel={activeScenario?.label}
        visible={showText}
        ariaLabel={`${repoName} scenario narration`}
      />
    </figure>
  );
}
