---
id: sys-design-retry-amplification
kind: question
topicId: system-design-reliability
lessonId: lesson-sys-reliability
prompt: "Three nested service layers each make up to three attempts. What can happen to the deepest dependency during an outage?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 420
tags: [system-design, reliability]
followUps: ["How does a circuit breaker differ from a concurrency limit?", "When is a fallback unsafe?"]
---

## Answer

One user request can cause up to `3*3*3=27` deepest-layer attempts if each layer independently retries its failed call. During overload, this amplifies load exactly when capacity is scarce.

Assign retry ownership, propagate an end-to-end deadline, classify retryable errors, and use bounded attempts, jittered backoff, and a shared retry budget. Preserve the same operation identity for uncertain writes. Bound queues and concurrent calls so callers cannot exhaust all resources while waiting.

### Evaluation rubric

Require amplification math and recovery semantics, not just “add exponential backoff.” Breakers suppress calls to failing dependencies, while bulkheads and concurrency limits bound resource consumption. A fallback must preserve the product's correctness contract rather than fabricate success.
