"use client";

import React from "react";

interface ScreenBoundaryProps {
  children: React.ReactNode;
  /** Static fallback SVG (end-state) rendered when the screen errors. */
  fallbackSvg?: React.ReactNode;
  ariaLabel?: string;
}

interface ScreenBoundaryState {
  hasError: boolean;
}

/** Error boundary for screen components. On error, renders a static fallback. */
export class ScreenBoundary extends React.Component<ScreenBoundaryProps, ScreenBoundaryState> {
  constructor(props: ScreenBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ScreenBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ScreenBoundary] Screen error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <figure
          role="group"
          aria-label={this.props.ariaLabel ?? "Screen unavailable"}
          style={{
            backgroundColor: "var(--screen)",
            borderRadius: "var(--radius-screen)",
            border: "1px solid var(--hairline)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {this.props.fallbackSvg ?? (
            <div style={{ color: "var(--screen-muted)", fontFamily: "var(--font-plex-mono)", fontSize: "13px" }}>
              Screen unavailable. Enable JavaScript and reload to run the scenarios.
            </div>
          )}
        </figure>
      );
    }

    return this.props.children;
  }
}
