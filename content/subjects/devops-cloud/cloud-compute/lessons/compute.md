---
id: lesson-devops-cloud-compute
kind: lesson
topicId: devops-cloud-compute
title: Choose cloud compute and autoscaling
summary: Compare VMs, managed containers, and serverless compute using operational and workload requirements.
status: published
revision: 1
order: 10
tags: [cloud, compute]
---

## Compute choices

Virtual machines offer OS-level control and predictable long-lived environments, but require patching and capacity management. Managed containers reduce orchestration work while preserving container packaging; responsibility varies by service. Serverless functions or managed request platforms scale execution without directly managing servers, but have product-specific execution limits, cold-start behavior, concurrency, and pricing.

Choose an instance family based on measured CPU, memory, storage, and network needs. A memory-bound workload does not improve simply because more CPU is provisioned. Consider architecture compatibility, availability, startup time, and licensing. AWS EC2, ECS/Fargate, and Lambda illustrate different management boundaries; comparable services exist on other clouds.

## Autoscaling and limits

Scale on a signal linked to demand, such as request concurrency or queue age, not only CPU. Set minimum and maximum capacity, account for startup delay and cooldown, and load-test downstream databases and quotas. Scaling application replicas can overload a shared database or connection pool. Spot/preemptible capacity can lower cost but can be interrupted; use it only for suitable fault-tolerant workloads.

## Practice

Why might CPU-based scaling miss a growing backlog? Workers may be waiting on I/O while the queue grows. Why is serverless not unlimited? Concurrency, execution time, downstream capacity, and quotas remain finite.

## Further reading

- [AWS compute services](https://aws.amazon.com/products/compute/)
