# Learning — Python Backend & AI Engineering Curriculum

We'll make Python the only development language in Learning. No separate JavaScript or TypeScript curriculum.

The goal is to cover three connected areas in depth: Python itself, building production-ready backends with FastAPI, and developing AI-powered systems using Python.

We'll keep the website structure exactly as agreed: Subject → Topics → Lessons & Interview Questions.

## 1. Updated curriculum structure

```text
Learning
├── Core CS
│   ├── DSA
│   ├── OOP
│   ├── DBMS
│   ├── Operating Systems
│   ├── Computer Networks
│   └── Computer Architecture
└── Development
    ├── Python
    ├── Python Backend / FastAPI
    ├── AI Engineering
    ├── System Design
    ├── DevOps & Cloud
    └── Security
```

We shouldn't combine Python, FastAPI, and AI into one enormous subject. They build on each other but have distinct learning objectives.

## 2. Python — Language mastery

Python teaches how the language works, including the mechanisms that affect backend and AI applications.

| Topic                        | Concepts we should cover                                                                     | Priority  |
| ---------------------------- | -------------------------------------------------------------------------------------------- | --------- |
| Python Fundamentals          | Variables, types, operators, control flow, functions, collections, modules, imports          | Essential |
| Python OOP                   | Classes, instances, inheritance, polymorphism, composition, magic methods, dataclasses       | Essential |
| Functions & Scope            | LEGB, closures, first-class functions, mutable arguments, `*args`, `**kwargs`                | Essential |
| Advanced Python              | Iterators, generators, decorators, context managers, descriptors, comprehensions             | Essential |
| Python Data Model            | Object identity, references, mutability, hashing, equality, protocols, dunder methods        | Essential |
| Typing & Validation          | Type hints, generics, protocols, `TypedDict`, static typing, runtime validation distinctions | Essential |
| Errors & Resource Management | Exceptions, custom errors, context management, file handling                                 | Essential |
| Async & Concurrency          | `asyncio`, event loops, coroutines, tasks, cancellation, threads, processes, synchronization | Essential |
| Memory & Internals           | Reference counting, garbage collection, CPython, GIL, bytecode, imports, memory profiling    | Important |
| Python Tooling               | `venv`, pip, uv, dependency management, packaging, Ruff, pytest, logging                     | Important |
| Performance                  | Profiling, algorithmic bottlenecks, I/O-bound versus CPU-bound work, multiprocessing         | Important |
| Advanced Internals           | Metaclasses, descriptors in depth, interpreter implementation, extension interfaces          | Advanced  |

For modern Python, the concurrency material must also explain how traditional GIL-enabled CPython and free-threaded builds differ.





Boundary: Python's `asyncio` mechanisms belong here. How FastAPI uses asynchronous request handlers belongs in Backend Engineering.

## 3. Python Backend Engineering — FastAPI and production systems

This will be a major subject, not merely a FastAPI tutorial. FastAPI is our primary teaching framework, but the underlying backend principles should remain transferable.

| Topic                          | Concepts we should cover                                                                | Priority  |
| ------------------------------ | --------------------------------------------------------------------------------------- | --------- |
| Backend Fundamentals           | Client-server systems, HTTP, request-response lifecycle, JSON, status codes, middleware | Essential |
| FastAPI Fundamentals           | Routes, path/query/body parameters, Pydantic, validation, response models, routers      | Essential |
| FastAPI Internals              | ASGI, Starlette, Uvicorn, dependency injection, lifespan, middleware execution          | Essential |
| API Design                     | REST, resource modeling, pagination, filtering, versioning, idempotency, error handling | Essential |
| PostgreSQL & SQL               | Schema design, queries, joins, indexes, transactions, constraints, migrations           | Essential |
| Database Integration           | SQLAlchemy, sessions, transactions, pooling, sync/async database access, Alembic        | Essential |
| Authentication & Authorization | Cookies, sessions, JWT, OAuth 2.0, OIDC, RBAC, permission checks, token lifecycle       | Essential |
| Async Backend Development      | Blocking versus nonblocking I/O, concurrent requests, task cancellation, timeouts       | Essential |
| Testing                        | pytest, HTTPX, TestClient, mocking, dependency overrides, integration tests             | Essential |
| Background Processing          | FastAPI background tasks, Celery, workers, Redis/RabbitMQ, retry and failure handling   | Important |
| Caching                        | Redis, TTL, cache-aside, cache invalidation, stampedes, distributed caching             | Important |
| Real-Time APIs                 | SSE, WebSockets, streaming responses, connection lifecycle                              | Important |
| Backend Architecture           | Service layers, repositories, dependency boundaries, modular applications               | Important |
| Security                       | Input validation, CORS, CSRF, SSRF, injection, secrets, rate limiting                   | Essential |
| Performance & Scaling          | Workers, connection pools, profiling, load testing, bottlenecks, horizontal scaling     | Important |
| Production Operations          | Configuration, Docker, CI/CD, health checks, logs, metrics, tracing                     | Important |
| Advanced APIs                  | GraphQL, gRPC, webhooks, event-driven architectures                                     | Advanced  |

The FastAPI documentation supports precisely this separation: dependency injection, asynchronous execution, testing, and background jobs are distinct mechanisms that need their own explanations. Its documentation also distinguishes simple response-attached background tasks from more robust distributed job processing.





An interview question such as "Why can an async FastAPI endpoint still block other requests?" would connect Python concurrency to backend execution without repeating the entire event-loop lesson.

## 4. AI Engineering — The complete topic map

This should be our most detailed development subject alongside Python Backend.

I would split AI into four levels internally, but keep them as ordinary topics on the website—no additional navigation layer required.

AI learning progression

Foundations

ML, neural networks, transformers, LLMs

Building AI Applications

Model APIs, embeddings, RAG, agents, multimodal

Production AI Engineering

Evaluation, security, reliability, inference, cost

Advanced AI

Fine-tuning, optimization, training, research concepts

### A. AI and ML foundations

| Topic                              | Main concepts                                                                           | Priority  |
| ---------------------------------- | --------------------------------------------------------------------------------------- | --------- |
| AI & Machine Learning Introduction | AI vs ML vs DL, supervised/unsupervised learning, training vs inference                 | Essential |
| Math for AI                        | Vectors, matrices, probability, statistics, gradients, optimization intuition           | Important |
| Classical Machine Learning         | Classification, regression, clustering, decision trees, ensembles                       | Important |
| Model Evaluation                   | Accuracy, precision, recall, F1, confusion matrices, ROC-AUC, class imbalance           | Essential |
| Training Fundamentals              | Datasets, train/validation/test splits, loss, overfitting, generalization, data leakage | Essential |
| Neural Networks                    | Perceptrons, layers, activations, backpropagation, gradient descent                     | Essential |
| Deep Learning Architectures        | CNNs, RNNs, encoder-decoder models, representation learning                             | Important |
| Transformers                       | Self-attention, positional information, attention heads, transformer blocks             | Essential |
| Tokenization & Embeddings          | Tokenizers, token IDs, embedding layers, semantic representations                       | Essential |
| LLM Fundamentals                   | Pretraining, instruction tuning, context windows, inference, sampling, limitations      | Essential |

We should teach enough ML theory to understand model behavior without requiring a full mathematical machine-learning degree before reaching LLM applications.

### B. Building AI-powered applications

| Topic                       | Main concepts                                                                           | Priority  |
| --------------------------- | --------------------------------------------------------------------------------------- | --------- |
| LLM API Integration         | Model requests, messages, tokens, structured responses, tool calls, streaming           | Essential |
| Prompt Engineering          | Instructions, examples, formatting, reasoning prompts, prompt templates                 | Essential |
| Context Engineering         | Context selection, conversation history, truncation, compression, long-context behavior | Essential |
| Structured Output           | JSON Schema, validation, constrained output, retries, parsing failures                  | Essential |
| Embeddings                  | Text embeddings, similarity, cosine distance, semantic representation                   | Essential |
| Vector Databases            | Vector indexes, similarity search, approximate nearest neighbors, metadata filtering    | Essential |
| Retrieval Systems           | Keyword search, BM25, dense retrieval, hybrid search, reranking                         | Essential |
| RAG                         | Ingestion, chunking, retrieval, generation, citations, grounding, advanced RAG          | Essential |
| AI Agents                   | Tool use, planning, memory, state management, orchestration, human approval             | Essential |
| Agent Frameworks            | LangGraph, LangChain, agent SDKs, workflows versus autonomous agents                    | Important |
| MCP & Tool Protocols        | Tool discovery, schemas, transports, trust boundaries, integration patterns             | Important |
| Multimodal AI               | Vision-language models, images, audio, video, multimodal inputs and outputs             | Important |
| Document AI                 | OCR, PDF parsing, document classification, layout analysis, extraction                  | Important |
| AI Search & Recommendations | Semantic search, classification, ranking, personalization basics                        | Important |

This is where most AI backend developer interview preparation would concentrate.

For example, a lesson on RAG should explain why retrieving more chunks does not necessarily improve results, while interview questions should test how to diagnose poor retrieval or unsupported answers.

### C. Production AI engineering

This area often separates someone familiar with LLM demonstrations from someone who understands production AI applications.

| Topic                  | Main concepts                                                                                 | Priority  |
| ---------------------- | --------------------------------------------------------------------------------------------- | --------- |
| AI System Architecture | Request pipelines, orchestration, model gateways, storage, service boundaries                 | Essential |
| LLM Evaluation         | Golden datasets, task-specific metrics, human evaluation, automated graders, regression tests | Essential |
| RAG Evaluation         | Retrieval recall, relevance, answer groundedness, end-to-end correctness                      | Essential |
| Agent Evaluation       | Task success, tool-call correctness, workflow traces, failure analysis                        | Essential |
| AI Security            | Prompt injection, sensitive information exposure, tool abuse, authorization, untrusted inputs | Essential |
| Guardrails             | Input/output validation, policies, permission checks, refusal boundaries                      | Essential |
| Reliability            | Timeouts, retries, fallbacks, rate limits, idempotency, partial failures                      | Essential |
| Streaming AI Systems   | Token streaming, SSE, cancellation, backpressure, disconnected clients                        | Important |
| AI Observability       | Tracing, model telemetry, token usage, latency, request correlation                           | Essential |
| Cost Optimization      | Token budgets, caching, model selection, batching, routing                                    | Important |
| AI Deployment          | Model APIs, self-hosted models, serving infrastructure, scaling                               | Important |
| Model Performance      | TTFT, throughput, latency, quantization, batching, KV cache                                   | Important |
| Data Privacy           | PII handling, retention, access controls, provider data boundaries                            | Essential |

Evaluation deserves substantial coverage. Modern AI systems require more than testing whether an API responds successfully: their outputs and tool decisions also need to be measured against actual task requirements. Official guidance on agent evaluations specifically emphasizes traces, tool-call behavior, datasets, and regression analysis.





### D. Advanced AI and model engineering

These subjects should be included in the library, but most can initially be marked Important or Advanced.

| Topic                               | Main concepts                                                                       | Priority  |
| ----------------------------------- | ----------------------------------------------------------------------------------- | --------- |
| Fine-Tuning                         | SFT, LoRA, PEFT, datasets, evaluation, overfitting                                  | Important |
| Alignment & Preference Optimization | RLHF, DPO, reward models, preference data                                           | Advanced  |
| Model Serving                       | vLLM, serving engines, inference scheduling, GPU utilization                        | Important |
| Quantization                        | Precision, INT8/INT4, quality-performance trade-offs                                | Important |
| Model Architecture                  | Transformer variants, MoE, long-context methods, multimodal architecture            | Advanced  |
| Distributed Training                | Data parallelism, model parallelism, distributed optimization                       | Advanced  |
| Reinforcement Learning              | Rewards, policies, exploration, policy optimization                                 | Advanced  |
| AI Research Concepts                | Training objectives, scaling behavior, architecture research, benchmark limitations | Advanced  |

A key distinction: understanding when fine-tuning is appropriate matters much earlier than being able to train or fine-tune a large model yourself.

## 5. How Python, Backend, and AI connect

This is the learning path I would follow for the Development section:

```text
Python Fundamentals → Advanced Python & Async
                   ├── FastAPI & Backend Fundamentals
                   │   ├── Databases, Auth & APIs
                   │   └── Production Backend Engineering
                   └── ML & Deep Learning Basics
                       └── Transformers & LLMs
                           └── Embeddings & RAG
                               └── Agents & Tool Calling
                                   └── AI Backend Engineering
                                       └── Evaluation, Security, Scaling & Deployment
```

This isn't a strict prerequisite chain. Once you have Python fundamentals, you can learn FastAPI and AI fundamentals in parallel.

## 6. Where the remaining subjects fit

We still need System Design, DevOps, and Security. But these should support our Python backend and AI focus instead of becoming unrelated technology catalogs.

| Subject        | Coverage                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| System Design  | HLD, LLD, distributed systems, scalability, database architecture, message queues, real-time systems, AI system design |
| DevOps & Cloud | Linux, Docker, CI/CD, Kubernetes fundamentals, cloud deployment, monitoring, production troubleshooting                |
| Security       | Web application security, authentication, authorization, API security, infrastructure basics, LLM/agent security       |

We also shouldn't repeat SQL theory in multiple places. DBMS remains in Core CS; Python Backend teaches SQLAlchemy, migrations, connection management, and practical database integration.

Likewise, AI Engineering teaches agent trust boundaries, while Security can cover the underlying authorization principles.

## 7. What Learning should contain for each topic

The website can remain deliberately simple.

## AI Engineering / RAG

Lessons

What is RAG?

Chunking and indexing

Dense vs sparse retrieval

Hybrid search and reranking

Evaluating RAG systems

Interview Questions

Why use RAG instead of fine-tuning?

How do you select chunk size?

How would you improve retrieval accuracy?

How can hallucinations occur despite retrieval?

How would you evaluate a RAG pipeline?

Lessons will explain the concepts thoroughly, including internals, diagrams, worked examples, trade-offs, and misconceptions where appropriate.

Interview questions will provide concise answers, deeper explanations, assumptions, and realistic follow-ups.

Both will be usable without AI API calls or an integrated coding environment.

## My recommended scope

For now, the Development side of Learning should have exactly these six top-level subjects:


- **Python** — Master the language, internals, and concurrency



- **Python Backend & FastAPI** — Build and understand backend services



- **AI Engineering** — Understand models, RAG, agents, and production AI



- **System Design** — Design reliable and scalable systems



- **DevOps & Cloud** — Understand deployment and operations



- **Security** — Secure software and AI systems


Next, I recommend expanding AI Engineering into a complete lesson-level inventory, rather than writing the lessons themselves yet. We can go through every AI topic and determine exactly which lessons and interview questions belong under it, how deeply each should be covered, and where the dependencies on Python and FastAPI begin. That will give us an actionable content blueprint without making the Learning interface more complicated.
