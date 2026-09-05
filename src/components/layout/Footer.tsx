import { site } from "@/content/site";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="type-caption text-center py-8"
      style={{ color: "var(--graphite)", borderTop: "1px solid var(--hairline)" }}
    >
      <div
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
        }}
      >
        {site.name}
      </div>
    </footer>
  );
}
