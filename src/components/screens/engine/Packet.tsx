"use client";
"use client";

import { useEffect, useRef, useState } from "react";
import type { InFlightPacket } from "./types";

interface PacketProps {
  packet: InFlightPacket;
  getEdgePath: (edgeId: string) => SVGPathElement | null;
}

/** A moving packet that travels along its edge path. */
export function Packet({ packet, getEdgePath }: PacketProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [trail1, setTrail1] = useState<{ x: number; y: number } | null>(null);
  const [trail2, setTrail2] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const path = getEdgePath(packet.edge);
    if (!path) return;
    const totalLen = path.getTotalLength();

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const t = Math.min((ts - startRef.current) / packet.duration, 1);
      // ease in-out
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const pt = path.getPointAtLength(eased * totalLen);
      const pt1 = path.getPointAtLength(Math.max(0, eased * totalLen - 6));
      const pt2 = path.getPointAtLength(Math.max(0, eased * totalLen - 12));

      setPos({ x: pt.x, y: pt.y });
      setTrail1({ x: pt1.x, y: pt1.y });
      setTrail2({ x: pt2.x, y: pt2.y });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [packet, getEdgePath]);

  if (!pos) return null;

  const color = packet.tone === "fault" ? "var(--fault)" : "var(--signal)";

  return (
    <g>
      {/* Ghost trail 2 — 15% opacity */}
      {trail2 && (
        <circle cx={trail2.x} cy={trail2.y} r="3" fill={color} opacity="0.15" />
      )}
      {/* Ghost trail 1 — 40% opacity */}
      {trail1 && (
        <circle cx={trail1.x} cy={trail1.y} r="3.5" fill={color} opacity="0.4" />
      )}
      {/* Main packet — 8px circle, 2px screen stroke */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r="4"
        fill={color}
        stroke="var(--screen)"
        strokeWidth="2"
      />
      {/* Label above in identifier style */}
      {packet.label && (
        <text
          x={pos.x}
          y={pos.y - 10}
          textAnchor="middle"
          fill={color}
          fontSize="10"
          fontFamily="var(--font-plex-mono), monospace"
        >
          {packet.label}
        </text>
      )}
    </g>
  );
}
