---
id: ai-agent-unknown-effect-retry
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-recovery
prompt: A refund commits but its acknowledgment times out. Why does restoring a checkpoint and retrying with a new operation ID risk a duplicate effect?
difficulty: hard
frequent: true
status: published
revision: 1
order: 1170
tags: [agents, recovery, idempotency]
conceptIds: [concept-agent-recovery]
followUps:
  - What must the effect service enforce when an operation ID is reused with changed arguments?
  - What can you do if the service provides no idempotency support?
misconception: Checkpoint replay does not roll back the external world or establish exactly-once writes.
---

## Answer

The original effect already happened; a new ID may be treated as a new refund.
Restore the original operation intent and reconcile or retry with the same stable
ID under the effect service's documented idempotency contract. Reject changed-payload
reuse of that identity.

### Supporting reasoning

The service must make deduplication and effect commit atomic and retain the key
long enough. Without that support, use status lookup, a transactional deduplication
design, or explicit reconciliation instead of blindly replaying the write.

### Evaluation rubric

One point each: committed-but-unknown distinction; new-ID duplicate risk;
stable-ID reconciliation; atomic service contract or unsupported-service strategy.
