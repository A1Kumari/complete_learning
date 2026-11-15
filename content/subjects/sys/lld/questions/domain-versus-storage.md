---
id: sys-design-domain-versus-storage
kind: question
topicId: system-design-lld
lessonId: lesson-sys-lld
prompt: "Why is a correct SeatHold.confirm method insufficient to prevent double booking across application instances?"
difficulty: medium
status: published
revision: 1
order: 428
tags: [system-design, lld]
followUps: ["Why inject a clock into expiration logic?", "Where should the external payment retry policy live?"]
---

## Answer

Two instances can load separate copies of the same held state, each pass the domain checks, and both attempt confirmation. The domain method expresses legal transitions but does not serialize persistent writes across processes.

Use a conditional version update, a suitable row lock/transaction, or another atomic storage protocol, plus uniqueness constraints where appropriate. Re-evaluate the business operation after a conflict. Inject a clock so expiration behavior is deterministic and its boundary cases are testable.

### Evaluation rubric

Require both a state machine and a durable concurrency boundary. Strong answers separate pure domain behavior, application orchestration, and infrastructure adapters, and explain why an in-process mutex or a larger class hierarchy does not solve distributed contention.
