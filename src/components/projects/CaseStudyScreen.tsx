"use client";

import dynamic from "next/dynamic";
import type { ScreenId } from "@/content/projects";

const SCREEN_MAP: Record<ScreenId, React.ComponentType> = {
  "order-saga": dynamic(
    () => import("@/components/screens/order-saga/OrderSagaScreen").then((m) => ({ default: m.OrderSagaScreen })),
    { ssr: false }
  ),
  rag: dynamic(
    () => import("@/components/screens/rag-document-qa/RagScreen").then((m) => ({ default: m.RagScreen })),
    { ssr: false }
  ),
  agents: dynamic(
    () => import("@/components/screens/tech-news-agent/AgentsScreen").then((m) => ({ default: m.AgentsScreen })),
    { ssr: false }
  ),
  stomp: dynamic(
    () => import("@/components/screens/emergency-alert-system/StompScreen").then((m) => ({ default: m.StompScreen })),
    { ssr: false }
  ),
  detection: dynamic(
    () => import("@/components/screens/con-detection/DetectionScreen").then((m) => ({ default: m.DetectionScreen })),
    { ssr: false }
  ),
};

export function CaseStudyScreen({ screenId }: { screenId: ScreenId }) {
  const ScreenComponent = SCREEN_MAP[screenId];
  return ScreenComponent ? <ScreenComponent /> : null;
}
