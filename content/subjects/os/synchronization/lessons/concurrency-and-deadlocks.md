---
id: lesson-os-synchronization
kind: lesson
topicId: os-synchronization
title: Synchronization, deadlocks, and progress
summary: Protect shared invariants, choose coordination primitives, and diagnose deadlock, starvation, and priority inversion.
difficulty: medium
status: published
revision: 1
order: 10
tags: [concurrency, locks, deadlocks]
prerequisiteIds: [lesson-os-processes-threads]
relatedIds: [os-q004, os-q005, os-q006, os-q007, os-q008, os-q009, os-q010]
---

## Protect the invariant

Suppose a bank transfer must subtract 10 from account A and add 10 to account B while preserving their combined balance. If another thread observes the accounts halfway through, it may see an invalid total. A **critical section** groups operations that must be coordinated. Every reader or writer relying on the invariant must follow the same synchronization protocol.

A race condition is an outcome that depends on an unsafe ordering of events. A data race is a more specific unsynchronized conflicting access to shared memory; its exact definition and consequences depend on the language memory model. A program can be free of data races yet have a logical race, such as checking a condition under a lock and acting after releasing it.

## Pick the right primitive

| Primitive | Useful for | Important limitation |
| --- | --- | --- |
| Mutex | Exclusive access to an invariant | Keep critical sections short and release on every path; ownership rules depend on the API. |
| Semaphore | Counting available permits or signaling | It does not generally identify a resource owner; pair waits and posts correctly. |
| Condition variable | Sleeping until a predicate may have changed | Check the predicate in a loop under its associated mutex; wakeups do not guarantee the condition is true. |
| Atomic operation | An indivisible operation on supported shared data | Multiple atomic operations do not automatically form one atomic transaction; ordering semantics matter. |
| Read-write lock | Concurrent readers and exclusive writers | Fairness and overhead vary; a reader-heavy workload does not guarantee a speedup. |

For a bounded queue, a producer waits while the queue is full, inserts under a mutex, and signals consumers. A consumer similarly waits while empty, removes under the mutex, and signals producers. Rechecking the predicate after waking handles both spurious wakeups and other threads changing the queue first.

A spinlock repeatedly checks for availability rather than sleeping. It can be appropriate for very short waits in carefully designed low-level code, but wastes CPU while waiting and can be especially harmful if the owner is preempted. Single-core behavior depends on preemption and lock implementation; it is not automatically an infinite loop.

## Deadlock and its prevention

If T1 holds lock A and waits for B while T2 holds B and waits for A, neither can progress. The four Coffman conditions are mutual exclusion, hold-and-wait, no preemption, and circular wait. All are necessary for the classical resource deadlock model. Preventing at least one prevents that kind of deadlock: for example, require all code to acquire A before B. A total lock order only works if every path follows it, including error handling.

Avoidance is different from prevention. The banker's algorithm grants a request only when the resulting resource-allocation state has a safe completion sequence, given declared maximum demands. An unsafe state is not necessarily already deadlocked. Detection and recovery instead allow deadlocks and then identify and resolve them, potentially by aborting work or releasing resources.

## Other progress failures

- **Starvation:** a particular task repeatedly loses access to a resource while others progress. Fair queues or aging can help, subject to implementation.
- **Livelock:** tasks keep responding to one another but make no useful progress; randomized backoff may help.
- **Priority inversion:** a high-priority task waits for a lock held by a lower-priority task, which medium-priority work can delay. Priority inheritance temporarily boosts the lock holder where supported; it does not eliminate every scheduling delay.

## Check your understanding

If a mutex protects each account separately, can a reader still observe a half-completed transfer? Yes, unless it follows a protocol that protects the whole invariant. Does `join()` protect updates? No; it waits for a thread to finish.

## Further reading

- [POSIX condition variable semantics](https://pubs.opengroup.org/onlinepubs/9799919799/functions/pthread_cond_wait.html)
- [Linux futexes](https://man7.org/linux/man-pages/man7/futex.7.html)
