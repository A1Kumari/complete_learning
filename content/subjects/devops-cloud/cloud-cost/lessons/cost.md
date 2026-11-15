---
id: lesson-devops-cloud-cost
kind: lesson
topicId: devops-cloud-cost
title: Cloud cost and architecture tradeoffs
summary: Attribute spending, right-size resources, and balance cost against availability and recovery needs.
status: published
revision: 1
order: 10
tags: [cloud, cost]
---

## Understand the bill

Compute hours are only one component. Storage capacity, I/O, requests, snapshots, managed service tiers, load balancers, NAT processing, and data transfer can dominate a workload. Use provider billing exports, tags or labels, and account/project boundaries to attribute spend; shared costs need a deliberate allocation rule. Budgets and alerts identify changes but do not automatically stop spending.

## Optimize with measurements

Measure utilization and latency over representative peaks before right-sizing. Remove idle resources, apply storage lifecycle policies consistent with retention requirements, and choose autoscaling or purchase commitments based on predictable usage. Reserved or committed discounts can reduce unit cost but reduce flexibility; spot capacity trades lower price for interruption risk. Egress and cross-zone traffic can change the economics of a design.

Do not optimize away resilience without evaluating the consequences. A single-zone database may be cheaper but increases recovery exposure. Compare the cost of redundancy, backup, and testing against business RPO/RTO and expected impact, not just the monthly bill.

## Practice

A service has low average CPU but high p99 latency during daily peaks. Would you immediately downsize? No; inspect peak capacity, memory, queueing, and dependencies first. Why tag resources? Tags support attribution, but missing tags and shared services require additional allocation.

## Further reading

- [AWS Well-Architected cost optimization](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
