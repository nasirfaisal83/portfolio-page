// src/content/casestudy.ts
// Case-study prose for each project page.
// Written as case studies, paraphrased from the READMEs — not copied.
// Each page has ≥300 words across "What it does", "How it works", and "Design decisions".

export interface CaseStudy {
  whatItDoes: string;
  howItWorks: { heading: string; body: string }[];
  designDecisions: string[];
}

export const caseStudies: Record<string, CaseStudy> = {
  "salon-appointment-system": {
    whatItDoes: `A salon taking bookings by phone call and messaging app has three problems at once: every request interrupts someone mid-appointment, availability lives in one person's head so double-bookings happen, and there is no reporting beyond a cash drawer. This system replaces that. It was built solo for a real client and runs in production, serving three audiences from one codebase — a public customer site, a stylist dashboard, and an owner dashboard with catalogue management and revenue reporting. Customers never create an account. They pick services, choose a stylist or leave it open, select a time, and prove ownership of their phone number with a one-time code. Everything after that is handled by the system: notifying the right stylist, sending confirmations and reminders, and issuing a signed link that lets the customer cancel or reschedule without logging in. The interface is trilingual — Hebrew, Arabic and English — with full right-to-left layout.`,
    howItWorks: [
      {
        heading: "Why a booking is a request, not a confirmation",
        body: `The obvious design is instant confirmation: the customer picks a slot, the slot is taken, done. This system deliberately does not do that, because a stylist needs the right to decline — a customer with a history of no-shows, a service that needs an in-person consultation first, a slot being held for a regular. So a booking arrives as a request and confirmation is a human decision. That single choice propagated through the whole architecture. The appointment needs a seven-state machine rather than a boolean. Unactioned requests must expire automatically or they hold slots forever, which means a background worker. The database has to treat pending and confirmed appointments identically when preventing overlaps, otherwise two pending requests could both be approved onto the same slot. Every state change needs an outbound message, because the customer is not sitting watching a screen. Most of the interesting engineering in the project follows from that one product decision.`,
      },
      {
        heading: "How two customers cannot take the same slot",
        body: `Two people tapping the same slot within milliseconds is not an edge case for a booking system; at peak it is the normal case. The availability check in the service layer cannot solve it, because both requests can pass their check before either commits. So that check is treated as advisory — its job is to produce a friendly error message in the common case, not to be correct under load. The actual guarantee is a PostgreSQL exclusion constraint over the stylist and the appointment's time range, and it physically cannot admit two overlapping active appointments for one stylist. Three details in it are deliberate. The btree_gist extension is required because a GiST index handles ranges natively but not scalar equality on a UUID column, so the extension supplies the operator class that lets both predicates share one index. The range is end-exclusive, so an appointment finishing at 14:00 and one starting at 14:00 do not collide and back-to-back booking works. And the constraint is partial, applying only to pending and confirmed rows, so cancellation history never blocks a re-book while a pending request still holds its slot. When the constraint fires, only that specific SQLSTATE is translated into a slot-conflict response; a unique-violation on the customer row would otherwise be mislabelled as "this time was just taken" and send the user off to re-pick a slot that was never the problem.`,
      },
      {
        heading: "How rescheduling never loses the original slot",
        body: `Rescheduling is where the request-based model gets interesting. Because a new time also needs approval, simply moving the appointment would release the original slot into a window where the new time might be declined — leaving the customer with nothing. Instead, a reschedule inserts a new appointment row in the requested state that points back at the original. The original is not touched: still confirmed, still holding its slot, still carrying its reminders. When the assigned stylist approves the replacement, the original is cancelled silently in the same operation. If nobody ever approves it, the replacement simply expires and the original booking stands. The customer cannot end up with no appointment because they tried to move one, which is exactly the failure a naive row update would risk.`,
      },
      {
        heading: "Why prices are frozen at booking time",
        body: `If reports read the live service catalogue, raising a price rewrites history — every past revenue figure silently changes. So each appointment's line items snapshot the duration and price at the moment of booking, after any per-stylist override has been applied. Prices are stored as a minimum and maximum pair rather than a nullable single value: equal for fixed-price services, genuinely different for ranged ones, which means a multi-service total is always computable and never collapses to null. Attributing one cash payment across several services then uses a pro-rata split where the last line absorbs the rounding remainder, so the parts always sum exactly to the amount paid. A report whose parts do not add up to the whole is one the owner stops trusting entirely.`,
      },
    ],
    designDecisions: [
      "A database exclusion constraint prevents overlaps rather than application-level locking or checks, so correctness cannot be bypassed by a future code path and holds under genuine concurrency.",
      "Bookings are requests rather than instant confirmations, matching the client's actual workflow where stylists must be able to decline.",
      "Identity is a phone number with no accounts and no passwords, which removes the largest drop-off point in salon booking and leaves no password store to breach.",
      "Flyway owns the schema and Hibernate runs in validate mode, never generating DDL, so schema history is reviewable and ordered and production DDL is never inferred.",
      "Messages are a template identifier plus ordered parameters rather than rendered strings, which keeps a WhatsApp Business migration a configuration change rather than a rewrite.",
      "Availability is computed on demand instead of materialised into a slots table, so there is nothing to keep in sync or backfill and settings changes take effect immediately.",
      "A dual-write window in reminder dispatch is documented and accepted rather than papered over with partial bookkeeping; the failure mode is a duplicate reminder, not a lost appointment.",
    ],
  },

  "order-saga": {
    whatItDoes: `Order-Saga is an order-processing system split across five independent microservices — order, inventory, payment, shipping, and notification — that coordinate entirely through events on a Kafka bus. There is no central orchestrator telling each service what to do. Instead, each service reacts to the events it cares about and publishes its own result event, building a saga that either reaches a COMPLETED state or unwinds itself through automatic compensation when something fails.`,
    howItWorks: [
      {
        heading: "How five services coordinate without an orchestrator",
        body: `When a request arrives at the Gateway, it is forwarded to the Order service, which creates an order record in PENDING state and publishes an order.created event to Kafka. The Inventory service picks up that event, checks and reserves stock, then publishes inventory.reserved. Payment receives that same event and calls an external mock payment gateway. A successful response produces payment.succeeded, which triggers both Shipping and the Order service — Shipping creates a shipment and publishes shipment.created, which notifies both the Order service (COMPLETED) and the Notification service. No service ever calls another service directly; every handoff is a Kafka event.`,
      },
      {
        heading: "What happens when a payment fails",
        body: `If the payment gateway returns a failure, Payment publishes payment.failed to all three relevant topics. Inventory receives this and releases the previously reserved stock — the compensation step. Order receives the same event and moves to FAILED after passing through COMPENSATING. Notification receives payment.failed and sends a failure email. The entire compensation chain is driven by the same event-reacting model as the happy path; no extra orchestration layer is needed.`,
      },
      {
        heading: "Idempotent consumers and optimistic locking",
        body: `Kafka delivers messages at least once, so each service records the ID of every event it has already processed in a ProcessedEvent table. A duplicate delivery is detected and silently discarded rather than causing a double-booking. The Product entity in Inventory uses a JPA @Version field for optimistic locking, so two simultaneous reservation requests cannot both succeed against the same stock without one retrying.`,
      },
    ],
    designDecisions: [
      "Choreography over orchestration: no saga orchestrator process exists, which eliminates a single point of failure and keeps each service independently deployable.",
      "One PostgreSQL database per service: each service owns its data and schema, with no shared tables or cross-service joins.",
      "OpenFeign clients target mock providers for payment, shipping, and email, making it easy to simulate failures without modifying business logic.",
      "The Eureka service registry is used for client-side load balancing rather than hard-coded addresses, enabling the Gateway to route by service name.",
      "Kafka UI and the Eureka dashboard provide operational visibility without any custom monitoring code.",
    ],
  },

  "rag-document-qa": {
    whatItDoes: `rag-document-qa is a full-stack Retrieval-Augmented Generation application. Users upload documents, ask natural-language questions about them, and receive answers that stream into the page token by token, each grounded in the actual text of the uploaded files rather than the model's training data alone. Source citations — chunk number and page — appear alongside the answer so the user can verify what was retrieved.`,
    howItWorks: [
      {
        heading: "Why ingestion is asynchronous",
        body: `When a document is uploaded, the API immediately returns a 202 Accepted response with a document ID rather than waiting for the full extraction and embedding pipeline to complete. The frontend polls the document's status (PROCESSING, READY, FAILED) until the background job finishes. This keeps the upload endpoint fast and decouples the slow work — OCR, chunking, embedding — from the HTTP response cycle.`,
      },
      {
        heading: "How a scanned page still gets text",
        body: `PDF extraction uses a three-strategy waterfall. The first attempt uses Apache PDFBox to read the digital text layer directly; this is fast and accurate for born-digital PDFs. If a page yields fewer than a minimum number of characters — a sign that it is a scanned image — the extractor falls through to Tesseract OCR via Tess4J. If Tesseract also fails, GPT-4o Vision is the last resort, treating the page as an image and asking the model to transcribe it. No page is silently skipped.`,
      },
      {
        heading: "How answers stream token by token",
        body: `Retrieval uses a native SQL cosine-similarity query on a pgvector IVFFlat index (100 lists) to find the five nearest chunks to the embedded question. Those chunks are assembled into a prompt and sent to GPT-4o. The response is streamed back using Spring WebFlux's Flux pipeline over Server-Sent Events, flushing each token past Tomcat's response buffer immediately so the user sees words appearing as the model generates them. Confidence is the average cosine similarity of the five retrieved chunks.`,
      },
    ],
    designDecisions: [
      "Token-aware chunking with JTokkit and OpenAI's CL100K_BASE tokenizer produces 500-token chunks with 50-token overlap, matching the tokenizer used by the embedding model.",
      "IVFFlat indexing with 100 lists is a deliberate trade-off: faster approximate search at the cost of a small recall drop, acceptable for document Q&A where retrieval latency matters.",
      "Cross-document search is implemented purely in SQL with no schema change; the same vector table holds embeddings from all documents.",
      "The three-strategy extraction waterfall is implemented behind a DocumentHandler interface, making it straightforward to add new file types or swap out strategies.",
      "SSE streaming via Flux<ServerSentEvent> flushes tokens past the 8 KB buffer threshold that would otherwise batch them before delivery.",
    ],
  },

  "tech-news-agent": {
    whatItDoes: `tech-news-agent is a multi-agent pipeline that takes a technology topic as input and produces a fact-checked, LinkedIn-ready post as output. An OrchestratorAgent runs a ReAct (Reason + Act) loop, coordinating five specialized agents — Scout, Reporter, Editor, FactChecker, and LinkedInWriter — and automatically retrying the fact-extraction step when the confidence score falls below a threshold. The entire pipeline is driven by the language model's reasoning; no Java code hardcodes the retry condition.`,
    howItWorks: [
      {
        heading: "How the orchestrator decides to retry",
        body: `The OrchestratorAgent operates in a tight loop: it reasons about the current state, issues a tool call or agent dispatch, observes the result, and decides what to do next. When the FactCheckerAgent returns a confidence score below 0.6, the model itself decides — based on its system prompt and the returned score — to send the article back to the Reporter for a second round of fact extraction. There is no if-statement in the Java code that checks the threshold; the model's own judgment drives the loop.`,
      },
      {
        heading: "How facts are gathered",
        body: `The ScoutAgent uses two tools: the Tavily Search API for live web search and a page-fetch utility for reading full article text. It also queries GitHub data through a GitHub MCP (Model Context Protocol) server, allowing the agent to examine repository metadata alongside news content. The gathered facts are counted and passed to the Reporter as a structured input.`,
      },
      {
        heading: "How the pipeline handles long contexts",
        body: `A ContextSizeAdvisor monitors the cumulative token count across the conversation and prunes or summarizes earlier turns before they exceed the model's context window. Each agent has its own dedicated system prompt stored under resources/prompts, so the model always knows which role it is playing, regardless of how many turns have accumulated.`,
      },
    ],
    designDecisions: [
      "ReAct (Reason + Act) was chosen over a fixed pipeline because real articles require adaptive behavior: the number of search queries, the depth of fact-checking, and the need for a retry all depend on the content.",
      "The retry threshold of 0.6 is a guideline communicated to the model through its system prompt, not a hard-coded guard in Java — this is intentional to allow the model to override it when context makes a lower-confidence article acceptable.",
      "Using a GitHub MCP server rather than a direct API client means the agent can be granted GitHub access without embedding credentials in the application code.",
      "Spring AI 1.0's tool-calling API abstracts over the model provider, so switching from GPT-4o-mini to another model requires only a configuration change.",
      "One POST endpoint returns the entire enriched result — post, verified article, confidence, fact count, and timing — rather than streaming partial results, because the consumer (LinkedIn) expects a complete, editable draft.",
    ],
  },

  "emergency-alert-system": {
    whatItDoes: `Emergency-Alert-System is a distributed publish-subscribe alert broadcasting system built on the STOMP protocol. A Java 8 server accepts connections from C++11 command-line clients, manages channel subscriptions, and broadcasts events to all subscribers. The server can run in two modes: thread-per-client, which allocates one OS thread per connection, and a non-blocking reactor mode built on Java NIO that multiplexes all connections through a single selector thread backed by an actor thread pool.`,
    howItWorks: [
      {
        heading: "Thread-per-client versus reactor",
        body: `In thread-per-client mode, each accepted connection gets its own OS thread. This is simple to implement and reason about — each thread blocks on reads and writes for its own client — but does not scale to thousands of simultaneous connections because each thread carries significant stack memory and scheduling overhead. In reactor mode, a single NIO selector thread monitors all connection sockets for readability and writability. When a socket is ready, the selector dispatches the work to an actor thread pool rather than blocking. This allows one selector to serve many connections with far fewer threads, at the cost of additional complexity in the event loop.`,
      },
      {
        heading: "How a broadcast reaches only subscribers",
        body: `When a client sends a SEND frame to a channel (for example, germany), the server looks up all clients that have previously sent a SUBSCRIBE frame for that channel and delivers a MESSAGE frame to each of them. The publishing client receives a RECEIPT frame instead of a MESSAGE — it is not subscribed to the channel it published to unless it explicitly sent a SUBSCRIBE frame. This separation between publishing and subscribing is a core property of the STOMP pub/sub model.`,
      },
    ],
    designDecisions: [
      "STOMP was chosen over a custom protocol because it is a well-specified, text-based protocol that is easy to implement from scratch in both Java and C++, and its frame structure maps directly to pub/sub semantics.",
      "The two threading modes are selectable at startup rather than configurable at runtime; this was a deliberate choice to keep the implementation of each mode simple and fully separated.",
      "The C++ client uses Boost ASIO for asynchronous I/O, which mirrors the reactor pattern used in the Java server and allows the client to handle responses while blocked on user input.",
      "The server reads events to broadcast from a JSON file rather than accepting them interactively, which makes the set of test events reproducible and avoids parsing complexity in the client.",
    ],
  },

  "con-detection": {
    whatItDoes: `con-Detection is a cone-detection system built on YOLOv5 that processes a video file frame by frame, drawing bounding boxes around traffic cones in each frame. It is aimed at applications such as autonomous-driving tests and robotics navigation where reliable cone detection is a prerequisite for path planning. The system runs in a Google Colab notebook, leveraging Colab's hosted GPU runtime without requiring any local hardware setup.`,
    howItWorks: [
      {
        heading: "Running YOLOv5 over a video frame by frame",
        body: `The notebook loads a pre-trained YOLOv5 model using the PyTorch Hub interface. It then opens the input video with OpenCV and iterates over each frame in a loop. For each frame, YOLOv5 runs inference and returns a set of bounding-box predictions with class labels and confidence scores. The notebook draws the boxes and labels onto the frame, assembles the annotated frames into an output video, and saves it. The entire detection loop — read frame, run model, draw boxes, write frame — is the core of the system.`,
      },
      {
        heading: "Why Google Colab was chosen",
        body: `YOLOv5 inference on video is GPU-intensive, and Colab provides a free hosted GPU runtime with CUDA already configured. The notebook format also makes it easy to walk through each step of the pipeline — model loading, video processing, result visualization — in a linear, documented way that is accessible to someone studying the approach without needing to set up a local deep-learning environment.`,
      },
    ],
    designDecisions: [
      "YOLOv5 was selected for its balance of detection speed and accuracy at the scales relevant to traffic-cone detection, and because its PyTorch Hub integration makes it straightforward to load a pre-trained checkpoint.",
      "The sample video is kept out of the repository because of its file size; the notebook documents the expected format and resolution so users can supply their own footage.",
      "OpenCV's VideoCapture and VideoWriter APIs handle the frame loop and output assembly, keeping the video I/O code separate from the detection logic.",
      "Frame-by-frame processing rather than batch processing keeps memory usage predictable and makes it easy to inspect individual frames during development.",
    ],
  },
};
