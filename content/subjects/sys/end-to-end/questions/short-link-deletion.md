---
id: sys-design-short-link-deletion
kind: question
topicId: system-design-end-to-end
lessonId: lesson-sys-url-shortener
prompt: "How do alias uniqueness, cache invalidation, and redirect status affect a mutable URL shortener?"
difficulty: hard
status: published
revision: 1
order: 434
tags: [system-design, case-study]
followUps: ["Why does a large random alias namespace not eliminate collision handling?", "Can origin invalidation recall a cached permanent redirect?"]
---

## Answer

Enforce alias uniqueness with an atomic database constraint. Random aliases can collide and custom aliases can race, so handle insertion conflicts rather than trusting a prior existence check.

For mutable or deletable mappings, define a freshness deadline across server caches, CDN behavior, and client caching. Invalidation needs race-aware population or an explicitly accepted TTL bound. A permanent redirect can remain cached by a browser beyond the server's control, so choose status and cache directives consistent with mutation and deletion requirements.

### Evaluation rubric

Require end-to-end cache reasoning, viral-key protection, and asynchronous analytics outside the critical redirect path. Strong answers distinguish a server-controlled cache guarantee from behavior already cached by independent clients.
