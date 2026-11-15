---
id: sys-design-requirements-first
kind: question
topicId: system-design-foundations
lessonId: lesson-sys-foundations
prompt: "How would you turn an ambiguous appointment-booking prompt into a system design?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 400
tags: [system-design, requirements]
followUps: ["Which invariant needs an atomic transaction?", "How does the design change if bookings can be provisional?"]
---

## Answer

Clarify the actors, booking flow, cancellations, payments, scale, and exclusions. State correctness invariants—especially no double booking—and measurable latency, availability, and recovery requirements before selecting components.

Define reservation APIs, a seat/appointment data model, and the transaction that claims availability. Start with an application and authoritative database; add asynchronous payment coordination and notifications with explicit pending states. Estimate peak reads and booking contention, then deep-dive into hold expiration, concurrency, and uncertain payment results.

### Evaluation rubric

A strong answer links every component to a requirement, names the acknowledgement point, and traces a retry after the booking commits but the response is lost. A technology list without invariants or failure behavior is incomplete.
