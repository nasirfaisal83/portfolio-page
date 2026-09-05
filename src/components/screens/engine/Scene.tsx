"use client";

import React from "react";

interface SceneProps {
  viewBox: [number, number];
  children: React.ReactNode;
}

/** SVG canvas with the 8px dot-grid used by all screens. */
export function Scene({ viewBox, children }: SceneProps) {
  const [w, h] = viewBox;
  const patternId = React.useId();

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      className="w-full h-full overflow-visible"
      style={{ display: "block" }}
    >
      {/* 8 px dot grid at 6 % screen-muted opacity */}
      <defs>
        <pattern id={patternId} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.5" fill="var(--screen-muted)" opacity="0.6" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#${patternId})`} />
      {children}
    </svg>
  );
}
