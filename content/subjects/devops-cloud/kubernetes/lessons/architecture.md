---
id: lesson-devops-kubernetes
kind: lesson
topicId: devops-kubernetes
title: Kubernetes control plane and nodes
summary: Follow a workload from an API request through scheduling and reconciliation on a node.
status: published
revision: 1
order: 10
tags: [kubernetes, orchestration]
---

## Desired state and reconciliation

Kubernetes manages containerized workloads through an API. You submit desired objects such as Deployments; controllers continuously compare desired and observed state and attempt to close the gap. A successful API request means the object was accepted, not that the application is ready.

The API server authenticates, authorizes, validates, and serves the API. etcd stores cluster state. Controllers reconcile resources; the scheduler assigns unscheduled Pods to suitable nodes. The kubelet on a node works with a container runtime to start and monitor the assigned containers. Cloud controllers and networking/storage components may provide additional integrations.

## Trace a deployment

When a Deployment requests three replicas, its controller manages a ReplicaSet, which creates Pods. The scheduler selects nodes based on resources and constraints; kubelets start containers. Readiness determines whether Pods are eligible for normal Service traffic. A Pod can remain Pending because of insufficient resources or incompatible constraints even if the control plane is healthy.

## Practice

What happens if a node fails? Controllers can create replacement Pods if the cluster has capacity and constraints permit; recovery is not instantaneous and persistent storage constraints can matter. Is etcd a substitute for application database backups? No.

## Further reading

- [Kubernetes components](https://kubernetes.io/docs/concepts/overview/components/)
