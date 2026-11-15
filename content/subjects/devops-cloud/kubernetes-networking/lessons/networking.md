---
id: lesson-devops-kubernetes-networking
kind: lesson
topicId: devops-kubernetes-networking
title: Kubernetes Services, ingress, and network policy
summary: Follow traffic through Services, DNS, ingress or Gateway API, and network policy.
status: published
revision: 1
order: 10
tags: [kubernetes, networking]
---

## Service discovery and traffic

Pods have changing IPs. A Service selects or otherwise identifies endpoints and exposes a stable virtual endpoint and DNS name. `ClusterIP` is typically internal, `NodePort` exposes a port on nodes, and `LoadBalancer` requests an external load balancer where supported. Availability and exposure depend on cluster and provider configuration. A selector mismatch or no ready endpoints can make a Service unreachable despite correct DNS.

Ingress describes HTTP routing and requires an ingress controller. Gateway API offers a more expressive role-oriented model and also needs a compatible implementation. TLS termination, hostnames, routing, and backend ports must all match. The cluster networking implementation, commonly installed through a CNI plugin, provides Pod connectivity.

## NetworkPolicy and diagnosis

NetworkPolicies describe allowed Pod traffic when enforced by a supporting network plugin. Policies are additive, and an applicable isolation policy can deny traffic not allowed by another applicable policy. They are not automatically a complete application firewall or a substitute for authentication and encryption.

Check `kubectl get service,endpointslices`, Pod readiness, selectors, target ports, DNS, policy enforcement, and application listeners. Test from the relevant source namespace: localhost inside one Pod is not another Pod.

## Practice

DNS resolves a Service but requests fail: inspect its ready endpoints and target port. Does an Ingress object alone provide an ingress controller? No.

## Further reading

- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
