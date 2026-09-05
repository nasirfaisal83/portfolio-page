// src/components/screens/engine/types.ts
// Schema for the screen engine. Exactly as specified in design §6.1.

export type NodeId = string;

export interface SceneNode {
  id: NodeId;
  label: string;           // identifier or plain name
  x: number; y: number;   // viewBox units
  w?: number; h?: number; // default 120 × 40
  kind?: "service" | "bus" | "store" | "client" | "agent" | "tool" | "stage" | "registry";
  status?: string;         // initial chip text, e.g. "PENDING"
}

export interface SceneEdge {
  id: string;
  from: NodeId; to: NodeId;
  via?: NodeId;            // route through a bus node
  dashed?: boolean;
}

export interface Scene {
  viewBox: [number, number]; // wide layout, e.g. [720, 400]
  nodes: SceneNode[];
  edges: SceneEdge[];
  narrow?: Pick<Scene, "viewBox" | "nodes">; // positions for < 768px; edges reused
}

export type Step =
  | { t: number; kind: "packet"; edge: string; label?: string; tone?: "signal" | "fault"; duration?: number }
  | { t: number; kind: "pulse"; node: NodeId; tone?: "signal" | "fault" }
  | { t: number; kind: "status"; node: NodeId; value: string; tone?: "idle" | "signal" | "fault" }
  | { t: number; kind: "set"; target: string; value: string | number | boolean }
  | { t: number; kind: "morph"; layout: string }
  | { t: number; kind: "say"; text: string };

export interface Scenario {
  id: string;
  label: string;           // button copy, imperative: "Place order"
  steps: Step[];           // t in ms from scenario start, ascending
  narration: string[];     // ordered list for "Show as text"
}

// Runtime packet state (managed by useScenario)
export interface InFlightPacket {
  id: string;
  edge: string;
  label?: string;
  tone: "signal" | "fault";
  duration: number;
  startedAt: number; // elapsed ms when launched
}

// Per-node runtime state
export interface NodeState {
  status?: string;
  tone?: "idle" | "signal" | "fault";
  pulsing?: boolean;
}

// useScenario return type
export interface ScenarioState {
  nodeStates: Record<NodeId, NodeState>;
  targets: Record<string, string | number | boolean>;
  packets: InFlightPacket[];
  currentLayout: string | null;
  narrationLines: string[];
  isPlaying: boolean;
  scenarioId: string | null;
  stepIndex: number;
}

export interface ScenarioControls {
  play: (id: string) => void;
  pause: () => void;
  reset: () => void;
}
