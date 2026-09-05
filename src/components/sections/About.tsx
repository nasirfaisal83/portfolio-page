import { about, experience } from "@/content/experience";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="heading-about"
      style={{ padding: "var(--section-padding) 0" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "48px",
        }}
      >
        {/* About — left */}
        <div style={{ gridColumn: "span 6" }} className="min-[1024px]:col-span-6 col-span-12">
          <h2 id="heading-about" className="type-h2 mb-8" style={{ maxWidth: "none" }}>
            About
          </h2>
          <p className="type-body mb-4">{about.study}</p>
          <p className="type-body mb-4">{about.community}</p>
          <p className="type-body">{about.learning}</p>
        </div>

        {/* Experience — right */}
        <div style={{ gridColumn: "span 6" }} className="min-[1024px]:col-span-6 col-span-12">
          <h2 className="type-h2 mb-8" style={{ maxWidth: "none" }}>
            Experience
          </h2>
          <ol className="list-none p-0 m-0 flex flex-col gap-6" style={{ maxWidth: "none" }}>
            {experience.map((entry) => {
              const periodValue: string = entry.period;
              const hasDates = periodValue.length > 0 && periodValue !== "TODO_DATES";
              return (
                <li key={entry.role} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0 pt-1">
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "var(--signal-deep)",
                        marginBottom: "4px",
                      }}
                    />
                    <div
                      style={{
                        width: "1px",
                        flex: 1,
                        backgroundColor: "var(--hairline)",
                      }}
                    />
                  </div>
                  <div>
                    {hasDates && (
                      <p className="type-caption mb-1" style={{ color: "var(--graphite)" }}>
                        {entry.period}
                      </p>
                    )}
                    <p className="type-body-em">{entry.role}</p>
                    <p className="type-body" style={{ color: "var(--graphite)" }}>
                      {entry.org}
                    </p>
                    <p className="type-caption mt-1" style={{ color: "var(--graphite)" }}>
                      {entry.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
