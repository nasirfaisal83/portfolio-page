"use client";

interface BusProps {
  x: number;
  y: number;
  width: number;
  height?: number;
  label: string;
  topicLabels?: string[];
  orientation?: "horizontal" | "vertical";
}

/** A bus (Kafka, etc.) rendered as a band with a label. */
export function Bus({
  x,
  y,
  width,
  height = 6,
  label,
  topicLabels = [],
  orientation = "horizontal",
}: BusProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <g>
      {isHorizontal ? (
        <rect
          x={x}
          y={y - height / 2}
          width={width}
          height={height}
          fill="var(--screen-muted)"
          rx="2"
          opacity="0.5"
        />
      ) : (
        <rect
          x={x - height / 2}
          y={y}
          width={height}
          height={width}
          fill="var(--screen-muted)"
          rx="2"
          opacity="0.5"
        />
      )}

      {/* Bus label */}
      {isHorizontal ? (
        <text
          x={x + 8}
          y={y - height / 2 - 4}
          fill="var(--signal)"
          fontSize="11"
          fontFamily="var(--font-plex-mono), monospace"
        >
          {label}
        </text>
      ) : (
        <text
          x={x - height / 2 - 4}
          y={y + 8}
          fill="var(--signal)"
          fontSize="11"
          fontFamily="var(--font-plex-mono), monospace"
          writingMode="vertical-rl"
          transform={`rotate(-90, ${x - height / 2 - 4}, ${y + 8})`}
        >
          {label}
        </text>
      )}

      {/* Topic labels */}
      {topicLabels.map((topic, i) => (
        <text
          key={topic}
          x={isHorizontal ? x + 40 + i * 100 : x + height / 2 + 4}
          y={isHorizontal ? y + height / 2 + 12 : y + 20 + i * 80}
          fill="var(--screen-muted)"
          fontSize="10"
          fontFamily="var(--font-plex-mono), monospace"
        >
          {topic}
        </text>
      ))}
    </g>
  );
}
