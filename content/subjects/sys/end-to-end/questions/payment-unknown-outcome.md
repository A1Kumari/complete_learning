---
id: sys-design-payment-unknown-outcome
kind: question
topicId: system-design-end-to-end
lessonId: lesson-sys-payments
prompt: "A capture request times out, then duplicate and out-of-order provider webhooks arrive. How do you avoid charging or posting to the ledger twice?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 436
tags: [system-design, case-study, payments]
followUps: ["What if provider idempotency retention has expired?", "How do settlement reports complement webhooks?"]
---

## Answer

Keep the payment attempt pending/unknown with its stable provider operation identity. Query or retry according to the provider's idempotency contract rather than creating a new capture identity. Authenticate webhooks and deduplicate provider event IDs in the same transaction that applies legal state transitions and relevant accounting entries.

An old authorization event cannot regress a captured attempt. Conflicting or insufficient evidence triggers a provider status query or reconciliation. Enforce unique business-operation references for ledger postings and use explicit correction entries rather than silently mutating financial history.

### Evaluation rubric

Require unknown-outcome handling, durable identities, atomic inbox/effect processing, state monotonicity where appropriate, and reconciliation. Queue deduplication alone does not make external card capture exactly once.
