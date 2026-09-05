// src/content/experience.ts
// All factual experience and about strings. No component may contain factual copy.

export const experience = [
  {
    role: "Teaching Assistant",
    org: "Ben-Gurion University of the Negev",
    detail: "Data Structures; Introduction to CS (Java & OOP)",
    period: "2024 – Present",
  },
  {
    role: "On-Campus Community Manager",
    org: "Hasoub",
    detail: "Organizes talks, industry events, and a hackathon",
    period: "2024 – Present",
  },
] as const;

export const about = {
  study:
    "Computer Science student at Ben-Gurion University of the Negev, expected graduation 2028. Teaching Assistant for Data Structures and Introduction to CS (Java & OOP).",
  community:
    "On-Campus Community Manager for Hasoub, a tech community in Israel: talks, industry events, and a hackathon.",
  learning:
    "Self-directed: a structured AI engineering roadmap and off-campus bootcamps in microservices/DevOps, agentic AI, and Python/deep learning. Coursework includes the System Programming Laboratory (C, x86 NASM assembly, Unix processes and signals, ELF format) and Principles of Programming Languages (TypeScript functional programming, Ramda, monads, L3/Scheme).",
} as const;
