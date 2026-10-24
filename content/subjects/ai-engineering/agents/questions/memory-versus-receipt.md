---
id: ai-agent-memory-versus-receipt
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-recovery
prompt: Conversation memory says a refund completed, but execution state has no confirmed receipt. Which record should determine the operation's status?
difficulty: medium
status: published
revision: 1
order: 1160
tags: [agents, state, memory]
conceptIds: [concept-agent-recovery]
followUps:
  - Which fields should survive context compaction?
  - How do checkpoints differ from long-term user preferences?
misconception: A generated summary is not an authoritative ledger of external effects.
---

## Answer

Use the effect service's receipt/status and the controller's operation ledger.
Without confirmation, retain an unknown or pending status and reconcile using the
stable operation ID. Do not infer completed execution from model-written memory.

### Supporting reasoning

Conversational summaries are lossy and can contain errors. Retain authoritative
operation IDs, pending action fingerprints, versions, and receipts outside the
model context so compaction does not erase recovery information.

### Evaluation rubric

One point each: authoritative receipt/ledger; explicit unknown status;
reconciliation identity; memory/compaction distinction.
