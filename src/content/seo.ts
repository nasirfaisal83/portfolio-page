// src/content/seo.ts
// Titles, descriptions, and per-page SEO data. All locked to PRD §9.5.

export const seo = {
  home: {
    title: "Faisal Nasir — CS student, Ben-Gurion University",
    description:
      "Faisal Nasir, CS student at Ben-Gurion University. Projects: a Kafka choreography saga, RAG document Q&A, a multi-agent news pipeline, STOMP alerts, YOLOv5.",
  },
  suffix: " | Faisal Nasir",
  projects: {
    "salon-appointment-system": {
      title: "Salon Appointment System: Spring Boot and Next.js",
      description:
        "A production booking system built solo for a salon: no-account booking with phone verification, stylist approval, and no double-booking enforced by PostgreSQL.",
      programmingLanguage: ["Java", "TypeScript"],
    },
    "order-saga": {
      title: "Order-Saga: choreography saga with Spring Boot and Kafka",
      description:
        "Order processing across five microservices with the Choreography Saga pattern: no central orchestrator, Kafka events, and automatic compensation when a step fails.",
      programmingLanguage: ["Java"],
    },
    "rag-document-qa": {
      title: "rag-document-qa: RAG document Q&A with Spring AI and pgvector",
      description:
        "Upload documents and ask questions in plain language; answers stream token by token with cited sources. Spring Boot, Spring AI, GPT-4o, PostgreSQL with pgvector.",
      programmingLanguage: ["Java"],
    },
    "tech-news-agent": {
      title: "tech-news-agent: multi-agent news pipeline with Spring AI",
      description:
        "An orchestrator runs a ReAct loop over five agents to turn a tech topic into a fact-checked LinkedIn post, retrying when confidence is low. Spring AI, GPT-4o-mini.",
      programmingLanguage: ["Java"],
    },
    "emergency-alert-system": {
      title: "Emergency-Alert-System: STOMP pub/sub in Java and C++",
      description:
        "A STOMP publish-subscribe server in Java 8 with thread-per-client and reactor modes, and a C++11 Boost ASIO client for channel subscription and broadcast.",
      programmingLanguage: ["Java", "C++"],
    },
    "con-detection": {
      title: "con-Detection: YOLOv5 cone detection in Python",
      description:
        "YOLOv5 run over video frame by frame to detect and box traffic cones, built and run in Google Colab for autonomous-driving and robotics tests.",
      programmingLanguage: ["Python"],
    },
  },
} as const;

export type ProjectSlug = keyof typeof seo.projects;
