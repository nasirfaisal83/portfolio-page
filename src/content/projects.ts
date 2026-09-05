// src/content/projects.ts
// All factual project strings. No component may contain factual copy.

export type ScreenId = "order-saga" | "rag" | "agents" | "stomp" | "detection";

export interface Project {
  slug: string;
  title: string;
  github: string;
  screen: ScreenId;
  summary: string;
  stack: string[];
  highlights: string[];
}

export const projects: Project[] = [
  {
    slug: "order-saga",
    title: "Order-Saga",
    screen: "order-saga",
    github: "https://github.com/nasirfaisal83/Order-Saga",
    summary:
      "Order-processing system across 5 microservices (order, inventory, payment, shipping, notification) using the Choreography Saga pattern — no central orchestrator, services coordinate purely through Kafka events, with automatic compensation logic if a step fails (e.g. releasing reserved stock on payment failure). Spring Boot 3.4.3, Java 17, Kafka, PostgreSQL, Spring Cloud (Eureka, Gateway, OpenFeign), Docker Compose.",
    stack: [
      "Spring Boot 3.4.3",
      "Java 17",
      "Apache Kafka 7.5.0",
      "PostgreSQL 15 (one per service)",
      "Spring Cloud Eureka",
      "Spring Cloud Gateway",
      "Spring Cloud OpenFeign",
      "Spring Cloud 2024.0.1",
      "Spring Data JPA",
      "Maven",
      "Docker",
      "Docker Compose",
      "Kafka UI",
      "Zookeeper",
    ],
    highlights: [
      "Choreography, not orchestration: each service reacts to events and publishes its own result event; nothing coordinates centrally.",
      "Idempotent consumers: every service records processed event IDs in a ProcessedEvent table to tolerate Kafka's at-least-once delivery.",
      "Optimistic locking with @Version on the Product entity prevents double-booking inventory under concurrency.",
      "Compensation: a payment failure automatically releases reserved stock and fails the order; an inventory failure fails the order and notifies.",
      "One PostgreSQL database per service; OpenFeign clients call mock payment, shipping, and email providers that can be switched to fail for testing.",
      "Observability through the Eureka dashboard and Kafka UI; order status lifecycle PENDING, INVENTORY_RESERVED, PAYMENT_PROCESSING, COMPLETED, FAILED, COMPENSATING.",
    ],
  },
  {
    slug: "rag-document-qa",
    title: "rag-document-qa",
    screen: "rag",
    github: "https://github.com/nasirfaisal83/rag-document-qa",
    summary:
      "Full-stack RAG (Retrieval-Augmented Generation) application: upload documents, ask natural-language questions, get streamed answers grounded in the source text. Spring Boot 3.3 + Spring AI 1.0, OpenAI GPT-4o, PostgreSQL + pgvector for vector search, with a 3-strategy PDF extraction pipeline (PDFBox → Tesseract OCR → GPT-4o Vision) and SSE token streaming with source citations.",
    stack: [
      "Spring Boot 3.3",
      "Spring MVC",
      "Spring AI 1.0",
      "OpenAI GPT-4o",
      "text-embedding-3-small (1536 dimensions)",
      "PostgreSQL 16",
      "pgvector",
      "Spring Data JPA (Hibernate)",
      "Flyway",
      "Project Reactor",
      "Spring WebFlux",
      "Apache PDFBox",
      "Tesseract via Tess4J",
      "GPT-4o Vision",
      "Apache POI",
      "JTokkit",
      "Lombok",
      "SpringDoc OpenAPI",
      "Vanilla HTML/CSS/JS",
      "Docker Compose",
      "Java 21",
    ],
    highlights: [
      "Asynchronous ingestion: the upload returns 202 Accepted with a document ID at once and the frontend polls status (PROCESSING, READY, FAILED).",
      "Strategy pattern for extraction: one handler per file type behind a DocumentHandler interface; PDF, DOCX, PPTX, XLSX, text, and images.",
      "PDF three-strategy waterfall per page: PDFBox digital text, then Tesseract OCR, then GPT-4o Vision as the last resort, so no page is silently skipped.",
      "Token-aware chunking with JTokkit using OpenAI's CL100K_BASE tokenizer: 500-token chunks with 50-token overlap.",
      "Native SQL for cosine similarity search on pgvector with an IVFFlat index (100 lists); top-k 5 by default.",
      "Server-Sent Events over a Flux<ServerSentEvent> so each token is flushed past Tomcat's 8 KB buffer and reaches the browser immediately.",
      "Cross-document search implemented purely in SQL, with no schema change; confidence is the average cosine similarity of the retrieved chunks.",
    ],
  },
  {
    slug: "tech-news-agent",
    title: "tech-news-agent",
    screen: "agents",
    github: "https://github.com/nasirfaisal83/tech-news-agent",
    summary:
      "Multi-agent pipeline that turns a tech topic into a fact-checked, LinkedIn-ready post: an OrchestratorAgent runs a ReAct loop coordinating five specialized agents (Scout, Reporter, Editor, FactChecker, LinkedInWriter), with an automatic retry if the fact-check confidence score is too low. Spring Boot, Spring AI, OpenAI GPT-4o-mini, Tavily Search API, GitHub MCP Server, Java 21.",
    stack: [
      "Spring Boot 3.5.0",
      "Spring AI 1.0.0",
      "OpenAI gpt-4o-mini",
      "Tavily Search API",
      "GitHub MCP Server v0.6.2",
      "Spring WebFlux (WebClient)",
      "Java 21",
      "Maven",
    ],
    highlights: [
      "The orchestrator runs a ReAct loop: it reasons, calls tools, observes results, and decides the next step.",
      "The retry is decided by the model: if fact-check confidence falls below 0.6, facts are re-extracted; nothing in Java hardcodes the loop.",
      "Tools: Tavily web search, a page-fetch tool, and GitHub data through the GitHub MCP server.",
      "A ContextSizeAdvisor guards against token overflow; each agent has its own system prompt under resources/prompts.",
      "One POST /api/news/generate call returns the post, a verified article with [HIGH], [MEDIUM], and [UNVERIFIED] markers, overall confidence, fact counts, and processing time; a run takes 30–90 seconds.",
    ],
  },
  {
    slug: "emergency-alert-system",
    title: "Emergency-Alert-System",
    screen: "stomp",
    github: "https://github.com/nasirfaisal83/Emergency-Alert-System",
    summary:
      "Distributed publish-subscribe alert broadcasting system built on the STOMP protocol: a Java 8 server (switchable between a thread-per-client model and a non-blocking reactor/NIO model) paired with a C++11 command-line client (Boost ASIO) for real-time channel subscription and event broadcast.",
    stack: [
      "Java 8",
      "Maven",
      "STOMP",
      "Java NIO selector (reactor mode)",
      "C++11",
      "Make",
      "Boost ASIO",
      "Boost Thread",
    ],
    highlights: [
      "Two selectable server threading models: thread-per-client (one OS thread per connection) and reactor (a non-blocking NIO selector with an actor thread pool).",
      "Supported frames: CONNECT, SUBSCRIBE, UNSUBSCRIBE, SEND, DISCONNECT from clients; CONNECTED, MESSAGE, RECEIPT, ERROR from the server.",
      "The C++ client offers login, join, exit, report, summary, and logout commands, and reads events to publish from a JSON file.",
      "Subscribers on a channel receive MESSAGE frames for events other clients send to it.",
    ],
  },
  {
    slug: "con-detection",
    title: "con-Detection",
    screen: "detection",
    github: "https://github.com/nasirfaisal83/con-Detection",
    summary:
      "Cone-detection system built on YOLOv5, processing video frame-by-frame to identify and bound traffic cones — aimed at applications like autonomous-driving tests and robotics navigation. Python, built and run in Google Colab.",
    stack: [
      "Python 3.7+",
      "YOLOv5",
      "PyTorch (torch, torchvision, torchaudio)",
      "OpenCV (opencv-python-headless 4.5.2.52)",
      "Jupyter Notebook",
      "Google Colab",
    ],
    highlights: [
      "Runs the YOLOv5 object detection model over a video file frame by frame, drawing bounding boxes around detected cones.",
      "Built for Google Colab's hosted, Linux-based notebook environment; no local setup beyond cloning and installing dependencies.",
      "The sample video is kept out of the repository because of size; the notebook expects it on the local machine.",
    ],
  },
];
