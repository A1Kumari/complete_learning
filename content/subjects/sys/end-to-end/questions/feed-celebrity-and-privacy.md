---
id: sys-design-feed-celebrity-privacy
kind: question
topicId: system-design-end-to-end
lessonId: lesson-sys-news-feed
prompt: "How does a hybrid news feed handle a celebrity post while still enforcing a viewer's new block immediately?"
difficulty: hard
status: published
revision: 1
order: 438
tags: [system-design, case-study, news-feed]
followUps: ["Why is a score-only cursor unstable for a dynamically ranked feed?", "How can fan-out jobs be resumed without duplicate feed entries?"]
---

## Answer

Use write-time fan-out for ordinary authors and retrieve recent high-fan-out authors' posts at read time, merging bounded candidate sets. This avoids millions of synchronous feed-entry writes for one celebrity post. Choose thresholds from workload and costs.

Apply current block/visibility eligibility during retrieval and hydration so stale feed entries cannot authorize display. Propagate changes to caches and projections, but do not rely solely on delayed cleanup for privacy-sensitive decisions. Make fan-out insertion idempotent and retain progress for retries.

### Evaluation rubric

Require write-amplification reasoning, bounded candidate retrieval, deduplication, and current authorization. Strong answers define freshness during queue lag and use a stable chronological cursor or explicit feed snapshot policy rather than pretending an opaque ranked cursor guarantees stability.
