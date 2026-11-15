---
id: sys-design-health-and-capacity
kind: question
topicId: system-design-load-balancing
lessonId: lesson-sys-load-balancing
prompt: "Why can removing unhealthy instances make an outage worse, and how should health checks be designed?"
difficulty: hard
status: published
revision: 1
order: 403
tags: [system-design, load-balancing]
followUps: ["How do readiness and liveness differ?", "How much spare capacity is needed to lose one of three equal zones?"]
---

## Answer

Removing instances shifts their traffic to survivors. If the survivors lack headroom, they also overload and fail checks, creating a cascade. A shared dependency failure can make every instance fail the same deep health check even though restarting or removing them does not repair that dependency.

Use liveness for process failure and readiness for receiving new work, with appropriate thresholds and hysteresis. Combine active checks with real-request observations, support degraded responses or targeted shedding, and calculate failure capacity. Losing one of three equal zones requires the remaining zones each to handle 50% more traffic.

### Evaluation rubric

Look for correlated failure, warm-up and draining, bounded retries, and capacity math. “Restart every unhealthy process” is insufficient and can amplify dependency outages.
