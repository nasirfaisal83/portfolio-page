// rag-document-qa scene — all values from the README (design §7.2)
import type { Scene } from "../engine/types";

export const ragScene: Scene = {
  viewBox: [720, 400],
  nodes: [
    // Ingestion lane
    { id: "upload",   label: "upload",    x: 60,  y: 120, kind: "stage" },
    { id: "extract",  label: "extract",   x: 190, y: 120, kind: "stage" },
    { id: "chunk",    label: "chunk",     x: 320, y: 120, kind: "stage" },
    { id: "embed",    label: "embed",     x: 450, y: 120, kind: "stage" },
    { id: "store",    label: "pgvector",  x: 590, y: 120, kind: "store" },
    // Vector space (shared between ingest + query)
    { id: "vectors",  label: "vector space", x: 520, y: 220, w: 140, h: 80, kind: "store" },
    // Query lane
    { id: "question", label: "question",  x: 60,  y: 310, kind: "stage" },
    { id: "prompt",   label: "prompt",    x: 320, y: 310, kind: "stage" },
    { id: "answer",   label: "answer",    x: 460, y: 310, kind: "stage" },
    { id: "sources",  label: "sources",   x: 600, y: 310, kind: "stage" },
  ],
  edges: [
    { id: "e-upload-extract", from: "upload",   to: "extract" },
    { id: "e-extract-chunk",  from: "extract",  to: "chunk" },
    { id: "e-chunk-embed",    from: "chunk",    to: "embed" },
    { id: "e-embed-store",    from: "embed",    to: "store" },
    { id: "e-store-vectors",  from: "store",    to: "vectors" },
    { id: "e-question-vectors", from: "question", to: "vectors" },
    { id: "e-vectors-prompt", from: "vectors",  to: "prompt" },
    { id: "e-prompt-answer",  from: "prompt",   to: "answer" },
    { id: "e-answer-sources", from: "answer",   to: "sources" },
  ],
  narrow: {
    viewBox: [360, 480],
    nodes: [
      { id: "upload",   label: "upload",    x: 60,  y: 60 },
      { id: "extract",  label: "extract",   x: 60,  y: 140 },
      { id: "chunk",    label: "chunk",     x: 60,  y: 220 },
      { id: "embed",    label: "embed",     x: 60,  y: 300 },
      { id: "store",    label: "pgvector",  x: 60,  y: 380 },
      { id: "vectors",  label: "vector space", x: 240, y: 220, w: 140, h: 80 },
      { id: "question", label: "question",  x: 60,  y: 460 },
      { id: "prompt",   label: "prompt",    x: 200, y: 380 },
      { id: "answer",   label: "answer",    x: 300, y: 380 },
      { id: "sources",  label: "sources",   x: 300, y: 460 },
    ],
  },
};
