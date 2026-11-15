---
id: sys-design-stateless-instances
kind: question
topicId: system-design-client-server
lessonId: lesson-sys-client-server
prompt: "What makes an application instance stateless, and how can scaling it still overload a database?"
difficulty: medium
status: published
revision: 1
order: 402
tags: [system-design, architecture]
followUps: ["Where should shopping-cart state live?", "What does a client timeout tell you about a committed write?"]
---

## Answer

A stateless instance does not require subsequent requests to return to that instance to recover essential session or business state. It can use temporary memory and caches, while authoritative state remains recoverable in explicitly managed storage.

Every added instance can create more concurrent database queries and pool connections. Forty instances with pools of thirty can attempt 1,200 connections. If the database is already saturated, more application replicas can increase queueing rather than throughput.

Budget fleet-wide database concurrency, bound pool waits, optimize queries, and use eligible caches or read replicas according to freshness requirements. A restarted instance should not lose the only copy of a cart.

### Evaluation rubric

Distinguish stateless serving from absence of state anywhere. Explain shared dependency limits and why a load balancer cannot fix an overloaded database.
