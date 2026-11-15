---
id: sys-design-copy-and-allocation
kind: question
topicId: system-design-oop-problems
lessonId: lesson-sys-oop-problems
prompt: "How do a library book title and book copy differ, and how would you prevent two members borrowing the same copy?"
difficulty: medium
status: published
revision: 1
order: 430
tags: [system-design, oop]
followUps: ["Which analogous race occurs at two parking-lot entrances?", "Why separate elevator scheduling from door safety state?"]
---

## Answer

A title represents bibliographic information shared across copies. A copy is one identifiable physical resource with a barcode and availability state. A loan links a member to that copy and records issue/due/return information.

The checkout use case must atomically claim availability and create the active loan, using an appropriate conditional update or locked transaction and a uniqueness rule for active loans. An application-level availability check followed by an unconstrained insert can race across instances. Search availability can be stale, so checkout revalidates authoritative state.

### Evaluation rubric

Require identity, responsibility, lifecycle, and concurrency—not merely class names. Strong answers define idempotent return behavior, reservation pickup expiry, loan-policy boundaries, and which persistence operation makes the invariant hold.
