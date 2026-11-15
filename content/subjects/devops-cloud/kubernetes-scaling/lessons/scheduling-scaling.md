---
id: lesson-devops-kubernetes-scaling
kind: lesson
topicId: devops-kubernetes-scaling
title: Kubernetes scheduling and autoscaling
summary: Reason about resource requests and limits, placement constraints, and horizontal autoscaling.
status: published
revision: 1
order: 10
tags: [kubernetes, scaling]
---

## Placement and resources

The scheduler considers resource requests, node availability, affinity, taints, and other constraints when placing Pods. Requests reserve schedulable capacity; limits constrain runtime resource use. CPU limits can cause throttling, while memory limit violations can lead to termination. Exact behavior depends on kernel and cluster configuration. A Pod can be Pending even when observed usage is low if its requests do not fit allocatable capacity.

Node selectors and affinity express placement preferences or requirements. Taints repel Pods unless they have matching tolerations; a toleration permits placement but does not guarantee it. Spreading replicas across failure domains improves resilience only if there is enough capacity in those domains.

## Autoscaling

The Horizontal Pod Autoscaler adjusts replica count using configured metrics and bounds. CPU utilization targets generally depend on resource requests, and metrics must be available. Node autoscaling can add capacity for unschedulable Pods when configured, but cannot fix an impossible selector or missing storage. Account for startup time and downstream capacity; scaling frontends can exhaust a database pool.

## Practice

Why can HPA fail to scale on CPU? Metrics may be unavailable or required requests missing. Why can adding replicas fail to reduce latency? The bottleneck may be a shared downstream service or insufficient node capacity.

## Further reading

- [Kubernetes resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
