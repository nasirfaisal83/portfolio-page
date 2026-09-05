"use client";

interface StatusChipProps {
  x: number;
  y: number;
  value: string;
  tone?: "idle" | "signal" | "fault";
}

/** Inline status chip — identifier text on a 1px outline. Transitions in 300ms. */
export function StatusChip({ x, y, value, tone = "idle" }: StatusChipProps) {
  const color =
    tone === "signal"
      ? "var(--signal)"
      : tone === "fault"
      ? "var(--fault)"
      : "var(--screen-muted)";

  const padX = 6;
  const padY = 3;
  const fontSize = 11;
  // Approximate text width — SVG text length varies; use a fixed estimate
  const approxWidth = value.length * 6.5 + padX * 2;
  const approxHeight = fontSize + padY * 2;

  return (
    <g
      transform={`translate(${x - approxWidth / 2}, ${y - approxHeight / 2})`}
      style={{ transition: `opacity var(--t-status)` }}
    >
      <rect
        width={approxWidth}
        height={approxHeight}
        rx="2"
        fill="none"
        stroke={color}
        strokeWidth="1"
        style={{ transition: "stroke var(--t-status)" }}
      />
      <text
        x={approxWidth / 2}
        y={approxHeight / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={fontSize}
        fontFamily="var(--font-plex-mono), monospace"
        style={{ transition: "fill var(--t-status)" }}
      >
        {value}
      </text>
    </g>
  );
}
