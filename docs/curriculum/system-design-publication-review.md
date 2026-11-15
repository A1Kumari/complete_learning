# System Design publication

## Coverage

The `sys` subject now has **39 authored lessons and 39 new interview questions**
across all **35 existing curriculum topics**. Each topic has a lesson and a
primary-lesson-linked question; End-to-End System Design has five of each.
Sources live under `content/subjects/sys/` and use the existing Markdown compiler,
lesson reader, related-question links, and practice bank.

| Topic | Lesson focus |
| --- | --- |
| Introduction | Requirements, invariants, HLD/LLD, design walkthrough |
| Capacity estimation | QPS, bytes, bandwidth, concurrency, cache loss, headroom |
| Client-server | Request lifecycle, state ownership, connection pools, cursors |
| Load balancing | L4/L7, algorithms, health, draining, zone failure |
| Scaling | Bottleneck diagnosis, Amdahl's law, autoscaling, backlog recovery |
| Consistent hashing | Ring trace, virtual nodes, placement, migration |
| Caching fundamentals | Strategy choices, TTL versus eviction, freshness |
| Distributed caching | Stampedes, stale fills, watermarks, bounded fallback |
| CDN | Cache eligibility, immutable URLs, purge, origin protection |
| Database selection | Access patterns, invariants, primary/derived stores |
| Replication | Acknowledgement milestones, lag, read-your-writes, fencing |
| Sharding | Key selection, skew, cross-shard work, ownership cutover |
| Consistency | Linearizability, serializability, session guarantees, quorums |
| CAP | Formal assumptions, concrete partition trace, per-operation behavior |
| Transactions | 2PC, sagas, unknown outcomes, compensation, outbox |
| Concurrency | Atomic updates, versions, locks, write skew, constraints |
| Queues | Confirmations, acknowledgements, duplicates, retries, backlog |
| Event-driven architecture | Contracts, outbox/inbox, schema evolution, replay |
| Stream processing | Partitions, groups, offsets, event time, watermarks |
| Rate limiting | Algorithms, token model, atomicity, global budgets |
| Reliability | Deadlines, retry amplification, breakers, bulkheads |
| HA/DR | SLIs, budgets, failure domains, RPO/RTO, restore drills |
| Coordination | Consensus, heartbeats, leases, paused workers, fencing |
| Communication | HTTP/gRPC/messaging, discovery, contracts, gateways |
| Real time | Transport choices, connection ownership, replay, backpressure |
| Microservices | Business boundaries, data ownership, incremental extraction |
| CQRS/event sourcing | Separate decisions, projections, snapshots, concurrency |
| Observability | User outcomes, metrics/logs/traces, histograms, alerting |
| LLD | Entities, values, interfaces, state machines, persistence boundary |
| Design patterns | Strategy, factory, adapter, decorator, observer, state |
| OOD problems | Parking lot, elevator, library, allocation races |
| Distributed IDs | Sequences, UUIDs, Snowflake layout, clocks, ordering |
| Search | Inverted indexes, ingestion, filters, ranking, rebuilds |
| AI architecture | RAG, gateways, evidence, validation, bounded tools |
| End-to-end | URL shortener, chat, payments, notifications, news feed |

The five case studies include scoped requirements, concrete APIs or schemas,
component/data-flow diagrams in renderer-supported text fences, scaling decisions,
failure traces, and recall exercises. Numerical estimates are labeled assumptions,
not product performance claims. Python fences are standalone teaching examples;
SQL, HTTP, JSON, diagrams, and pseudocode illustrate contracts rather than a
deployed backend.

## Editorial decisions

- Existing topic IDs, order, scope, and intentionally unspecified priorities remain
  the curriculum reference. Publication status becomes `in-progress`.
- New lesson IDs use `lesson-sys-*`; new question IDs use `sys-design-*`.
- Historical `sys-q001` through `sys-q024` remain in their original source. This is
  additive educational material, not a migration or rewrite of old identities.
- Every new question includes a canonical answer, follow-ups, and an evaluation
  rubric. Answers remain behind the existing practice reveal behavior.
- Prerequisites reference published lessons and form a directed acyclic graph.
- Mermaid/LaTeX execution and new frontend dependencies are unnecessary.

## Important technical qualifications

The lessons distinguish CAP availability from uptime SLIs, quorum intersection
from a complete linearizability proof, and serializability from real-time order.
They distinguish message redelivery from external-effect guarantees, replication
from backup recovery, and approximate time-ordered IDs from causal/commit order.
Cache invalidation races, unknown payment outcomes, stale leaders, snapshot write
skew, and derived-store authorization lag have concrete failure walkthroughs.

Sources include:

- [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)
- [Google SRE: Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)
- [Google SRE: Service-Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [PostgreSQL: Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL: Warm Standby and Replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)
- [Raft: Overview and Paper](https://raft.github.io/)
- [HTTP Caching: RFC 9111](https://www.rfc-editor.org/rfc/rfc9111)
- [UUID Formats: RFC 9562](https://www.rfc-editor.org/rfc/rfc9562)
- [OpenTelemetry Signals](https://opentelemetry.io/docs/signals/)
- [Brewer: CAP Twelve Years Later](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/)

## Verification

```bash
python3 scripts/check-system-design-examples.py
npm run content:check
npm test
npm run lint
npm run build
```

The Python command extracts and independently executes the actual Python fences
from the lessons, including their assertions. It requires only the standard
library. Content compilation validates metadata, unique identities, topic/lesson
classification, prerequisite references, local links, and publishability.

Browser review covers the System Design overview, every topic's published count,
lesson loading, related interview questions, return navigation, rendered tables
and code, and the five case-study entry points.

Verification completed: content validation, all 50 Node tests, ESLint, production
build, and all three extracted Python examples passed. Chromium checks against the
production preview verified all 35 topic listings, all 39 lesson routes and their
question links, practice answer/rubric reveal, topic and lesson return navigation,
and a 390px mobile layout without document-width overflow.

The expanded subject exposed an old migration-test fixture that selected all new
questions in any historical subject. The fixture now selects the frozen historical
IDs explicitly, so its 190-record migration assertion still tests the original
dataset rather than accidentally treating new educational questions as old data.
