"use client";

import type { NodeState } from "./types";

interface NodeProps {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  state?: NodeState;
}

const DEFAULT_W = 120;
const DEFAULT_H = 40;

/** A rectangular node with label and optional StatusChip. */
export function Node({ x, y, w = DEFAULT_W, h = DEFAULT_H, label, state }: NodeProps) {
  const tone = state?.tone ?? "idle";
  const strokeColor =
    tone === "signal"
      ? "var(--signal)"
      : tone === "fault"
      ? "var(--fault)"
      : "var(--screen-muted)";
  const strokeWidth = tone !== "idle" ? 2 : 1;

  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect
        width={w}
        height={h}
        rx="3"
        fill="var(--screen)"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        style={{ transition: "stroke var(--t-status), stroke-width var(--t-status)" }}
      />
      {/* Node label */}
      <text
        x={w / 2}
        y={state?.status ? h / 2 - 6 : h / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--screen-ink)"
        fontSize="13"
        fontFamily="var(--font-plex-sans), sans-serif"
      >
        {label}
      </text>
      {/* Status chip */}
      {state?.status && (
        <text
          x={w / 2}
          y={h / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={tone === "fault" ? "var(--fault)" : tone === "signal" ? "var(--signal)" : "var(--screen-muted)"}
          fontSize="11"
          fontFamily="var(--font-plex-mono), monospace"
          style={{ transition: "fill var(--t-status)" }}
        >
          {state.status}
        </text>
      )}
    </g>
  );
}
