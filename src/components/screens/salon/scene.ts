// Salon Appointment System scene — every node, edge and label traces to the project README.
import type { Scene } from "../engine/types";

// Wide layout: 720 × 400
export const salonScene: Scene = {
  viewBox: [720, 400],
  nodes: [
    // Two customers on the left — the second one only participates in the conflict scenario
    { id: "customerA", label: "customer A", x: 80, y: 70, kind: "client" },
    { id: "customerB", label: "customer B", x: 80, y: 175, kind: "client" },
    // Backend
    { id: "api", label: "Spring Boot", x: 270, y: 120, kind: "service" },
    // Database — carries the appointment status chip
    { id: "postgres", label: "PostgreSQL", x: 470, y: 120, kind: "store", status: "—" },
    // The stylist who approves or declines
    { id: "stylist", label: "stylist", x: 640, y: 120, kind: "client" },
    // Outbound messaging
    { id: "sms", label: "SMS gateway", x: 270, y: 265, kind: "tool" },
  ],
  edges: [
    { id: "e-A-api", from: "customerA", to: "api" },
    { id: "e-B-api", from: "customerB", to: "api" },
    { id: "e-api-pg", from: "api", to: "postgres" },
    { id: "e-pg-api", from: "postgres", to: "api" },
    { id: "e-api-sms", from: "api", to: "sms" },
    { id: "e-sms-stylist", from: "sms", to: "stylist" },
    { id: "e-stylist-api", from: "stylist", to: "api" },
    { id: "e-api-A", from: "api", to: "customerA" },
  ],
  narrow: {
    viewBox: [360, 460],
    nodes: [
      { id: "customerA", label: "customer A", x: 80, y: 50, kind: "client" },
      { id: "customerB", label: "customer B", x: 260, y: 50, kind: "client" },
      { id: "api", label: "Spring Boot", x: 170, y: 150, kind: "service" },
      { id: "postgres", label: "PostgreSQL", x: 170, y: 250, kind: "store", status: "—" },
      { id: "stylist", label: "stylist", x: 280, y: 350, kind: "client" },
      { id: "sms", label: "SMS gateway", x: 90, y: 350, kind: "tool" },
    ],
  },
};
