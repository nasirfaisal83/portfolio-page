import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="type-caption mb-6">
      <ol className="flex items-center gap-2 list-none p-0 m-0" style={{ maxWidth: "none" }}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span style={{ color: "var(--graphite)" }} aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="type-caption"
                style={{ color: "var(--signal-deep)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: "var(--ink)" }} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
