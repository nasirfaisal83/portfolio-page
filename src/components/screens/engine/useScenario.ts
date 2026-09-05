"use client";
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { usePageVisible } from "./usePageVisible";
import type {
  Scenario,
  ScenarioState,
  ScenarioControls,
} from "./types";

const MAX_PACKETS = 6;
const REDUCED_MOTION_STEP_DELAY = 150; // ms crossfade between steps

let packetIdCounter = 0;
function nextPacketId() {
  return `pkt-${++packetIdCounter}`;
}

interface UseScenarioOptions {
  /** ID of the scenario to autoplay once on mount */
  autoplay?: string;
}

export function useScenario(
  scenarios: Scenario[],
  { autoplay }: UseScenarioOptions = {}
): ScenarioState & ScenarioControls {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const pageVisible = usePageVisible();

  // Per-screen reduced-motion override ("Play with motion")
  const [motionOverride, setMotionOverride] = useState(false);
  const reducedMotion = prefersReducedMotion && !motionOverride;

  const [state, setState] = useState<ScenarioState>({
    nodeStates: {},
    targets: {},
    packets: [],
    currentLayout: null,
    narrationLines: [],
    isPlaying: false,
    scenarioId: null,
    stepIndex: -1,
  });

  // Refs for the rAF loop
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(false);
  const elapsedRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const scenarioRef = useRef<Scenario | null>(null);
  const stepIndexRef = useRef(-1);
  const pausedAtRef = useRef<number | null>(null);
  const autoplayedRef = useRef(false);

  const applyStep = useCallback(
    (scenario: Scenario, stepIdx: number) => {
      const step = scenario.steps[stepIdx];
      if (!step) return;

      setState((prev) => {
        const nodeStates = { ...prev.nodeStates };
        const targets = { ...prev.targets };
        const packets = [...prev.packets];
        let currentLayout = prev.currentLayout;
        const narrationLines = [...prev.narrationLines];

        switch (step.kind) {
          case "status": {
            nodeStates[step.node] = {
              ...nodeStates[step.node],
              status: step.value,
              tone: step.tone ?? "idle",
            };
            break;
          }
          case "pulse": {
            nodeStates[step.node] = {
              ...nodeStates[step.node],
              tone: step.tone ?? "signal",
              pulsing: true,
            };
            // Clear pulse after status transition
            setTimeout(() => {
              setState((s) => ({
                ...s,
                nodeStates: {
                  ...s.nodeStates,
                  [step.node]: { ...s.nodeStates[step.node], pulsing: false },
                },
              }));
            }, 400);
            break;
          }
          case "packet": {
            if (!reducedMotion && packets.filter((p) => !p.id.startsWith("queued")).length < MAX_PACKETS) {
              packets.push({
                id: nextPacketId(),
                edge: step.edge,
                label: step.label,
                tone: step.tone ?? "signal",
                duration: step.duration ?? 900,
                startedAt: elapsedRef.current,
              });
            }
            break;
          }
          case "set": {
            targets[step.target] = step.value;
            break;
          }
          case "morph": {
            currentLayout = step.layout;
            break;
          }
          case "say": {
            narrationLines.push(step.text);
            break;
          }
        }

        return {
          ...prev,
          nodeStates,
          targets,
          packets,
          currentLayout,
          narrationLines,
          stepIndex: stepIdx,
        };
      });
    },
    [reducedMotion]
  );

  const resetState = useCallback(() => {
    setState({
      nodeStates: {},
      targets: {},
      packets: [],
      currentLayout: null,
      narrationLines: [],
      isPlaying: false,
      scenarioId: null,
      stepIndex: -1,
    });
  }, []);

  // Clean up packets that have finished
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const now = elapsedRef.current;
        const packets = prev.packets.filter((p) => now - p.startedAt < p.duration + 100);
        if (packets.length === prev.packets.length) return prev;
        return { ...prev, packets };
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const runLoop = useCallback(
    (timestamp: number) => {
      if (!playingRef.current || !scenarioRef.current) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;
      elapsedRef.current += delta;

      const scenario = scenarioRef.current;
      const steps = scenario.steps;

      // Apply all steps whose t <= elapsed
      while (
        stepIndexRef.current < steps.length - 1 &&
        steps[stepIndexRef.current + 1].t <= elapsedRef.current
      ) {
        stepIndexRef.current++;
        applyStep(scenario, stepIndexRef.current);
      }

      // Done?
      if (stepIndexRef.current >= steps.length - 1) {
        playingRef.current = false;
        setState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }

      rafRef.current = requestAnimationFrame(runLoop);
    },
    [applyStep]
  );

  const runReducedMotion = useCallback(
    (scenario: Scenario) => {
      // Step through all steps with a small delay between each
      let i = 0;
      const tick = () => {
        if (i >= scenario.steps.length) {
          setState((prev) => ({ ...prev, isPlaying: false }));
          return;
        }
        applyStep(scenario, i);
        i++;
        setTimeout(tick, REDUCED_MOTION_STEP_DELAY);
      };
      tick();
    },
    [applyStep]
  );

  const play = useCallback(
    (id: string) => {
      stopRaf();
      const scenario = scenarios.find((s) => s.id === id);
      if (!scenario) return;

      resetState();
      scenarioRef.current = scenario;
      stepIndexRef.current = -1;
      elapsedRef.current = 0;
      lastTimestampRef.current = null;
      pausedAtRef.current = null;
      playingRef.current = true;

      setState((prev) => ({
        ...prev,
        isPlaying: true,
        scenarioId: id,
        narrationLines: [],
      }));

      if (reducedMotion) {
        runReducedMotion(scenario);
      } else {
        rafRef.current = requestAnimationFrame(runLoop);
      }
    },
    [scenarios, stopRaf, resetState, reducedMotion, runReducedMotion, runLoop]
  );

  const pause = useCallback(() => {
    if (!playingRef.current) return;
    playingRef.current = false;
    pausedAtRef.current = elapsedRef.current;
    stopRaf();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, [stopRaf]);

  const reset = useCallback(() => {
    stopRaf();
    playingRef.current = false;
    scenarioRef.current = null;
    elapsedRef.current = 0;
    lastTimestampRef.current = null;
    pausedAtRef.current = null;
    stepIndexRef.current = -1;
    resetState();
  }, [stopRaf, resetState]);

  // Pause when page hidden
  useEffect(() => {
    if (!pageVisible && playingRef.current) {
      pause();
    }
  }, [pageVisible, pause]);

  // Expose the per-screen motion override toggle (not part of public API but used by Screen)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (play as any).__setMotionOverride = setMotionOverride;

  // Autoplay once when first in-view (called by Screen component via inViewRef)
  const triggerAutoplay = useCallback(() => {
    if (autoplayedRef.current || !autoplay) return;
    autoplayedRef.current = true;
    play(autoplay);
  }, [autoplay, play]);

  // Expose triggerAutoplay for Screen to call
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (play as any).__triggerAutoplay = triggerAutoplay;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (play as any).__motionOverride = motionOverride;

  useEffect(() => {
    return () => stopRaf();
  }, [stopRaf]);

  return { ...state, play, pause, reset };
}
