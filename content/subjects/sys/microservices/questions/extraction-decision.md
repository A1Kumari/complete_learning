---
id: sys-design-extraction-decision
kind: question
topicId: system-design-microservices
lessonId: lesson-sys-microservices
prompt: "A small team has a monolith with one expensive PDF feature. Should it split the whole product into microservices?"
difficulty: medium
status: published
revision: 1
order: 425
tags: [system-design, microservices]
followUps: ["What makes a distributed monolith?", "How do you migrate data ownership without uncoordinated dual writes?"]
---

## Answer

Not based on that symptom alone. Measure the bottleneck, then consider dedicated asynchronous workers or extracting only PDF generation behind a durable job contract. This can isolate CPU and scale independently while preserving simpler local transactions elsewhere.

Broader service extraction needs evidence such as distinct ownership, deployment cadence, scaling, or availability requirements. It adds network failure, compatibility, tracing, on-call, and distributed-data costs. A modular monolith may remain the better architecture for the team's scale and capabilities.

### Evaluation rubric

Require the smallest justified change and a business capability boundary. Separate repositories do not prove independent deployability, and shared writable tables preserve coupling even when applications run in different processes.
