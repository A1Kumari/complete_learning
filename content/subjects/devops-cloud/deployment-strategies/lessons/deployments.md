---
id: lesson-devops-deployment-strategies
kind: lesson
topicId: devops-deployment-strategies
title: Rolling, blue-green, and canary releases
summary: Compare release strategies and design rollback around traffic, health, and data compatibility.
status: published
revision: 1
order: 10
tags: [deployment, reliability]
---

## Choose how change reaches users

| Strategy | Mechanism | Main tradeoff |
| --- | --- | --- |
| Rolling | Replace instances gradually | Old and new versions coexist; capacity and compatibility matter. |
| Blue-green | Maintain two environments and switch traffic | Fast traffic switch, but duplicate capacity and shared data still need care. |
| Canary | Route a small share to the new version, then expand | Limits initial exposure but needs representative traffic and reliable analysis. |

Readiness checks should represent whether an instance can serve traffic; monitor error rate, latency, and business outcomes by version. Decide thresholds, observation windows, and who can stop a rollout before deployment. A small canary may not expose rare or time-dependent failures.

## Rollback is more than traffic

Reverting application code may not reverse a destructive schema migration, message already published, or third-party payment. Use backward-compatible expand-and-contract migrations: add the new representation, support both versions while migrating, and remove old structures only after verification. Retain the prior artifact and configuration, rehearse rollback, and know when roll-forward or data repair is necessary.

## Practice

Can blue-green alone undo a dropped database column? No. Why monitor canary and baseline separately? Aggregate metrics can hide a small cohort's failure.

## Further reading

- [Kubernetes rolling updates](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
