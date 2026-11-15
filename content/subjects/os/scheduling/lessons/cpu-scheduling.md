---
id: lesson-os-cpu-scheduling
kind: lesson
topicId: os-scheduling
title: CPU scheduling and context switches
summary: Compare scheduling policies using a worked example and reason about throughput, response time, fairness, and switching overhead.
difficulty: medium
status: published
revision: 1
order: 10
tags: [scheduling, performance]
prerequisiteIds: [lesson-os-processes-threads]
relatedIds: [os-q011, os-q021]
---

## What is the scheduler choosing?

The scheduler selects a runnable thread for an available CPU. A running thread can be preempted, yield, block for an event, or exit. A blocked thread becomes runnable when its event occurs; it may still wait in a run queue before receiving CPU time. Multicore scheduling also considers CPU affinity, load balancing, and cache locality.

Key measurements are **response time** (arrival to first execution), **turnaround time** (arrival to completion), **waiting time** (time runnable but not running), and **throughput** (completed work per unit time). They measure different goals; improving one can worsen another. For real workloads, turnaround also includes I/O and other blocked time.

## Compare policies with a small trace

Assume one CPU, all jobs arrive at time 0, no I/O, and switching has zero cost. Jobs A, B, C require 8, 4, and 2 time units respectively.

| Policy | Execution order or intervals | Completion times A, B, C | Mean turnaround |
| --- | --- | --- | --- |
| First come, first served | A 0–8, B 8–12, C 12–14 | 8, 12, 14 | 34/3 ≈ 11.33 |
| Shortest job first | C 0–2, B 2–6, A 6–14 | 14, 6, 2 | 22/3 ≈ 7.33 |
| Round robin, quantum 2 | A 0–2, B 2–4, C 4–6, A 6–8, B 8–10, A 10–14 | 14, 10, 6 | 30/3 = 10 |

Round robin returns to A after B finishes; its final two quanta are adjacent. Its first response times are 0, 2, and 4 rather than 0, 8, and 12 under FCFS. With these assumptions, shorter jobs first minimize mean completion time, but real burst lengths are not known perfectly and arrivals complicate the decision.

## Policy tradeoffs

- **FCFS** is simple but a long CPU burst can delay short jobs: the convoy effect.
- **Shortest job or shortest remaining time** favors short work; sustained short arrivals can starve long jobs. Estimation is necessary in practice.
- **Round robin** improves responsiveness through time slices. Very short slices increase overhead; very long slices approach FCFS.
- **Priority scheduling** serves higher-priority work first. Aging can raise the priority of long-waiting work to reduce starvation.
- **Multilevel feedback queues** adjust priority using observed behavior. One common design favors interactive tasks and periodically boosts waiting tasks, but real operating systems use different policies and implementations.

## What a switch costs

A context switch saves the outgoing thread's execution state and restores the incoming thread's state. Switching between address spaces can require additional memory-management work. Cache misses, translation-cache effects, and CPU migration can impose indirect costs after the switch. Tagged translation caches may avoid a full TLB flush, so a process switch does not universally flush it. Measure on the actual system rather than assuming a fixed time.

## Practice

If the quantum becomes tiny, what improves and what worsens? Waiting tasks can get a first turn sooner, but switching overhead takes a larger share of CPU. If an I/O completion occurs, does the thread immediately run? It becomes runnable; scheduling still determines when it runs.

## Further reading

- [Linux scheduling overview](https://man7.org/linux/man-pages/man7/sched.7.html)
