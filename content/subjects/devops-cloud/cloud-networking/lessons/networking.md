---
id: lesson-devops-cloud-networking
kind: lesson
topicId: devops-cloud-networking
title: Cloud networks, routing, and access
summary: Trace traffic through VPC subnets, route tables, gateways, NAT, and security controls.
status: published
revision: 1
order: 10
tags: [cloud, networking]
---

## Build a path

A virtual network such as an AWS VPC defines an IP address space; subnets divide it. Route tables choose the next hop for destination ranges. In a typical AWS design, a public subnet has a route to an internet gateway, while a private subnet does not have a direct default internet route. An instance also needs appropriate addressing and access rules; subnet naming alone does not prove exposure.

A NAT gateway can allow private instances to initiate outbound IPv4 connections without accepting unsolicited inbound connections in that pattern. It does not replace security controls or provide a general inbound service. IPv6 routing and egress mechanisms differ. A load balancer can accept external traffic and forward it to private application targets.

## Layer the controls

AWS security groups are stateful controls associated with resources; network ACLs operate at subnet boundaries and are stateless. Rules, route tables, DNS, OS firewalls, and application listeners all affect reachability. Cloud providers differ in terminology and default behavior. Avoid broad inbound rules when a narrower source and port meet the requirement.

## Practice

Trace an HTTPS request: DNS → load balancer → listener → target group → application port → response. If the target is unhealthy, inspect health-check path and security rules as well as application logs.

## Further reading

- [Amazon VPC documentation](https://docs.aws.amazon.com/vpc/)
