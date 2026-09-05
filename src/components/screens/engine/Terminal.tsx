"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  /** Text to stream word-by-word */
  text?: string;
  /** Words per second */
  rate?: number;
  /** Side strip event lines */
  eventLines?: string[];
}

/** A monospaced terminal strip that streams words and flicks side event lines. */
export function Terminal({
  x,
  y,
  width = 180,
  height = 48,
  text = "",
  rate = 8,
  eventLines = [],
}: TerminalProps) {
  const [displayed, setDisplayed] = useState("");
  const [visibleEvent, setVisibleEvent] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordIndexRef = useRef(0);

  useEffect(() => {
    if (!text) { setDisplayed(""); return; }
    const words = text.split(" ");
    wordIndexRef.current = 0;
    setDisplayed("");

    intervalRef.current = setInterval(() => {
      if (wordIndexRef.current < words.length) {
        setDisplayed((d) => (d ? `${d} ${words[wordIndexRef.current]}` : words[wordIndexRef.current]));
        wordIndexRef.current++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 1000 / rate);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, rate]);

  // Cycle through event lines
  useEffect(() => {
    if (!eventLines.length) return;
    let i = 0;
    const iv = setInterval(() => {
      setVisibleEvent(eventLines[i % eventLines.length]);
      i++;
    }, 600);
    return () => clearInterval(iv);
  }, [eventLines]);

  // Wrap text into 3 lines
  const words = displayed.split(" ");
  const charsPerLine = Math.floor(width / 7);
  const lines: string[] = [];
  let currentLine = "";
  for (const w of words) {
    if ((currentLine + " " + w).trim().length > charsPerLine) {
      lines.push(currentLine.trim());
      currentLine = w;
    } else {
      currentLine = currentLine ? `${currentLine} ${w}` : w;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  const lastThree = lines.slice(-3);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        rx="3"
        fill="var(--screen)"
        stroke="var(--screen-muted)"
        strokeWidth="1"
      />
      {lastThree.map((line, i) => (
        <text
          key={i}
          x="6"
          y={14 + i * 14}
          fill="var(--screen-ink)"
          fontSize="10"
          fontFamily="var(--font-plex-mono), monospace"
        >
          {line}
        </text>
      ))}
      {/* Side event strip */}
      {visibleEvent && (
        <text
          x={width + 6}
          y={14}
          fill="var(--screen-muted)"
          fontSize="9"
          fontFamily="var(--font-plex-mono), monospace"
        >
          {visibleEvent}
        </text>
      )}
    </g>
  );
}
