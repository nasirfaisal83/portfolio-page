"use client";

import { useState, useRef, useMemo } from "react";
import { Scene } from "../engine/Scene";
import { Node } from "../engine/Node";
import { Packet } from "../engine/Packet";
import { Screen } from "../engine/Screen";
import { ScreenBoundary } from "../engine/ScreenBoundary";
import { useScenario } from "../engine/useScenario";
import { buildEdgePaths } from "../engine/edgePath";
import { stompScene } from "./scene";
import { stompScenarios } from "./scenarios";

export function StompScreen() {
  const scenarioState = useScenario(stompScenarios, { autoplay: "connect-clients" });
  const edgePaths = useMemo(() => buildEdgePaths(stompScene), []);
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const getEdgePath = (edgeId: string) => pathRefs.current.get(edgeId) ?? null;

  const [serverMode, setServerMode] = useState<"tpc" | "reactor">("tpc");
  const eventText = scenarioState.targets["event.text"] as string | undefined;

  return (
    <ScreenBoundary ariaLabel="Emergency-Alert-System: STOMP publish-subscribe with thread-per-client and reactor modes">
      <Screen
        repoName="Emergency-Alert-System"
        summary="STOMP pub/sub server with thread-per-client and reactor modes; C++ clients subscribe and broadcast"
        scenarios={stompScenarios}
        state={scenarioState}
        aspectRatio={720 / 400}
      >
        <Scene viewBox={stompScene.viewBox}>
          {/* Edges */}
          {stompScene.edges.map((edge) => (
            <path
              key={edge.id}
              ref={(el) => { if (el) pathRefs.current.set(edge.id, el); }}
              d={edgePaths.get(edge.id) ?? ""}
              fill="none"
              stroke={
                edge.dashed
                  ? "var(--screen-muted)"
                  : scenarioState.packets.some((p) => p.edge === edge.id)
                  ? "var(--signal)"
                  : "var(--screen-muted)"
              }
              strokeWidth={scenarioState.packets.some((p) => p.edge === edge.id) ? 2 : 1.5}
              strokeDasharray={edge.dashed ? "4 4" : undefined}
              style={{ transition: "stroke var(--t-status)" }}
            />
          ))}

          {/* Server box with mode internals */}
          <rect x="280" y="160" width="160" height="80" rx="3"
            fill="var(--screen)" stroke={
              scenarioState.nodeStates["server"]?.tone === "signal"
                ? "var(--signal)" : "var(--screen-muted)"
            } strokeWidth="1.5"
            style={{ transition: "stroke var(--t-status)" }}
          />
          <text x="360" y="178" textAnchor="middle" fill="var(--screen-ink)" fontSize="12"
            fontFamily="var(--font-plex-sans), sans-serif">
            StompServer
          </text>

          {/* Mode internals */}
          {serverMode === "tpc" ? (
            <>
              {[0, 1, 2].map((i) => (
                <rect key={i} x={290 + i * 46} y="188" width="36" height="40" rx="2"
                  fill="var(--screen-muted)" opacity="0.3" />
              ))}
              <text x="360" y="215" textAnchor="middle" fill="var(--screen-muted)" fontSize="8"
                fontFamily="var(--font-plex-mono), monospace">
                thread 1..n
              </text>
            </>
          ) : (
            <>
              <circle cx="320" cy="210" r="16" fill="none" stroke="var(--signal)" strokeWidth="1" strokeDasharray="3 2" />
              <text x="320" y="210" textAnchor="middle" dominantBaseline="middle"
                fill="var(--signal)" fontSize="7" fontFamily="var(--font-plex-mono), monospace">
                selector
              </text>
              {[0, 1, 2].map((i) => (
                <rect key={i} x={345 + i * 28} y="200" width="18" height="20" rx="2"
                  fill="var(--screen-muted)" opacity="0.3" />
              ))}
              <text x="387" y="235" textAnchor="middle" fill="var(--screen-muted)" fontSize="7"
                fontFamily="var(--font-plex-mono), monospace">
                thread pool
              </text>
            </>
          )}

          {/* Mode toggle annotation */}
          <text x="360" y="155" textAnchor="middle" fill="var(--screen-muted)" fontSize="9"
            fontFamily="var(--font-plex-mono), monospace">
            tpc | reactor
          </text>

          {/* Clients */}
          {stompScene.nodes
            .filter((n) => ["clientA", "clientB", "clientC", "channel"].includes(n.id))
            .map((node) => (
              <Node
                key={node.id}
                id={node.id}
                x={node.x}
                y={node.y}
                w={node.w}
                h={node.h}
                label={node.label}
                state={scenarioState.nodeStates[node.id]}
              />
            ))}

          {/* Channel label + event text */}
          <text x="360" y="368" textAnchor="middle" fill="var(--signal)" fontSize="9"
            fontFamily="var(--font-plex-mono), monospace">
            germany
          </text>
          {eventText && (
            <text x="360" y="382" textAnchor="middle" fill="var(--screen-muted)" fontSize="8"
              fontFamily="var(--font-plex-sans), sans-serif">
              {eventText}
            </text>
          )}

          {/* Packets */}
          {scenarioState.packets.map((pkt) => (
            <Packet key={pkt.id} packet={pkt} getEdgePath={getEdgePath} />
          ))}
        </Scene>

        {/* Mode toggle button — rendered outside SVG via Screen's children slot */}
      </Screen>

      {/* Mode toggle below the Screen chrome — aria-pressed */}
      <div className="flex gap-2 mt-2">
        {(["tpc", "reactor"] as const).map((mode) => (
          <button
            key={mode}
            aria-pressed={serverMode === mode}
            onClick={() => setServerMode(mode)}
            className="type-identifier px-3 py-2"
            style={{
              backgroundColor: serverMode === mode ? "var(--signal-deep)" : "transparent",
              color: serverMode === mode ? "var(--vellum)" : "var(--screen-muted)",
              border: "1px solid var(--screen-muted)",
              borderRadius: "var(--radius-control)",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            {mode}
          </button>
        ))}
      </div>
    </ScreenBoundary>
  );
}
