---
id: lesson-devops-kubernetes-security
kind: lesson
topicId: devops-kubernetes-security
title: Kubernetes security and troubleshooting
summary: Scope RBAC and service accounts, configure probes, and diagnose common Pod failures.
status: published
revision: 1
order: 10
tags: [kubernetes, security, troubleshooting]
---

## Workload access

Service accounts identify workloads to the Kubernetes API. RBAC roles and bindings grant verbs on resources in a namespace or cluster scope. Give each workload only required permissions and avoid broad cluster-admin grants. Disable automatic token mounting when an application does not need Kubernetes API access. Pod security settings, image provenance, network controls, and secret access complement RBAC.

Startup probes allow slow initialization; readiness probes decide when a Pod can receive normal Service traffic; liveness probes detect conditions for which restarting a container is appropriate. A liveness check that fails whenever a shared database is briefly unavailable can cause cascading restarts. Define probes around the application's actual behavior.

## Diagnose before changing

`kubectl describe pod NAME` reveals events such as scheduling failures or image pull errors. `kubectl logs POD -c CONTAINER --previous` can reveal the previous terminated container's output. For `CrashLoopBackOff`, inspect exit status, configuration, dependencies, and probes. For Pending, inspect requests, selectors, taints, and PVCs. For a Service outage, inspect ready endpoints and networking.

## Practice

Why can a Pod be running but not receive traffic? Its readiness probe may fail or its labels may not match the Service selector. Does a Secret become safe merely because it is a Kubernetes object? No; protect storage and access.

## Further reading

- [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- [Kubernetes probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
