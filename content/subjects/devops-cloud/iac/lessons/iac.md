---
id: lesson-devops-iac
kind: lesson
topicId: devops-iac
title: Infrastructure as code and drift
summary: Manage infrastructure changes through versioned definitions, review, and reconciliation.
status: published
revision: 1
order: 10
tags: [iac, automation]
---

## Infrastructure as a lifecycle

Infrastructure as code (IaC) describes infrastructure in version-controlled files and applies changes through tools. Declarative configuration states a desired result; imperative automation specifies steps. Real tools combine both approaches. Version control provides review and history, while automated plans can reveal intended creates, changes, and deletions before applying them.

Typical flow: change configuration, validate and test, generate a plan using the correct environment and credentials, review the proposed changes, apply, then verify actual behavior. Keep environments isolated and use least-privilege identities. A plan is not a guarantee of success: permissions, provider APIs, and concurrent changes can affect apply.

## Drift and ownership

Drift occurs when actual resources differ from managed configuration, for example after a console edit. Detect it through refresh/plan or provider-specific mechanisms and decide whether to adopt, revert, or investigate the change. Avoid two independent systems managing the same attribute. Importing an existing resource into a tool's state does not automatically generate the correct desired configuration.

## Practice

Why review an IaC plan? A small configuration change can replace or delete persistent resources. Does IaC remove the need for backups? No; desired configuration cannot reconstruct lost application data by itself.

## Further reading

- [Terraform workflow](https://developer.hashicorp.com/terraform/intro/core-workflow)
