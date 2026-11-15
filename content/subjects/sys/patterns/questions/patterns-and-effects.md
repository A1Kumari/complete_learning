---
id: sys-design-patterns-and-effects
kind: question
topicId: system-design-patterns
lessonId: lesson-sys-patterns
prompt: "Why can a generic retry decorator be dangerous around a payment adapter?"
difficulty: medium
status: published
revision: 1
order: 429
tags: [system-design, design-patterns]
followUps: ["When is a function enough to implement Strategy?", "Why is a local Observer not a durable event bus?"]
---

## Answer

A timeout can occur after the provider already charged the customer. A decorator that retries with a new operation identity can charge again. A safe retry contract must preserve a stable provider idempotency key, respect its scope and retention, classify unknown outcomes, and reconcile when necessary.

The adapter should expose meaningful domain outcomes rather than flattening every provider exception into a simple failure. Infrastructure abstraction is useful only if it preserves the semantics callers need for correctness.

### Evaluation rubric

Require the side-effect ambiguity and a concrete safe boundary. Strong answers choose patterns for actual variation—such as provider adapters or pricing strategies—rather than treating more layers or inheritance as inherently better design.
