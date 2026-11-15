---
id: sys-design-workload-budget
kind: question
topicId: system-design-capacity-estimation
lessonId: lesson-sys-capacity-estimation
prompt: "Estimate peak read QPS and backend load for 10 million daily users making 20 reads each, with a 5x peak and 95% cache hits."
difficulty: medium
status: published
revision: 1
order: 401
tags: [system-design, capacity]
followUps: ["What happens when cache hits fall to 80%?", "Why is p99 latency not the average time in Little's law?"]
---

## Answer

The service receives 200 million reads/day. Dividing by 86,400 gives about 2,315 average reads/s; multiplying by five gives roughly 11,575 peak reads/s. At a 95% hit ratio, peak database reads are approximately 579/s, assuming each miss causes one database lookup.

At 80% hits, backend reads rise to about 2,315/s—four times the previous backend rate at the same frontend traffic. A complete cache loss can demand the full 11,575/s, so bounded fallback and cold-cache behavior matter.

### Evaluation rubric

Require explicit units, average versus peak distinction, and assumptions about fan-out and cacheability. Strong answers also account for query cost, payload bandwidth, skew, and failure headroom rather than turning the result directly into a guessed server count.
