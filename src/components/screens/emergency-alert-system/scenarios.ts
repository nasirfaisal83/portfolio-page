// Emergency-Alert-System scenarios — design §7.4
// STOMP frames from README: CONNECT, CONNECTED, SUBSCRIBE, SEND, MESSAGE, RECEIPT
import type { Scenario } from "../engine/types";

export const stompScenarios: Scenario[] = [
  {
    id: "connect-clients",
    label: "Connect clients",
    narration: [
      "Client A sends CONNECT; server replies CONNECTED",
      "Client B sends CONNECT; server replies CONNECTED",
      "Client C sends CONNECT; server replies CONNECTED",
      "Client A subscribes to channel 'germany'; server sends RECEIPT",
      "Client B subscribes to channel 'germany'; server sends RECEIPT",
      "Three clients connected; A and B subscribed to germany",
    ],
    steps: [
      // Client A connect
      { t: 0,    kind: "packet", edge: "e-A-server",   label: "CONNECT",   tone: "signal", duration: 600 },
      { t: 600,  kind: "pulse",  node: "server",       tone: "signal" },
      { t: 800,  kind: "packet", edge: "e-server-A",   label: "CONNECTED", tone: "signal", duration: 600 },
      { t: 1400, kind: "pulse",  node: "clientA",      tone: "signal" },
      // Client B connect
      { t: 1600, kind: "packet", edge: "e-B-server",   label: "CONNECT",   tone: "signal", duration: 600 },
      { t: 2200, kind: "packet", edge: "e-server-B",   label: "CONNECTED", tone: "signal", duration: 600 },
      { t: 2800, kind: "pulse",  node: "clientB",      tone: "signal" },
      // Client C connect
      { t: 3000, kind: "packet", edge: "e-C-server",   label: "CONNECT",   tone: "signal", duration: 600 },
      { t: 3600, kind: "packet", edge: "e-server-C",   label: "CONNECTED", tone: "signal", duration: 600 },
      { t: 4200, kind: "pulse",  node: "clientC",      tone: "signal" },
      // Subscribe A and B
      { t: 4400, kind: "packet", edge: "e-A-server",   label: "SUBSCRIBE germany", tone: "signal", duration: 600 },
      { t: 5000, kind: "packet", edge: "e-server-A",   label: "RECEIPT",   tone: "signal", duration: 600 },
      { t: 5600, kind: "packet", edge: "e-B-server",   label: "SUBSCRIBE germany", tone: "signal", duration: 600 },
      { t: 6200, kind: "packet", edge: "e-server-B",   label: "RECEIPT",   tone: "signal", duration: 600 },
      { t: 6800, kind: "say",    text: "Three clients connected; A and B subscribed to germany" },
      { t: 6800, kind: "set",    target: "channel.active", value: true },
    ],
  },
  {
    id: "broadcast-alert",
    label: "Broadcast an alert",
    narration: [
      "Client C publishes SEND to channel 'germany' — Fire in Berlin",
      "Server receives event; fans out MESSAGE to subscribers A and B",
      "Client C receives RECEIPT (not MESSAGE — C is not a subscriber)",
      "Broadcast complete",
    ],
    steps: [
      { t: 0,    kind: "packet", edge: "e-C-server",   label: "SEND germany",      tone: "signal", duration: 700 },
      { t: 700,  kind: "pulse",  node: "server",       tone: "signal" },
      { t: 700,  kind: "say",    text: "C published to germany: Fire in Berlin" },
      { t: 700,  kind: "set",    target: "event.text", value: "Fire in Berlin" },
      // Fan out to subscribers
      { t: 900,  kind: "packet", edge: "e-server-A",   label: "MESSAGE",           tone: "signal", duration: 700 },
      { t: 900,  kind: "packet", edge: "e-server-B",   label: "MESSAGE",           tone: "signal", duration: 700 },
      // RECEIPT to C (not MESSAGE)
      { t: 1100, kind: "packet", edge: "e-server-C",   label: "RECEIPT",           tone: "signal", duration: 700 },
      { t: 1600, kind: "pulse",  node: "clientA",      tone: "signal" },
      { t: 1600, kind: "pulse",  node: "clientB",      tone: "signal" },
      { t: 1800, kind: "pulse",  node: "clientC",      tone: "signal" },
      { t: 1800, kind: "say",    text: "A and B received MESSAGE; C received RECEIPT only" },
    ],
  },
];
