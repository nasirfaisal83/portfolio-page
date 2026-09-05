// Order-Saga scene — all values from the README (design §7.1)
import type { Scene } from "../engine/types";

// Wide layout: 720 × 400
export const orderSagaScene: Scene = {
  viewBox: [720, 400],
  nodes: [
    // Top row
    { id: "gateway",  label: "Gateway",      x: 90,  y: 80,  kind: "service" },
    { id: "order",    label: "Order",         x: 280, y: 80,  kind: "service", status: "PENDING" },
    { id: "inventory",label: "Inventory",     x: 500, y: 80,  kind: "service" },
    // Kafka bus — spans full width at y=200
    { id: "kafka",    label: "kafka",         x: 360, y: 200, w: 640, h: 8, kind: "bus" },
    // Bottom row
    { id: "payment",  label: "Payment",       x: 130, y: 320, kind: "service" },
    { id: "shipping", label: "Shipping",      x: 360, y: 320, kind: "service" },
    { id: "notification", label: "Notification", x: 590, y: 320, kind: "service" },
    // Eureka registry marker (right edge, dashed)
    { id: "eureka",   label: "eureka",        x: 680, y: 200, w: 60, h: 24, kind: "registry" },
  ],
  edges: [
    // Gateway → Order
    { id: "e-gw-order",    from: "gateway",   to: "order",        via: undefined },
    // Order ↔ kafka ↔ services
    { id: "e-order-kafka",   from: "order",     to: "kafka" },
    { id: "e-kafka-inventory",from: "kafka",    to: "inventory" },
    { id: "e-inventory-kafka",from: "inventory", to: "kafka" },
    { id: "e-kafka-payment",  from: "kafka",    to: "payment" },
    { id: "e-payment-kafka",  from: "payment",  to: "kafka" },
    { id: "e-kafka-shipping", from: "kafka",    to: "shipping" },
    { id: "e-shipping-kafka", from: "shipping", to: "kafka" },
    { id: "e-kafka-notification", from: "kafka", to: "notification" },
    // Eureka dashed to all services
    { id: "e-eureka-order",      from: "eureka", to: "order",        dashed: true },
    { id: "e-eureka-inventory",  from: "eureka", to: "inventory",    dashed: true },
    { id: "e-eureka-payment",    from: "eureka", to: "payment",      dashed: true },
    { id: "e-eureka-shipping",   from: "eureka", to: "shipping",     dashed: true },
    { id: "e-eureka-notification",from:"eureka", to: "notification", dashed: true },
  ],
  narrow: {
    viewBox: [360, 440],
    nodes: [
      { id: "gateway",      label: "Gateway",      x: 90,  y: 60  },
      { id: "order",        label: "Order",         x: 90,  y: 140, status: "PENDING" },
      { id: "inventory",    label: "Inventory",     x: 270, y: 140 },
      { id: "kafka",        label: "kafka",         x: 180, y: 220, w: 320, h: 8 },
      { id: "payment",      label: "Payment",       x: 90,  y: 310 },
      { id: "shipping",     label: "Shipping",      x: 270, y: 310 },
      { id: "notification", label: "Notification",  x: 180, y: 390 },
      { id: "eureka",       label: "eureka",        x: 330, y: 60,  w: 50, h: 20 },
    ],
  },
};
