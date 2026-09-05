"use client";

interface GaugeProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  value: number;      // 0–1
  threshold?: number; // e.g. 0.6
  label?: string;
}

/** Horizontal bar gauge with threshold tick. Fault tone when value < threshold. */
export function Gauge({ x, y, width = 80, height = 10, value, threshold = 0.6, label }: GaugeProps) {
  const belowThreshold = value < threshold;
  const fillColor = belowThreshold ? "var(--fault)" : "var(--signal)";
  const fillWidth = Math.round(value * width);
  const thresholdX = Math.round(threshold * width);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Track */}
      <rect width={width} height={height} rx="2" fill="var(--screen-muted)" opacity="0.3" />
      {/* Fill */}
      <rect
        width={fillWidth}
        height={height}
        rx="2"
        fill={fillColor}
        style={{ transition: "width var(--t-status), fill var(--t-status)" }}
      />
      {/* Threshold tick */}
      {threshold !== undefined && (
        <line
          x1={thresholdX}
          y1={-2}
          x2={thresholdX}
          y2={height + 2}
          stroke="var(--screen-ink)"
          strokeWidth="1.5"
        />
      )}
      {/* Label */}
      {label && (
        <text
          x={width / 2}
          y={height + 12}
          textAnchor="middle"
          fill="var(--screen-muted)"
          fontSize="10"
          fontFamily="var(--font-plex-mono), monospace"
        >
          {label}
        </text>
      )}
    </g>
  );
}
