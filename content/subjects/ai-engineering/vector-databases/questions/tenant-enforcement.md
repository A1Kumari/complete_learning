---
id: ai-vector-tenant-enforcement
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-filtered-vector-search
prompt: Where should a per-tenant retrieval constraint come from, and what should happen if permissions change while results are being retrieved?
difficulty: hard
status: published
revision: 1
order: 910
tags: [vector-databases, multitenancy, metadata]
conceptIds: [concept-filtered-vector-search]
followUps:
  - What trade-offs arise with one collection per tenant?
  - Which downstream services must receive only eligible content?
misconception: A client-supplied tenant value or a high similarity score is not proof of authorization.
---

## Answer

Derive mandatory tenant/access predicates from authenticated server-side identity
and apply them consistently to retrieval branches. Revalidate current permissions
before returning source content; define revocation behavior for replicas and caches.

### Supporting reasoning

Keep ineligible content away from rerankers, model prompts, and user-visible
diagnostics. Shared filtered collections and per-tenant collections have different
routing, isolation, and small-index overhead trade-offs. Missing identity must not
silently broaden the query.

### Evaluation rubric

One point each: trusted identity; mandatory retrieval constraints; current-access
check; concrete cache/downstream or isolation consideration.
