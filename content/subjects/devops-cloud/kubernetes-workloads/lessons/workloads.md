---
id: lesson-devops-kubernetes-workloads
kind: lesson
topicId: devops-kubernetes-workloads
title: Pods and workload controllers
summary: Choose Deployments, StatefulSets, DaemonSets, and Jobs based on workload lifecycle.
status: published
revision: 1
order: 10
tags: [kubernetes, workloads]
---

## Pods and controllers

A Pod is the smallest deployable Kubernetes unit. Containers in a Pod share network identity and can share volumes; each has its own process and filesystem configuration. Pods are replaceable, so avoid depending on their IP address or local writable layer for durable identity and data.

A Deployment manages ReplicaSets for stateless replicas and rolling updates. A StatefulSet supplies stable ordinal identities and supports persistent volume claims for workloads that need them; it does not itself make a database highly available. A DaemonSet runs Pods on eligible nodes, useful for node-level agents. A Job runs tasks to completion; a CronJob creates Jobs on a schedule, where duplicate or missed executions must be considered.

## Operate a rollout

`kubectl get deployments,pods` shows current objects; `kubectl describe pod NAME` shows events and status; `kubectl logs POD` retrieves container output. `kubectl rollout status deployment/NAME` reports rollout progress. Set requests, probes, and termination behavior appropriate for the application. A controller can replace failed Pods, but a repeated crash needs diagnosis, not just more replicas.

## Practice

Why use a Service rather than store Pod IPs in clients? Pods are replaced and addresses change. Does a Job guarantee exactly-once external side effects? No; tasks can retry and must account for duplication.

## Further reading

- [Kubernetes workloads](https://kubernetes.io/docs/concepts/workloads/)
