---
id: ai-mcp-transport-failure
kind: question
topicId: ai-mcp-tools
lessonId: lesson-ai-mcp-architecture
prompt: How should an AI application handle an MCP server timeout or reconnect?
difficulty: hard
status: published
revision: 1
order: 310
tags: [mcp, reliability, timeouts]
followUps:
  - What state must be revalidated after reconnecting?
  - Why should retries be different for reads and writes?
misconception: Retrying a timed-out write is always safe.
---

## Answer

Apply a deadline and cancellation, classify the failure, and return a structured
error rather than claiming success. After reconnecting, renegotiate capabilities and
revalidate policy. Retry reads only when bounded and safe; writes need a durable
operation ID and idempotency or reconciliation before retrying.

### Evaluation rubric

One point each: deadline/cancellation; capability renegotiation; structured failure;
write idempotency and reconciliation.
