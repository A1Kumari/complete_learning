---
id: os-scheduling-quantum
kind: question
topicId: os-scheduling
lessonId: lesson-os-cpu-scheduling
prompt: "How does reducing the round-robin time quantum affect responsiveness and overhead?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 10
tags: [scheduling]
followUps:
  - "What happens as the quantum becomes very large?"
---

## Answer

A shorter quantum can reduce the wait for runnable tasks to get a turn, improving responsiveness, but more frequent scheduling and context switches consume CPU and can disrupt cache locality. A very large quantum makes round robin resemble first-come, first-served scheduling for CPU-bound jobs. The best choice depends on workload and measured overhead.
