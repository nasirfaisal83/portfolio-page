import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="flex flex-col items-start justify-center"
      style={{
        minHeight: "60vh",
        maxWidth: "var(--content-max)",
        margin: "0 auto",
        padding: "var(--section-padding) var(--gutter)",
      }}
    >
      <p className="type-identifier mb-4" style={{ color: "var(--graphite)" }}>
        404
      </p>
      <h1 className="type-h2 mb-6" style={{ maxWidth: "none" }}>
        Page not found
      </h1>
      <p className="type-body mb-8" style={{ color: "var(--graphite)" }}>
        The path you followed doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="type-body no-underline px-5 py-3 rounded"
        style={{
          backgroundColor: "var(--ink)",
          color: "var(--vellum)",
          textDecoration: "none",
          borderRadius: "var(--radius-control)",
        }}
      >
        Back to home
      </Link>
    </section>
  );
}
