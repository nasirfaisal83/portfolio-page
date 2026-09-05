interface StackTableProps {
  stack: readonly string[];
}

// Layer heuristics — maps stack entries to layer names
function inferLayer(item: string): string {
  const i = item.toLowerCase();
  if (i.includes("spring boot") || i.includes("spring mvc") || i.includes("next.js")) return "Framework";
  if (i.includes("java") || i.includes("python") || i.includes("c++") || i.includes("typescript")) return "Language";
  if (i.includes("kafka") || i.includes("stomp") || i.includes("boost")) return "Messaging";
  if (i.includes("postgresql") || i.includes("pgvector") || i.includes("flyway")) return "Database";
  if (i.includes("docker") || i.includes("maven") || i.includes("make")) return "Infra";
  if (i.includes("openai") || i.includes("spring ai") || i.includes("yolo") || i.includes("torch")) return "AI/ML";
  if (i.includes("spring cloud") || i.includes("spring data") || i.includes("spring web")) return "Spring";
  if (i.includes("pdfbox") || i.includes("tesseract") || i.includes("poi") || i.includes("jtokkit")) return "Processing";
  return "Library";
}

export function StackTable({ stack }: StackTableProps) {
  return (
    <table
      className="w-full type-caption"
      style={{ borderCollapse: "collapse", maxWidth: "none" }}
    >
      <thead>
        <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
          <th
            className="text-left pb-2 pr-6 type-caption"
            style={{ color: "var(--graphite)", fontWeight: 500 }}
          >
            Layer
          </th>
          <th
            className="text-left pb-2 type-caption"
            style={{ color: "var(--graphite)", fontWeight: 500 }}
          >
            Technology
          </th>
        </tr>
      </thead>
      <tbody>
        {stack.map((item) => (
          <tr key={item} style={{ borderBottom: "1px solid var(--hairline)" }}>
            <td
              className="py-2 pr-6"
              style={{ color: "var(--graphite)", whiteSpace: "nowrap" }}
            >
              {inferLayer(item)}
            </td>
            <td className="py-2" style={{ color: "var(--ink)" }}>
              {item}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
