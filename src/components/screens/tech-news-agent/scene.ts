// tech-news-agent scene — all values from the README (design §7.3)
import type { Scene } from "../engine/types";

export const agentsScene: Scene = {
  viewBox: [720, 400],
  nodes: [
    // Orchestrator (top center)
    { id: "orchestrator", label: "OrchestratorAgent", x: 360, y: 60,  w: 180, h: 40, kind: "agent" },
    // Five agents (middle row)
    { id: "scout",    label: "ScoutAgent",        x: 80,  y: 200, kind: "agent" },
    { id: "reporter", label: "ReporterAgent",     x: 220, y: 200, kind: "agent" },
    { id: "editor",   label: "EditorAgent",       x: 360, y: 200, kind: "agent" },
    { id: "factcheck",label: "FactCheckerAgent",  x: 500, y: 200, kind: "agent" },
    { id: "linkedin", label: "LinkedInWriter",    x: 640, y: 200, kind: "agent" },
    // Tools
    { id: "tavily",   label: "Tavily",            x: 50,  y: 320, kind: "tool", w: 90, h: 32 },
    { id: "github",   label: "GitHub MCP",        x: 160, y: 320, kind: "tool", w: 90, h: 32 },
    // Output card
    { id: "output",   label: "output",            x: 640, y: 320, kind: "stage", w: 100, h: 50 },
    // Topic pill
    { id: "topic",    label: "topic",             x: 80,  y: 60,  kind: "stage", w: 80, h: 30 },
  ],
  edges: [
    { id: "e-topic-orchestrator",  from: "topic",       to: "orchestrator" },
    { id: "e-orchestrator-scout",  from: "orchestrator",to: "scout" },
    { id: "e-orchestrator-reporter",from:"orchestrator", to: "reporter" },
    { id: "e-orchestrator-editor", from: "orchestrator",to: "editor" },
    { id: "e-orchestrator-factcheck",from:"orchestrator",to: "factcheck" },
    { id: "e-orchestrator-linkedin",from:"orchestrator", to: "linkedin" },
    { id: "e-scout-tavily",        from: "scout",       to: "tavily",    dashed: true },
    { id: "e-scout-github",        from: "scout",       to: "github",    dashed: true },
    { id: "e-scout-reporter",      from: "scout",       to: "reporter" },
    { id: "e-reporter-editor",     from: "reporter",    to: "editor" },
    { id: "e-editor-factcheck",    from: "editor",      to: "factcheck" },
    { id: "e-factcheck-linkedin",  from: "factcheck",   to: "linkedin" },
    { id: "e-factcheck-reporter",  from: "factcheck",   to: "reporter",  dashed: true },
    { id: "e-linkedin-output",     from: "linkedin",    to: "output" },
  ],
  narrow: {
    viewBox: [360, 480],
    nodes: [
      { id: "orchestrator", label: "Orchestrator",    x: 180, y: 50,  w: 140, h: 40 },
      { id: "scout",        label: "Scout",           x: 60,  y: 150 },
      { id: "reporter",     label: "Reporter",        x: 180, y: 150 },
      { id: "editor",       label: "Editor",          x: 300, y: 150 },
      { id: "factcheck",    label: "FactChecker",     x: 60,  y: 250 },
      { id: "linkedin",     label: "LinkedInWriter",  x: 300, y: 250, w: 110, h: 40 },
      { id: "tavily",       label: "Tavily",          x: 60,  y: 350, w: 90,  h: 32 },
      { id: "github",       label: "GitHub MCP",      x: 180, y: 350, w: 90,  h: 32 },
      { id: "output",       label: "output",          x: 300, y: 380, w: 90,  h: 50 },
      { id: "topic",        label: "topic",           x: 60,  y: 50,  w: 80,  h: 30 },
    ],
  },
};
