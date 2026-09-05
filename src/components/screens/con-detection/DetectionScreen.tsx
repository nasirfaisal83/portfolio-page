"use client";
"use client";

import { useEffect, useRef, useState } from "react";
import { ScreenBoundary } from "../engine/ScreenBoundary";

// Cone positions (perspective road — three depths)
const CONES = [
  { id: "cone-near",  baseX: 290, baseY: 340, scale: 1.0 },
  { id: "cone-mid",   baseX: 360, baseY: 280, scale: 0.7 },
  { id: "cone-far",   baseX: 400, baseY: 220, scale: 0.45 },
] as const;

// Pipeline stages
const STAGES = ["video", "frame", "YOLOv5", "boxes"] as const;

const TOTAL_FRAMES = 24;
const FRAME_INTERVAL = 400; // ms per frame
const FIRST_FRAME = 400;

export function DetectionScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState(FIRST_FRAME);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameCountRef = useRef(0);
  const autoplayedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startPlayback = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDone(false);
    frameCountRef.current = 0;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      frameCountRef.current++;
      setFrame(FIRST_FRAME + frameCountRef.current);
      setPipelineStage((s) => (s + 1) % STAGES.length);
      if (frameCountRef.current >= TOTAL_FRAMES) {
        clearInterval(intervalRef.current!);
        setIsPlaying(false);
        setDone(true);
      }
    }, FRAME_INTERVAL);
  };

  const stopPlayback = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  // Autoplay once on inView
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoplayedRef.current) {
          autoplayedRef.current = true;
          startPlayback();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // Progress t in 0..1 for perspective scaling (normalize frame offset from first)
  const progress = Math.min((frame - FIRST_FRAME) / TOTAL_FRAMES, 1);

  return (
    <ScreenBoundary ariaLabel="con-Detection: YOLOv5 cone detection loop illustration">
      <div ref={containerRef}>
        {/* Custom chrome for this screen — no scenario buttons, just Play/Pause */}
        <figure
          role="group"
          aria-label="con-Detection: illustration of the YOLOv5 detection loop; the notebook runs the real model"
          style={{
            backgroundColor: "var(--screen)",
            borderRadius: "var(--radius-screen)",
            border: "1px solid var(--hairline)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            padding: "12px 14px 14px",
          }}
        >
          {/* Title strip */}
          <div className="type-identifier mb-2" style={{ color: "var(--screen-muted)" }} aria-hidden="true">
            con-Detection
          </div>

          {/* SVG canvas */}
          <div style={{ position: "relative", width: "100%", paddingBottom: "55.5%" }} aria-hidden="true">
            <div style={{ position: "absolute", inset: 0 }}>
              <svg viewBox="0 0 720 400" className="w-full h-full" aria-hidden="true">
                {/* Background */}
                <rect width="720" height="400" fill="var(--screen)" />

                {/* Road — one-point perspective */}
                <polygon points="360,400 200,400 320,180 400,180 520,400"
                  fill="var(--screen-muted)" opacity="0.15" />
                <line x1="360" y1="180" x2="240" y2="400" stroke="var(--screen-muted)" strokeWidth="1" opacity="0.3" />
                <line x1="360" y1="180" x2="480" y2="400" stroke="var(--screen-muted)" strokeWidth="1" opacity="0.3" />

                {/* Traffic cones */}
                {CONES.map((cone) => {
                  const s = cone.scale * (1 + progress * 0.05);
                  const cx = cone.baseX + (progress * 5 * (cone.baseX > 360 ? 1 : -1));
                  const cy = cone.baseY;
                  const bw = 36 * s;
                  const bh = 24 * s;
                  const th = 44 * s;
                  const tw = 10 * s;

                  return (
                    <g key={cone.id}>
                      {/* Cone silhouette */}
                      <polygon
                        points={`${cx},${cy - th} ${cx - tw},${cy} ${cx + tw},${cy}`}
                        fill="var(--screen-muted)"
                        opacity="0.6"
                      />
                      <rect x={cx - bw / 2} y={cy} width={bw} height={bh / 2}
                        fill="var(--screen-muted)" opacity="0.5" />

                      {/* Bounding box — bracket corners */}
                      {isPlaying || done ? (
                        <g stroke="var(--signal)" strokeWidth="1.5" fill="none">
                          <polyline points={`${cx - bw / 2 + 4},${cy - th} ${cx - bw / 2},${cy - th} ${cx - bw / 2},${cy - th + 8}`} />
                          <polyline points={`${cx + bw / 2 - 4},${cy - th} ${cx + bw / 2},${cy - th} ${cx + bw / 2},${cy - th + 8}`} />
                          <polyline points={`${cx - bw / 2},${cy + bh / 2 - 8} ${cx - bw / 2},${cy + bh / 2} ${cx - bw / 2 + 4},${cy + bh / 2}`} />
                          <polyline points={`${cx + bw / 2},${cy + bh / 2 - 8} ${cx + bw / 2},${cy + bh / 2} ${cx + bw / 2 - 4},${cy + bh / 2}`} />
                          <text x={cx} y={cy - th - 4} textAnchor="middle"
                            fill="var(--signal)" fontSize="9" fontFamily="var(--font-plex-mono), monospace">
                            cone
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}

                {/* Frame counter */}
                <text x="690" y="20" textAnchor="end" fill="var(--screen-muted)" fontSize="11"
                  fontFamily="var(--font-plex-mono), monospace">
                  frame {String(frame).padStart(4, "0")}
                </text>

                {/* Pipeline strip */}
                {STAGES.map((stage, i) => {
                  const active = isPlaying && pipelineStage % STAGES.length === i;
                  const x = 30 + i * 130;
                  return (
                    <g key={stage}>
                      <rect x={x} y="360" width="100" height="26" rx="3"
                        fill={active ? "var(--signal)" : "var(--screen)"}
                        stroke={active ? "var(--signal)" : "var(--screen-muted)"}
                        strokeWidth="1"
                        style={{ transition: "fill var(--t-status), stroke var(--t-status)" }}
                      />
                      <text x={x + 50} y="373" textAnchor="middle" dominantBaseline="middle"
                        fill={active ? "var(--screen)" : "var(--screen-muted)"}
                        fontSize="10" fontFamily="var(--font-plex-mono), monospace"
                        style={{ transition: "fill var(--t-status)" }}
                      >
                        {stage}
                      </text>
                      {i < STAGES.length - 1 && (
                        <text x={x + 112} y="373" textAnchor="middle" dominantBaseline="middle"
                          fill="var(--screen-muted)" fontSize="10">
                          →
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Caption */}
                <text x="360" y="345" textAnchor="middle" fill="var(--screen-muted)" fontSize="9"
                  fontFamily="var(--font-plex-sans), sans-serif">
                  Illustration of the detection loop; the notebook runs the real model.
                </text>
              </svg>
            </div>
          </div>

          {/* Play / Pause toggle */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => (isPlaying ? stopPlayback() : startPlayback())}
              className="type-identifier px-4"
              style={{
                minHeight: "44px",
                backgroundColor: "var(--signal)",
                color: "var(--screen)",
                border: "none",
                borderRadius: "var(--radius-control)",
                cursor: "pointer",
              }}
              aria-label={isPlaying ? "Pause detection loop" : "Play detection loop"}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>

          {/* Narration (accessible, in static HTML) */}
          <div aria-live="polite" className="sr-only">
            {isPlaying ? "Detection loop running" : done ? "Detection loop complete" : ""}
          </div>
          <ol className="type-caption mt-2 hidden" aria-label="con-Detection narration">
            <li>Video loaded; frame-by-frame processing with YOLOv5</li>
            <li>Bounding boxes track cone shapes across frames</li>
            <li>Illustration of the detection loop; the notebook runs the real model</li>
          </ol>
        </figure>
      </div>
    </ScreenBoundary>
  );
}
