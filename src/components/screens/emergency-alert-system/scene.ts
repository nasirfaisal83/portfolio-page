// Emergency-Alert-System scene — design §7.4
import type { Scene } from "../engine/types";

export const stompScene: Scene = {
  viewBox: [720, 400],
  nodes: [
    // Server (center)
    { id: "server",   label: "StompServer", x: 360, y: 200, w: 160, h: 80, kind: "service" },
    // Three clients
    { id: "clientA",  label: "client A",   x: 80,  y: 130, kind: "client" },
    { id: "clientB",  label: "client B",   x: 80,  y: 270, kind: "client" },
    { id: "clientC",  label: "client C (C++)", x: 640, y: 200, kind: "client", w: 110, h: 40 },
    // Channel label
    { id: "channel",  label: "germany",    x: 360, y: 340, kind: "stage", w: 90, h: 28 },
  ],
  edges: [
    { id: "e-A-server",       from: "clientA", to: "server" },
    { id: "e-server-A",       from: "server",  to: "clientA" },
    { id: "e-B-server",       from: "clientB", to: "server" },
    { id: "e-server-B",       from: "server",  to: "clientB" },
    { id: "e-C-server",       from: "clientC", to: "server" },
    { id: "e-server-C",       from: "server",  to: "clientC" },
    { id: "e-server-channel", from: "server",  to: "channel", dashed: true },
  ],
  narrow: {
    viewBox: [360, 440],
    nodes: [
      { id: "server",  label: "StompServer", x: 180, y: 140, w: 150, h: 80 },
      { id: "clientA", label: "client A",    x: 60,  y: 60 },
      { id: "clientB", label: "client B",    x: 60,  y: 260 },
      { id: "clientC", label: "client C",    x: 300, y: 160 },
      { id: "channel", label: "germany",     x: 180, y: 320, w: 90, h: 28 },
    ],
  },
};
