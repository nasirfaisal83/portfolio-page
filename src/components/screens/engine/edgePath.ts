// src/components/screens/engine/edgePath.ts
// Computes SVG path data (d attribute) for edges between nodes, with optional bus routing.

import type { Scene, SceneEdge } from "./types";

const DEFAULT_W = 120;
const DEFAULT_H = 40;

function getNodeCenter(scene: Scene, id: string): { x: number; y: number } {
  const node = scene.nodes.find((n) => n.id === id);
  if (!node) return { x: 0, y: 0 };
  return { x: node.x, y: node.y };
}

/**
 * Generate the SVG path `d` string for a given edge.
 * Handles straight edges and bus-routed edges.
 */
export function computeEdgePath(scene: Scene, edge: SceneEdge): string {
  const from = getNodeCenter(scene, edge.from);
  const to = getNodeCenter(scene, edge.to);

  if (!edge.via) {
    // Straight line with slight curve
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
  }

  // Bus-routed: from → bus entry → bus exit → to
  const bus = scene.nodes.find((n) => n.id === edge.via);
  if (!bus) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  const busW = bus.w ?? DEFAULT_W;
  const busH = bus.h ?? DEFAULT_H;
  const busLeft = bus.x - busW / 2;
  const busRight = bus.x + busW / 2;
  const busTop = bus.y - busH / 2;
  const busBottom = bus.y + busH / 2;

  // Determine entry point (closest bus edge from source)
  const entryX = Math.max(busLeft, Math.min(busRight, from.x));
  const entryY = from.y < bus.y ? busTop : busBottom;
  const exitX = Math.max(busLeft, Math.min(busRight, to.x));
  const exitY = to.y < bus.y ? busTop : busBottom;

  return `M ${from.x} ${from.y} L ${entryX} ${entryY} L ${exitX} ${exitY} L ${to.x} ${to.y}`;
}

/** Build a map of edgeId → path `d` string for a given scene. */
export function buildEdgePaths(scene: Scene): Map<string, string> {
  const map = new Map<string, string>();
  for (const edge of scene.edges) {
    map.set(edge.id, computeEdgePath(scene, edge));
  }
  return map;
}
