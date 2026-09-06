"use client";

import { useEffect, useRef, useState } from "react";

// Project nodes for the hero navigation map.
// Six projects laid out as a hexagon around the central node, in display order.
const HERO_NODES = [
  { id: "portfolio", label: "portfolio",              x: 200, y: 210, slug: null },
  { id: "salon",     label: "Salon Appointment System", x: 200, y: 70,  slug: "salon-appointment-system" },
  { id: "order",     label: "Order-Saga",             x: 326, y: 140, slug: "order-saga" },
  { id: "rag",       label: "rag-document-qa",        x: 326, y: 280, slug: "rag-document-qa" },
  { id: "agents",    label: "tech-news-agent",        x: 200, y: 350, slug: "tech-news-agent" },
  { id: "stomp",     label: "Emergency-Alert-System", x: 74,  y: 280, slug: "emergency-alert-system" },
  { id: "detection", label: "con-Detection",          x: 74,  y: 140, slug: "con-detection" },
] as const;

const HERO_EDGES = [
  { from: "portfolio", to: "salon" },
  { from: "portfolio", to: "order" },
  { from: "portfolio", to: "rag" },
  { from: "portfolio", to: "agents" },
  { from: "portfolio", to: "stomp" },
  { from: "portfolio", to: "detection" },
];

// Ambient packets — a true identifier fragment from each project
const AMBIENT_PACKETS = [
  { edge: 0, label: "SLOT_CONFLICT" },
  { edge: 1, label: "order.created" },
  { edge: 2, label: "event: token" },
  { edge: 3, label: "ScoutAgent" },
  { edge: 4, label: "MESSAGE" },
  { edge: 5, label: "frame 0412" },
];

interface HeroScreenProps {
  opacity: number;
  edgesDrawn: boolean; // drives stroke-dashoffset animation
  onNodeClick: (slug: string) => void;
}

export function HeroScreen({ opacity, edgesDrawn, onNodeClick }: HeroScreenProps) {
  const [packetPos, setPacketPos] = useState<{ x: number; y: number; label: string } | null>(null);
  const packetTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const packetIndexRef = useRef(0);

  // Ambient packet — one at a time, ≤1 per 2.5 s
  useEffect(() => {
    if (!edgesDrawn) return;
    const launch = () => {
      const pkt = AMBIENT_PACKETS[packetIndexRef.current % AMBIENT_PACKETS.length];
      const edge = HERO_EDGES[pkt.edge];
      const from = HERO_NODES.find((n) => n.id === edge.from)!;
      const to = HERO_NODES.find((n) => n.id === edge.to)!;

      let t = 0;
      const dur = 900;
      const step = () => {
        t += 16;
        const prog = Math.min(t / dur, 1);
        const eased = prog < 0.5 ? 2 * prog * prog : -1 + (4 - 2 * prog) * prog;
        setPacketPos({
          x: from.x + (to.x - from.x) * eased,
          y: from.y + (to.y - from.y) * eased,
          label: pkt.label,
        });
        if (prog < 1) requestAnimationFrame(step);
        else setPacketPos(null);
      };
      requestAnimationFrame(step);
      packetIndexRef.current++;
    };

    packetTimerRef.current = setInterval(launch, 2500);
    return () => { if (packetTimerRef.current) clearInterval(packetTimerRef.current); };
  }, [edgesDrawn]);

  return (
    <div
      aria-hidden="true"
      style={{
        opacity,
        transition: "opacity 500ms ease-in",
        backgroundColor: "var(--screen)",
        borderRadius: "var(--radius-screen)",
        border: "1px solid var(--hairline)",
        width: "100%",
        aspectRatio: "400 / 420",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg viewBox="0 0 400 420" className="w-full h-full" aria-hidden="true">
        {/* Grid */}
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.5" fill="var(--screen-muted)" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="400" height="420" fill="url(#hero-grid)" />

        {/* Edges — draw from center outward via stroke-dashoffset */}
        {HERO_EDGES.map((edge, i) => {
          const from = HERO_NODES.find((n) => n.id === edge.from)!;
          const to = HERO_NODES.find((n) => n.id === edge.to)!;
          const len = Math.hypot(to.x - from.x, to.y - from.y);
          return (
            <line
              key={i}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke="var(--signal)"
              strokeWidth="1"
              strokeDasharray={len}
              strokeDashoffset={edgesDrawn ? 0 : len}
              style={{ transition: `stroke-dashoffset 500ms ease-in-out ${i * 80}ms` }}
            />
          );
        })}

        {/* Nodes — buttons for keyboard navigation */}
        {HERO_NODES.map((node) => {
          const isCenter = node.id === "portfolio";
          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y}
                r={isCenter ? 14 : 8}
                fill={isCenter ? "var(--signal)" : "var(--screen)"}
                stroke="var(--signal)"
                strokeWidth={isCenter ? 0 : 1}
                style={{
                  transform: edgesDrawn ? "scale(1)" : "scale(0.96)",
                  transformOrigin: `${node.x}px ${node.y}px`,
                  transition: "transform 500ms ease-out",
                }}
              />
              <text
                x={node.x}
                y={node.y + (isCenter ? 28 : 20)}
                textAnchor="middle"
                fill="var(--screen-ink)"
                fontSize="9"
                fontFamily="var(--font-plex-mono), monospace"
              >
                {node.label.length > 20 ? node.label.slice(0, 18) + "…" : node.label}
              </text>
              {/* Invisible hit area for keyboard/click */}
              {node.slug && (
                <rect
                  x={node.x - 40} y={node.y - 20}
                  width={80} height={44}
                  fill="transparent"
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to ${node.label} project`}
                  style={{ cursor: "pointer" }}
                  onClick={() => onNodeClick(node.slug!)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onNodeClick(node.slug!); }}
                />
              )}
            </g>
          );
        })}

        {/* Ambient packet */}
        {packetPos && (
          <g>
            <circle cx={packetPos.x} cy={packetPos.y} r="4"
              fill="var(--signal)" stroke="var(--screen)" strokeWidth="1.5" />
            <text x={packetPos.x} y={packetPos.y - 8}
              textAnchor="middle" fill="var(--signal)" fontSize="8"
              fontFamily="var(--font-plex-mono), monospace">
              {packetPos.label}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
