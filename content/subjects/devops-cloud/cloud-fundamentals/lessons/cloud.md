---
id: lesson-devops-cloud-fundamentals
kind: lesson
topicId: devops-cloud-fundamentals
title: Cloud service models and responsibility
summary: Compare IaaS, PaaS, SaaS, regions, availability zones, and shared responsibilities.
status: published
revision: 1
order: 10
tags: [cloud, architecture]
---

## What the cloud provides

Cloud providers offer on-demand compute, storage, networking, and managed services. IaaS exposes infrastructure such as virtual machines; PaaS manages more of the runtime and deployment platform; SaaS delivers an application. These are useful models rather than precise universal boundaries: responsibilities depend on the specific service and configuration.

In AWS, a region is a geographic area containing multiple Availability Zones (AZs), designed as separate failure domains. Azure regions have Availability Zones for supported services; Google Cloud regions contain zones. Redundancy across zones can reduce exposure to a zone failure but does not eliminate regional failures, shared dependencies, or application errors. Check the provider's actual service guarantees.

## Shared responsibility

The provider secures and operates parts of the underlying infrastructure; customers remain responsible for their data, identities, access configuration, and application behavior, with service-specific differences. A managed database reduces operational work but does not decide your schema, access policies, backup retention, or recovery objectives. Region selection involves data residency, service availability, latency, and cost.

## Practice

If a managed storage bucket is publicly readable because of a customer policy, who must correct the configuration? The customer must manage its access settings. Does deploying in two zones replace backups? No.

## Further reading

- [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)
