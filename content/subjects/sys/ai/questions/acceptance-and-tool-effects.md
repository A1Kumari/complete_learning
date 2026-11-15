---
id: sys-design-ai-acceptance-boundary
kind: question
topicId: system-design-ai
lessonId: lesson-sys-ai
prompt: "Why should a streamed model response not directly authorize a tool effect in a production assistant?"
difficulty: hard
status: published
revision: 1
order: 433
tags: [system-design, ai]
followUps: ["What does an agent checkpoint fail to prove about an external effect?", "How do source deletion and authorization changes reach a RAG index?"]
---

## Answer

A partial stream may be incomplete, invalid, unsupported by evidence, or influenced by untrusted retrieved text. Model output proposes an action; server-side code must validate the completed schema, domain constraints, current user authority, resource scope, and any required approval before execution.

Use bounded workflow budgets, stable operation identities, and idempotency or reconciliation for external effects. An agent checkpoint records workflow progress but cannot prove a provider did not already act before a crash. Treat retrieval permissions, source versions, and deletion propagation as part of the architecture.

### Evaluation rubric

Require separation of generation, acceptance, authorization, and effect execution. Strong answers also cover abstention on missing evidence, prompt/model versioning, end-to-end evaluation, and cost/deadline limits across retries and fallback models.
