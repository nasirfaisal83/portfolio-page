"use client";

import { useRef, useMemo } from "react";
import { Scene } from "../engine/Scene";
import { Node } from "../engine/Node";
import { Packet } from "../engine/Packet";
import { Gauge } from "../engine/Gauge";
import { Screen } from "../engine/Screen";
import { ScreenBoundary } from "../engine/ScreenBoundary";
import { useScenario } from "../engine/useScenario";
import { buildEdgePaths } from "../engine/edgePath";
import { agentsScene } from "./scene";
import { agentsScenarios } from "./scenarios";

export function AgentsScreen() {
  const scenarioState = useScenario(agentsScenarios, { autoplay: "run-pipeline" });
  const edgePaths = useMemo(() => buildEdgePaths(agentsScene), []);
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const getEdgePath = (edgeId: string) => pathRefs.current.get(edgeId) ?? null;

  const gaugeValue = (scenarioState.targets["gauge.value"] as number | undefined) ?? 0;
  const gaugeCaption = scenarioState.targets["gauge.caption"] as string | undefined;
  const outputMarkers = scenarioState.targets["output.markers"] as string | undefined;
  const outputCaption = scenarioState.targets["output.caption"] as string | undefined;
  const topicText = (scenarioState.targets["topic.text"] as string | undefined) ?? "NVIDIA Blackwell GPU";

  return (
    <ScreenBoundary ariaLabel="tech-news-agent: multi-agent ReAct pipeline for fact-checked LinkedIn posts">
      <Screen
        repoName="tech-news-agent"
        summary="Multi-agent ReAct pipeline that fact-checks a tech topic and writes a LinkedIn post"
        scenarios={agentsScenarios}
        state={scenarioState}
        aspectRatio={720 / 400}
      >
        <Scene viewBox={agentsScene.viewBox}>
          {/* Edges */}
          {agentsScene.edges.map((edge) => (
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

          {/* Orchestrator ring */}
          <circle cx="360" cy="60" r="36" fill="none"
            stroke={scenarioState.nodeStates["orchestrator"]?.tone === "signal" ? "var(--signal)" : "var(--screen-muted)"}
            strokeWidth="1" strokeDasharray="4 2"
            style={{ transition: "stroke var(--t-status)" }}
          />
          <text x="360" y="88" textAnchor="middle" fill="var(--screen-muted)" fontSize="8"
            fontFamily="var(--font-plex-mono), monospace">
            reason → act → observe
          </text>

          {/* Topic pill */}
          <rect x="40" y="45" width="80" height="30" rx="15"
            fill="var(--screen)" stroke="var(--screen-muted)" strokeWidth="1" />
          <text x="80" y="60" textAnchor="middle" dominantBaseline="middle"
            fill="var(--signal)" fontSize="9" fontFamily="var(--font-plex-mono), monospace">
            {topicText.length > 12 ? topicText.slice(0, 12) + "…" : topicText}
          </text>

          {/* Nodes */}
          {agentsScene.nodes
            .filter((n) => !["topic"].includes(n.id))
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

          {/* Gauge under FactChecker */}
          <Gauge
            x={460}
            y={240}
            width={80}
            height={8}
            value={gaugeValue}
            threshold={0.6}
            label={gaugeValue > 0 ? `${gaugeValue}${gaugeCaption ? " — " + gaugeCaption : ""}` : ""}
          />
          <text x="500" y="238" textAnchor="middle" fill="var(--screen-muted)" fontSize="8"
            fontFamily="var(--font-plex-sans), sans-serif">
            threshold 0.6
          </text>

          {/* Output card */}
          {outputMarkers && (
            <>
              <text x="640" y="310" textAnchor="middle" fill="var(--signal)" fontSize="8"
                fontFamily="var(--font-plex-mono), monospace">
                {outputMarkers}
              </text>
              <text x="640" y="325" textAnchor="middle" fill="var(--screen-muted)" fontSize="7"
                fontFamily="var(--font-plex-sans), sans-serif">
                {outputCaption}
              </text>
            </>
          )}

          {/* Packets */}
          {scenarioState.packets.map((pkt) => (
            <Packet key={pkt.id} packet={pkt} getEdgePath={getEdgePath} />
          ))}
        </Scene>
      </Screen>
    </ScreenBoundary>
  );
}
