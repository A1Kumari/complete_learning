---
id: sys-design-protocol-selection
kind: question
topicId: system-design-service-communication
lessonId: lesson-sys-service-communication
prompt: "When would you use synchronous HTTP/gRPC versus durable messaging between services?"
difficulty: medium
status: published
revision: 1
order: 423
tags: [system-design, api]
followUps: ["What authorization remains in a service behind an API gateway?", "How can connection reuse affect load distribution?"]
---

## Answer

Use a synchronous protocol when the caller needs an immediate result and can tolerate the dependency's latency and availability impact. HTTP/JSON offers broad compatibility; gRPC offers typed contracts and streaming, with tooling and client constraints. Neither is automatically superior for every workload.

Use durable messaging when work must survive disconnection, consumers need independent processing, or delayed completion is acceptable. Define acceptance versus completion, duplicates, ordering, expiry, and status retrieval. Asynchronous communication shifts waiting into a workflow; it does not remove correctness or failure requirements.

### Evaluation rubric

Require interaction semantics, deadlines, idempotency, version compatibility, and discovery behavior. A gateway can handle coarse authentication and routing but cannot replace resource-level authorization and business invariants inside services.
