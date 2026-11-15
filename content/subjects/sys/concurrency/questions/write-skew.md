---
id: sys-design-write-skew
kind: question
topicId: system-design-concurrency
lessonId: lesson-sys-concurrency
prompt: "Why can per-row optimistic versions fail to enforce that at least one doctor remains on call?"
difficulty: hard
status: published
revision: 1
order: 415
tags: [system-design, concurrency, isolation]
followUps: ["When is an atomic conditional stock update sufficient?", "Why must a serialization failure retry the whole transaction?"]
---

## Answer

Two transactions can each read a snapshot where both doctors are on call, then independently mark a different doctor off call. Because they write different rows, both per-row version checks can succeed even though the combined result violates the cross-row invariant. This is write skew.

Use a suitable serializable transaction with whole-transaction retry, or a correctly scoped locking/constraint design that serializes the relevant decision. The exact behavior depends on the database's isolation implementation. A local process mutex does not protect concurrent requests in another process.

### Evaluation rubric

Require a concrete interleaving and distinction between row conflict detection and predicate-level business invariants. Idempotency protects repeated logical requests but does not alone prevent conflicts between independent requests.
