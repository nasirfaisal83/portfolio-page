import { site } from "@/content/site";

/** Name h1 — Latin, with hidden Arabic/Hebrew spans while placeholders remain. */
export function Name() {
  // Arabic/Hebrew renderings are hidden when empty (intentionally omitted) or a TODO_ placeholder.
  const arabicValue: string = site.nameArabic;
  const hebrewValue: string = site.nameHebrew;
  const hasArabic = arabicValue.length > 0 && !arabicValue.startsWith("TODO_");
  const hasHebrew = hebrewValue.length > 0 && !hebrewValue.startsWith("TODO_");

  return (
    <h1 className="type-name" style={{ maxWidth: "none", lineHeight: 1.0 }}>
      {site.name}
      {hasArabic && (
        <span lang="ar" dir="rtl" className="block" style={{ fontSize: "0.6em", marginTop: "0.15em" }}>
          {site.nameArabic}
        </span>
      )}
      {hasHebrew && (
        <span lang="he" dir="rtl" className="block" style={{ fontSize: "0.6em", marginTop: "0.05em" }}>
          {site.nameHebrew}
        </span>
      )}
    </h1>
  );
}
