"use client";

interface ScreenTextProps {
  narrationLines: string[];
  activeScenarioLabel?: string;
  visible: boolean;
  ariaLabel: string;
}

/**
 * Polite aria-live narration region + ordered list of steps.
 * Present in static HTML for indexability (R14.16).
 */
export function ScreenText({ narrationLines, activeScenarioLabel, visible, ariaLabel }: ScreenTextProps) {
  return (
    <div>
      {/* Polite live region — announces each say step */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="sr-only"
      >
        {narrationLines[narrationLines.length - 1] ?? ""}
      </div>

      {/* Visible ordered narration — toggled by "Show as text" */}
      <div
        aria-label={ariaLabel}
        style={{
          display: visible ? "block" : "none",
          marginTop: "12px",
          padding: "12px 16px",
          backgroundColor: "var(--screen)",
          borderRadius: "var(--radius-screen)",
          border: "1px solid var(--hairline)",
        }}
      >
        {activeScenarioLabel && (
          <p
            className="type-identifier mb-2"
            style={{ color: "var(--signal)", marginBottom: "8px" }}
          >
            {activeScenarioLabel}
          </p>
        )}
        {narrationLines.length > 0 ? (
          <ol
            className="type-caption list-decimal pl-4"
            style={{ color: "var(--screen-ink)", maxWidth: "none" }}
          >
            {narrationLines.map((line, i) => (
              <li key={i} style={{ marginBottom: "4px" }}>
                {line}
              </li>
            ))}
          </ol>
        ) : (
          <p className="type-caption" style={{ color: "var(--screen-muted)" }}>
            Play a scenario to see the steps.
          </p>
        )}
      </div>
    </div>
  );
}
