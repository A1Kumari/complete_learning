---
id: sys-design-paused-leader
kind: question
topicId: system-design-coordination
lessonId: lesson-sys-coordination
prompt: "A lock lease expires while worker A is paused. Worker B acquires it, then A resumes. How can storage reject A's stale write?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 422
tags: [system-design, coordination, fencing]
followUps: ["Why is a random lock token not a fencing sequence?", "What can a minority Raft partition safely commit?"]
---

## Answer

Issue a monotonically increasing fencing token for each new ownership epoch and enforce it atomically at the protected storage/resource. If B has token 42 and storage has accepted that epoch, A's later request with token 41 is rejected.

Checking the lease only before starting work leaves a pause window before the actual write. A random token can identify the current holder for safe unlock, but does not establish an ordering between old and new holders. The allocator and resource enforcement must preserve their state and guarantees across failure.

### Evaluation rubric

Require enforcement at the side-effect boundary and an explicit pause trace. Election, failure suspicion, lease expiry, fencing, and operation idempotency serve different roles; naming a lock service alone is insufficient.
