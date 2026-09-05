"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
      className="type-caption px-3 py-2"
      style={{
        backgroundColor: copied ? "var(--signal-deep)" : "transparent",
        color: copied ? "var(--vellum)" : "var(--graphite)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-control)",
        cursor: "pointer",
        transition: "background-color var(--t-ui), color var(--t-ui)",
        minHeight: "44px",
      }}
    >
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
