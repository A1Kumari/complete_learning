---
id: sys-design-cdn-cache-key-privacy
kind: question
topicId: system-design-cdn
lessonId: lesson-sys-cdn
prompt: "How would you cache public static assets and private account pages behind the same CDN?"
difficulty: medium
status: published
revision: 1
order: 408
tags: [system-design, cdn]
followUps: ["Why retain old fingerprinted assets after a deployment?", "What does a purge propagation delay mean for deletion guarantees?"]
---

## Answer

Give immutable fingerprinted assets long public freshness lifetimes and publish a new URL when content changes. Retain older assets while cached HTML or active clients may still reference them.

Do not put personalized account responses in a shared public cache without a deliberately correct eligibility and cache-key policy. Use private browser caching or no shared caching as appropriate, understand authorization/cookie behavior, and ensure representations cannot cross users or tenants. A path-only cache key is unsafe when the same path produces different users' data.

### Evaluation rubric

Require separation of browser and shared-cache policy, representation-sensitive keys, and origin protection. Strong answers cover negative caching, revalidation, and why server-side purge cannot undo every independently cached client response.
