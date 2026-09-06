"use client";

import { useRef, useMemo } from "react";
import { Scene } from "../engine/Scene";
import { Node } from "../engine/Node";
import { Packet } from "../engine/Packet";
import { Screen } from "../engine/Screen";
import { ScreenBoundary } from "../engine/ScreenBoundary";
import { useScenario } from "../engine/useScenario";
import { buildEdgePaths } from "../engine/edgePath";
import { salonScene } from "./scene";
import { salonScenarios } from "./scenarios";

export function SalonScreen() {
  const scenarioState = useScenario(salonScenarios, { autoplay: "book-appointment" });
  const edgePaths = useMemo(() => buildEdgePaths(salonScene), []);
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());

  const getEdgePath = (edgeId: string): SVGPathElement | null =>
    pathRefs.current.get(edgeId) ?? null;

  const scene = salonScene;

  // Scenario-driven captions
  const conflict = scenarioState.targets["conflict"] as string | undefined;
  const replaces = scenarioState.targets["replaces"] as string | undefined;

  return (
    <ScreenBoundary ariaLabel="Salon Appointment System: request-based booking with database-enforced slot exclusivity">
      <Screen
        repoName="Salon Appointment System"
        summary="Request-based appointment booking where a PostgreSQL exclusion constraint prevents double-booking"
        scenarios={salonScenarios}
        state={scenarioState}
        aspectRatio={720 / 400}
      >
        <Scene viewBox={scene.viewBox}>
          {/* Edges */}
          {scene.edges.map((edge) => {
            const activePacket = scenarioState.packets.find((p) => p.edge === edge.id);
            return (
              <path
                key={edge.id}
                ref={(el) => { if (el) pathRefs.current.set(edge.id, el); }}
                d={edgePaths.get(edge.id) ?? ""}
                fill="none"
                stroke={
                  activePacket
                    ? activePacket.tone === "fault"
                      ? "var(--fault)"
                      : "var(--signal)"
                    : "var(--screen-muted)"
                }
                strokeWidth={activePacket ? 2 : 1.5}
                strokeDasharray={edge.dashed ? "4 4" : undefined}
                style={{ transition: "stroke var(--t-status), stroke-width var(--t-status)" }}
              />
            );
          })}

          {/* Nodes */}
          {scene.nodes.map((node) => (
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

          {/* The constraint that actually prevents double-booking */}
          <text
            x="470"
            y="152"
            textAnchor="middle"
            fill="var(--signal)"
            fontSize="9"
            fontFamily="var(--font-plex-mono), monospace"
          >
            EXCLUDE gist (staff_id, tstzrange)
          </text>
          <text
            x="470"
            y="165"
            textAnchor="middle"
            fill="var(--screen-muted)"
            fontSize="8"
            fontFamily="var(--font-plex-sans), sans-serif"
          >
            partial on REQUESTED, CONFIRMED
          </text>

          {/* Conflict readout */}
          {conflict && (
            <text
              x="270"
              y="165"
              textAnchor="middle"
              fill="var(--fault)"
              fontSize="10"
              fontFamily="var(--font-plex-mono), monospace"
            >
              {conflict}
            </text>
          )}

          {/* Reschedule readout */}
          {replaces && (
            <text
              x="470"
              y="205"
              textAnchor="middle"
              fill="var(--signal)"
              fontSize="9"
              fontFamily="var(--font-plex-mono), monospace"
            >
              {replaces}
            </text>
          )}

          {/* Packets */}
          {scenarioState.packets.map((pkt) => (
            <Packet key={pkt.id} packet={pkt} getEdgePath={getEdgePath} />
          ))}

          {/* Appointment state machine strip */}
          {(() => {
            const mainStates = ["REQUESTED", "CONFIRMED", "COMPLETED"];
            const sideStates = ["DECLINED", "EXPIRED", "CANCELLED", "NO_SHOW"];
            const current = scenarioState.nodeStates["postgres"]?.status ?? "";
            return (
              <g transform="translate(30, 340)">
                <text
                  x="0"
                  y="0"
                  fill="var(--screen-muted)"
                  fontSize="9"
                  fontFamily="var(--font-plex-mono), monospace"
                >
                  Status:
                </text>
                {mainStates.map((s, i) => {
                  const isActive = current === s;
                  return (
                    <text
                      key={s}
                      x={52 + i * 110}
                      y="0"
                      fill={isActive ? "var(--signal)" : "var(--screen-muted)"}
                      fontSize="9"
                      fontFamily="var(--font-plex-mono), monospace"
                      fontWeight={isActive ? "bold" : "normal"}
                    >
                      {s}
                    </text>
                  );
                })}
                {sideStates.map((s, i) => {
                  const isActive = current === s;
                  return (
                    <text
                      key={s}
                      x={52 + i * 110}
                      y="16"
                      fill={isActive ? "var(--fault)" : "var(--screen-muted)"}
                      fontSize="9"
                      fontFamily="var(--font-plex-mono), monospace"
                      fontWeight={isActive ? "bold" : "normal"}
                    >
                      {s}
                    </text>
                  );
                })}
                <text
                  x="0"
                  y="34"
                  fill="var(--screen-muted)"
                  fontSize="8"
                  fontFamily="var(--font-plex-sans), sans-serif"
                >
                  Seven states; every transition is a conditional UPDATE, so a lost race is a clean 409 rather than an error.
                </text>
              </g>
            );
          })()}
        </Scene>
      </Screen>
    </ScreenBoundary>
  );
}
