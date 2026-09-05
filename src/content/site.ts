// src/content/site.ts
// All factual strings about the person. No component may contain factual copy.

export const site = {
  name: "Faisal Nasir",
  // Arabic/Hebrew name renderings intentionally omitted — empty string hides the spans.
  nameArabic: "",
  nameHebrew: "",
  roleLine: "CS student at Ben-Gurion University of the Negev (expected graduation 2028)",
  location: "Based in Israel",
  languages: "Arabic, Hebrew, English",
  // Tagline intentionally omitted — empty string hides the tagline slot.
  tagline: "",
  email: "nasirfaisal83@gmail.com",
  github: "https://github.com/nasirfaisal83",
  linkedin: "https://www.linkedin.com/in/faisal-nasir-381a33131",
  resumeUrl: "/resume.pdf",
  description:
    "CS student at Ben-Gurion University of the Negev, teaching assistant, and Hasoub on-campus community manager. Five public projects: RAG document Q&A, a choreography saga, a multi-agent news pipeline, a STOMP alert system, and YOLOv5 cone detection.",
} as const;
