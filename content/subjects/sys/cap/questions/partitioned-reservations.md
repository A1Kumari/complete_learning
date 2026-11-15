---
id: sys-design-partitioned-reservations
kind: question
topicId: system-design-cap
lessonId: lesson-sys-cap
prompt: "Two disconnected regions each see one remaining seat. Can both promise a final reservation while preserving one authoritative inventory state?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 413
tags: [system-design, cap]
followUps: ["Could product descriptions remain available during this partition?", "How does CAP availability differ from an uptime SLO?"]
---

## Answer

Not without an ownership/allocation arrangement established before the partition or communication sufficient to coordinate the decision. If both independently finalize the same last seat, the invariant is violated. A consistency-preserving protocol can allow only the side with valid quorum or ownership to proceed and reject or defer the other request.

The product can accept provisional requests if it explicitly allows later rejection, but that is a different promise. Other operations, such as reading stale descriptions, can remain available under weaker guarantees.

### Evaluation rubric

Require operation-level reasoning and the formal partition conflict, rather than “pick any two.” Strong answers note that preallocated inventory rights change which independent decisions are safe and that a minority-side write rejection is not necessarily a total product outage.
