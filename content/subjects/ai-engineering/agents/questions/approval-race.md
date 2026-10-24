---
id: ai-agent-approval-race
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-approval
prompt: A valid approval exists, but the resource version or user's permission changes before execution. What should happen, and why is a separate read-then-write check insufficient?
difficulty: hard
status: published
revision: 1
order: 1150
tags: [agents, approval, concurrency]
conceptIds: [concept-agent-approval]
followUps:
  - How should concurrent attempts to consume one approval be handled?
  - What if the write commits but acknowledgment is lost?
misconception: Prior approval does not override current authorization or make a later write atomic.
---

## Answer

Reject revoked permissions and treat a mismatched resource version as stale. Recheck
at execution and enforce version/approval consumption through an atomic conditional
operation or equivalent serialization. Separate application reads leave a race
before the effect is committed.

### Supporting reasoning

Coordinate operation intent, approval use, and effect receipts. An unknown write
outcome needs reconciliation under the same operation ID, not an automatic new
write based on the original approval.

### Evaluation rubric

One point each: current permission check; version mismatch behavior; atomicity/race
explanation; concurrent consumption or unknown-outcome handling.
