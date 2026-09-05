"use client";
"use client";

import { useRef, useMemo } from "react";
import { Scene } from "../engine/Scene";
import { Node } from "../engine/Node";
import { Packet } from "../engine/Packet";
import { Screen } from "../engine/Screen";
import { ScreenBoundary } from "../engine/ScreenBoundary";
import { useScenario } from "../engine/useScenario";
import { buildEdgePaths } from "../engine/edgePath";
import { ragScene } from "./scene";
import { ragScenarios } from "./scenarios";

export function RagScreen() {
  const scenarioState = useScenario(ragScenarios, { autoplay: "ingest-document" });
  const edgePaths = useMemo(() => buildEdgePaths(ragScene), []);
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const getEdgePath = (edgeId: string): SVGPathElement | null =>
    pathRefs.current.get(edgeId) ?? null;

  const extractStrategy = scenarioState.targets["extract.strategy"] as string | undefined;
  const chunkCaption = scenarioState.targets["chunk.caption"] as string | undefined;
  const topk = scenarioState.targets["vectors.topk"] as string | undefined;
  const questionText = scenarioState.targets["question.text"] as string | undefined;
  const confidence = scenarioState.targets["confidence"] as string | undefined;
  const sourcesChips = scenarioState.targets["sources.chips"] as string | undefined;

  return (
    <ScreenBoundary ariaLabel="rag-document-qa: RAG pipeline — upload, extract, embed, query">
      <Screen
        repoName="rag-document-qa"
        summary="Upload documents and ask natural-language questions; answers stream with source citations"
        scenarios={ragScenarios}
        state={scenarioState}
        aspectRatio={720 / 400}
      >
        <Scene viewBox={ragScene.viewBox}>
          {/* Edges */}
          {ragScene.edges.map((edge) => (
            <path
              key={edge.id}
              ref={(el) => { if (el) pathRefs.current.set(edge.id, el); }}
              d={edgePaths.get(edge.id) ?? ""}
              fill="none"
              stroke={
                scenarioState.packets.some((p) => p.edge === edge.id)
                  ? "var(--signal)"
                  : "var(--screen-muted)"
              }
              strokeWidth={scenarioState.packets.some((p) => p.edge === edge.id) ? 2 : 1.5}
              style={{ transition: "stroke var(--t-status)" }}
            />
          ))}

          {/* Ingestion lane nodes */}
          {ragScene.nodes
            .filter((n) => ["upload", "extract", "chunk", "embed", "store"].includes(n.id))
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

          {/* Extract strategy label */}
          {extractStrategy && (
            <text x="190" y="150" textAnchor="middle" fill="var(--screen-muted)" fontSize="9"
              fontFamily="var(--font-plex-mono), monospace">
              {extractStrategy}
            </text>
          )}

          {/* Chunk caption */}
          <text x="320" y="150" textAnchor="middle" fill="var(--screen-muted)" fontSize="9"
            fontFamily="var(--font-plex-mono), monospace">
            {chunkCaption ?? "500 tokens, 50 overlap"}
          </text>

          {/* Vector space panel */}
          <rect x="450" y="180" width="140" height="80" rx="3"
            fill="var(--screen)" stroke="var(--screen-muted)" strokeWidth="1" />
          <text x="520" y="196" textAnchor="middle" fill="var(--screen-muted)" fontSize="9"
            fontFamily="var(--font-plex-mono), monospace">
            vector space
          </text>
          {topk && (
            <text x="520" y="250" textAnchor="middle" fill="var(--signal)" fontSize="9"
              fontFamily="var(--font-plex-mono), monospace">
              {topk}
            </text>
          )}
          {/* Dimension caption */}
          <text x="520" y="265" textAnchor="middle" fill="var(--screen-muted)" fontSize="8"
            fontFamily="var(--font-plex-sans), sans-serif">
            text-embedding-3-small (1536 dim)
          </text>

          {/* Query lane nodes */}
          {ragScene.nodes
            .filter((n) => ["question", "prompt", "answer", "sources"].includes(n.id))
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

          {/* Question text */}
          {questionText && (
            <text x="60" y="335" textAnchor="middle" fill="var(--signal)" fontSize="8"
              fontFamily="var(--font-plex-mono), monospace">
              {questionText.length > 22 ? questionText.slice(0, 22) + "…" : questionText}
            </text>
          )}

          {/* Source chips */}
          {sourcesChips && (
            <text x="600" y="335" textAnchor="middle" fill="var(--signal)" fontSize="8"
              fontFamily="var(--font-plex-mono), monospace">
              {sourcesChips}
            </text>
          )}

          {/* Confidence */}
          {confidence && (
            <text x="600" y="350" textAnchor="middle" fill="var(--screen-muted)" fontSize="8"
              fontFamily="var(--font-plex-sans), sans-serif">
              {confidence}
            </text>
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
