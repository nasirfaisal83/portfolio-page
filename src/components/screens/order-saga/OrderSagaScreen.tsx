"use client";

import { useRef, useMemo } from "react";
import { Scene } from "../engine/Scene";
import { Node } from "../engine/Node";
import { Bus } from "../engine/Bus";
import { Packet } from "../engine/Packet";
import { Screen } from "../engine/Screen";
import { ScreenBoundary } from "../engine/ScreenBoundary";
import { useScenario } from "../engine/useScenario";
import { buildEdgePaths } from "../engine/edgePath";
import { orderSagaScene } from "./scene";
import { orderSagaScenarios } from "./scenarios";

export function OrderSagaScreen() {
  const scenarioState = useScenario(orderSagaScenarios, { autoplay: "place-order" });
  const edgePaths = useMemo(() => buildEdgePaths(orderSagaScene), []);
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());

  const getEdgePath = (edgeId: string): SVGPathElement | null =>
    pathRefs.current.get(edgeId) ?? null;

  const scene = orderSagaScene;

  return (
    <ScreenBoundary ariaLabel="Order-Saga: choreography saga across five microservices">
      <Screen
        repoName="Order-Saga"
        summary="Choreography saga across five microservices coordinated by Kafka events"
        scenarios={orderSagaScenarios}
        state={scenarioState}
        aspectRatio={720 / 400}
      >
        <Scene viewBox={scene.viewBox}>
          {/* Edges */}
          {scene.edges.map((edge) => (
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
              style={{ transition: "stroke var(--t-status), stroke-width var(--t-status)" }}
            />
          ))}

          {/* Kafka bus */}
          <Bus
            x={40}
            y={200}
            width={640}
            height={8}
            label="kafka"
            topicLabels={["order.created", "inventory.reserved", "payment.succeeded"]}
          />

          {/* Nodes */}
          {scene.nodes
            .filter((n) => n.kind !== "bus")
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

          {/* Packets */}
          {scenarioState.packets.map((pkt) => (
            <Packet
              key={pkt.id}
              packet={pkt}
              getEdgePath={getEdgePath}
            />
          ))}

          {/* Status timeline strip */}
          {(() => {
            const statuses = ["PENDING", "INVENTORY_RESERVED", "PAYMENT_PROCESSING", "COMPLETED"];
            const faultStatuses = ["FAILED", "COMPENSATING"];
            const currentStatus = scenarioState.nodeStates["order"]?.status ?? "";
            return (
              <g transform="translate(30, 355)">
                <text x="0" y="0" fill="var(--screen-muted)" fontSize="9" fontFamily="var(--font-plex-mono), monospace">
                  Status:
                </text>
                {statuses.map((s, i) => {
                  const isActive = currentStatus === s;
                  return (
                    <text
                      key={s}
                      x={50 + i * 130}
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
                {faultStatuses.map((s, i) => {
                  const isActive = currentStatus === s;
                  return (
                    <text
                      key={s}
                      x={50 + i * 130}
                      y="14"
                      fill={isActive ? "var(--fault)" : "var(--screen-muted)"}
                      fontSize="9"
                      fontFamily="var(--font-plex-mono), monospace"
                      fontWeight={isActive ? "bold" : "normal"}
                    >
                      {s}
                    </text>
                  );
                })}
              </g>
            );
          })()}
        </Scene>
      </Screen>
    </ScreenBoundary>
  );
}
