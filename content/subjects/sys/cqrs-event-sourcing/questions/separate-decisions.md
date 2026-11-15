---
id: sys-design-cqrs-separate-decisions
kind: question
topicId: system-design-cqrs-event-sourcing
lessonId: lesson-sys-cqrs-event-sourcing
prompt: "Can a system use CQRS without event sourcing, and how should it expose read-model lag?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 426
tags: [system-design, cqrs, event-sourcing]
followUps: ["What does an event-sourced snapshot represent?", "Why should replay handlers be separated from external effects?"]
---

## Answer

Yes. CQRS separates command and query models or interfaces; it can use ordinary current-state persistence and even one database. Event sourcing separately makes an event history authoritative. Combining them is optional.

When a read model is updated asynchronously, return an operation ID or command version and define how the client observes progress. The UI can show pending state, wait for projection catch-up within a deadline, or temporarily use an authoritative read. Do not promise immediate read-after-write behavior from an eventually updated projection.

### Evaluation rubric

Require the distinction, expected-version concurrency for event streams, and versioned replay/snapshot handling. An append-only log is not automatically a perfect audit trail, and replay must not blindly repeat historical external effects.
