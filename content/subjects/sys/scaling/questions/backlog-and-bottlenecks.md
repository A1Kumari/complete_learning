---
id: sys-design-backlog-and-bottlenecks
kind: question
topicId: system-design-scaling
lessonId: lesson-sys-scaling
prompt: "Jobs arrive at 400/s and each worker processes 10/s. How many workers drain a 12,000-job backlog in one minute?"
difficulty: medium
status: published
revision: 1
order: 404
tags: [system-design, scaling]
followUps: ["Why are forty workers insufficient?", "Which dependency might prevent workers from reaching the assumed throughput?"]
---

## Answer

Draining 12,000 jobs in 60 seconds requires 200 jobs/s of completion capacity beyond incoming traffic. Total required throughput is 400+200=600 jobs/s, so sixty workers are required at the assumed ten jobs/s per worker.

Forty workers only match new arrivals and leave the existing backlog unchanged. This calculation assumes stable arrivals, immediate startup, independent workers, and no shared resource bottleneck. A database, provider rate limit, or storage bandwidth cap can prevent linear scaling.

### Evaluation rubric

Require a net-drain-rate calculation, explicit assumptions, and oldest-job-age monitoring. Strong answers add startup/failure headroom and check resource limits rather than asserting that worker count alone guarantees recovery time.
