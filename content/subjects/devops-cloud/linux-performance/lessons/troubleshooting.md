---
id: lesson-devops-linux-performance
kind: lesson
topicId: devops-linux-performance
title: Diagnose Linux resource pressure
summary: Correlate CPU, memory, storage, networking, and logs before changing a production host.
status: published
revision: 1
order: 10
tags: [linux, troubleshooting]
---

## Start with the symptom

Identify the affected service, time range, error rate, latency, and recent changes. Compare a healthy host if available. `uptime` shows load averages, which include runnable tasks and some uninterruptible waits on Linux; load is not a direct CPU percentage. `top` or `ps` shows busy processes, while per-core imbalance and CPU throttling may require additional metrics.

`free -h` distinguishes used memory from available memory; cache is reclaimable and is not automatically a leak. Inspect swap activity, OOM events, and process/container limits. `df -h` and `df -i` check filesystem space and inodes; `du` and `lsof` can help locate large directories or deleted-but-open files. For I/O latency and utilization, tools such as `iostat` may need separate installation.

## Correlate evidence

`ss -lnt` identifies listeners; `lsof -p PID` shows open files where permitted. `journalctl -u service --since '1 hour ago'` filters service logs. Watch for timestamps and timezone differences. High disk activity can be a symptom of memory pressure, not a disk failure; high CPU can be caused by retries from a downstream outage.

## Practice

An API is slow and CPU is low: check request queues, downstream latency, disk waits, and connection pools. Do not restart first if doing so destroys useful evidence or worsens availability; choose mitigation based on user impact and the incident context.

## Further reading

- [Linux pressure stall information](https://docs.kernel.org/accounting/psi.html)
