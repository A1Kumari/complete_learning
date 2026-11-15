---
id: sys-design-quorum-is-not-proof
kind: question
topicId: system-design-consistency
lessonId: lesson-sys-consistency
prompt: "Does N=3, W=2, R=2 by itself prove that a replicated store is linearizable?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 412
tags: [system-design, consistency]
followUps: ["How do linearizability and serializability differ?", "Which session guarantee prevents reads moving backward?"]
---

## Answer

No. With fixed membership and operations using the same replica set, `R+W>N` guarantees read and write quorum intersection. Linearizability also depends on concurrent-write ordering, incomplete writes, read selection/repair, membership changes, and the actual storage protocol. Sloppy quorums can change which nodes participate and invalidate the simple intersection argument.

Linearizability describes operation histories respecting real time. Serializability describes transactions equivalent to some serial order; strict serializability additionally respects real-time ordering.

### Evaluation rubric

A strong answer states the useful arithmetic and its assumptions without overstating it. It also identifies the required consistency guarantee for a concrete operation, such as a username claim or inventory reservation, rather than using “strong consistency” vaguely.
