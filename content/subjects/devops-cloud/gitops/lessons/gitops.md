---
id: lesson-devops-gitops
kind: lesson
topicId: devops-gitops
title: GitOps and Argo CD reconciliation
summary: Manage desired state through versioned configuration and understand reconciliation, drift, and rollback.
status: published
revision: 1
order: 10
tags: [gitops, argo-cd]
---

## Desired state in Git

GitOps uses versioned declarative configuration as the desired state, with automated reconciliation to converge the target environment. A pull request provides review and history; a controller observes Git and the cluster, detects differences, and can apply changes according to policy. A Git commit is a record of desired state, not proof that the application is healthy or that reconciliation succeeded.

Argo CD manages applications from Git sources and reports synchronization and health. Automatic sync and self-healing are configurable, not inherent to every installation. An out-of-band cluster edit can appear as drift and may be overwritten if self-healing is enabled. Protect repository branches, controller credentials, and the permissions granted to applications.

## Releases and recovery

Promote a tested image digest by updating the appropriate environment configuration. Check sync status, rollout health, and user metrics. Reverting a Git change can restore a prior desired manifest, but cannot automatically reverse destructive database changes or external side effects. Secret values should use a suitable secret-management approach rather than plaintext commits.

## Practice

If Git says three replicas but the cluster has two, what happens? The controller can detect drift and, if configured to reconcile automatically, attempt to restore three; quota or scheduling failures may prevent convergence.

## Further reading

- [Argo CD documentation](https://argo-cd.readthedocs.io/en/stable/)
