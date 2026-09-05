"use client";

import React, { useRef, useImperativeHandle } from "react";

export interface EdgeHandle {
  getLength(): number;
  getPointAtLength(len: number): DOMPoint;
}

interface EdgeProps {
  id: string;
  d: string;         // SVG path data
  active?: boolean;
  tone?: "signal" | "fault";
  dashed?: boolean;
}

/** An SVG path edge between two nodes. Exposes getLength / getPointAtLength via ref. */
export const Edge = React.forwardRef<EdgeHandle, EdgeProps>(
  ({ d, active = false, tone = "signal", dashed = false }, ref) => {
    const pathRef = useRef<SVGPathElement>(null);

    useImperativeHandle(ref, () => ({
      getLength() {
        return pathRef.current?.getTotalLength() ?? 0;
      },
      getPointAtLength(len: number) {
        return pathRef.current?.getPointAtLength(len) ?? new DOMPoint(0, 0);
      },
    }));

    const stroke = active
      ? tone === "fault"
        ? "var(--fault)"
        : "var(--signal)"
      : "var(--screen-muted)";
    const strokeWidth = active ? 2 : 1.5;

    return (
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "4 4" : undefined}
        style={{ transition: "stroke var(--t-status), stroke-width var(--t-status)" }}
      />
    );
  }
);

Edge.displayName = "Edge";
