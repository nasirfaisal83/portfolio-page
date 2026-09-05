# README Trace

Every node, edge, label, topic, frame, and value in each screen traced to its source in the project README.

## Order-Saga

| Element | Value | README Source |
|---|---|---|
| Services | Gateway, Order, Inventory, Payment, Shipping, Notification | README architecture diagram |
| Bus | kafka | README: "services coordinate purely through Kafka events" |
| Registry | eureka | README: "Spring Cloud Eureka" |
| Topic | order.created | README topic list |
| Topic | inventory.reserved | README topic list |
| Topic | inventory.failed | README topic list |
| Topic | payment.succeeded | README topic list |
| Topic | payment.failed | README topic list |
| Topic | shipment.created | README topic list |
| Status | PENDING | README: order status lifecycle |
| Status | INVENTORY_RESERVED | README: order status lifecycle |
| Status | PAYMENT_PROCESSING | README: order status lifecycle |
| Status | COMPLETED | README: order status lifecycle |
| Status | FAILED | README: order status lifecycle |
| Status | COMPENSATING | README: order status lifecycle |
| Compensation | inventory release on payment failure | README: "releasing reserved stock on payment failure" |

## rag-document-qa

| Element | Value | README Source |
|---|---|---|
| Ingestion stages | upload → extract → chunk → embed → store | README architecture |
| Extraction strategies | PDFBox, Tesseract, GPT-4o Vision | README: "3-strategy PDF extraction pipeline" |
| Chunk size | 500 tokens | README: "500-token chunks with 50-token overlap" |
| Chunk overlap | 50 tokens | README: "50-token overlap" |
| Embedding model | text-embedding-3-small (1536 dimensions) | README stack |
| Vector store | PostgreSQL + pgvector (ivfflat) | README: "IVFFlat index (100 lists)" |
| Top-k | 5 | README: "top-k 5 by default" |
| Example question | What are the payment terms? | README example |
| Confidence | 0.87 (labeled as example from the README) | README |
| Source chips | Chunk 12, page 4 / Chunk 7, page 2 | README example |
| Async status | PROCESSING → READY / FAILED | README: "polls status" |

## tech-news-agent

| Element | Value | README Source |
|---|---|---|
| Orchestrator | OrchestratorAgent | README: "OrchestratorAgent runs a ReAct loop" |
| Agents | ScoutAgent, ReporterAgent, EditorAgent, FactCheckerAgent, LinkedInWriterAgent | README agent list |
| Tools | Tavily Search API, GitHub MCP Server | README: "Tavily web search… GitHub MCP server" |
| Threshold | 0.6 | README: "confidence falls below 0.6" |
| Example confidence | 0.83 | README example output |
| Fact count | 6 | README example output |
| Processing time | ~63 s | README: "a run takes 30–90 seconds" |
| Output markers | [HIGH], [MEDIUM], [UNVERIFIED] | README: output format |
| Retry logic | decided by the model, not hardcoded Java | README: "nothing in Java hardcodes the loop" |
| Example topic | NVIDIA Blackwell GPU | README example |
| First-pass confidence | 0.52 (illustrative — labeled on screen) | labeled as illustrative |

## Emergency-Alert-System

| Element | Value | README Source |
|---|---|---|
| Server | StompServer | README |
| Modes | tpc (thread-per-client), reactor (NIO selector) | README: "Two selectable server threading models" |
| Client | client A, client B, client C (C++) | README |
| Channel | germany | README example |
| Frame | CONNECT | README supported frames |
| Frame | CONNECTED | README supported frames |
| Frame | SUBSCRIBE | README supported frames |
| Frame | SEND | README supported frames |
| Frame | MESSAGE | README supported frames |
| Frame | RECEIPT | README supported frames |
| Event | Fire in Berlin | README example event |
| Broadcast rule | subscribers receive MESSAGE; sender receives RECEIPT | README |

## con-Detection

| Element | Value | README Source |
|---|---|---|
| Model | YOLOv5 | README |
| Processing | frame-by-frame | README: "over a video file frame by frame" |
| Pipeline | video → frame → YOLOv5 → boxes | README architecture |
| Label | cone | README: bounding box labels |
| Environment | Google Colab | README: "Built for Google Colab" |
| No numeric confidences | — | R4.27: none documented in README |
| Caption | "Illustration of the detection loop; the notebook runs the real model" | Required by design §7.5 |
