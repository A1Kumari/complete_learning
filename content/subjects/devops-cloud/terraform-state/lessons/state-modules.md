---
id: lesson-devops-terraform-state
kind: lesson
topicId: devops-terraform-state
title: Terraform state, locking, and modules
summary: Coordinate teams through protected state, dependency graphs, and reusable modules.
status: published
revision: 1
order: 10
tags: [terraform, state]
---

## Why state exists

Terraform state maps configuration addresses to managed remote objects and stores metadata used to plan changes. It can contain sensitive values even when outputs are marked sensitive. A remote backend supports shared access; configure encryption, access control, versioning or backup, and locking where the backend supports it. Do not commit state or credentials into a public repository.

Locking coordinates concurrent Terraform operations against the same state; it does not prevent manual cloud changes or another unrelated state from managing the same resource. Stale locks require understanding the backend and verifying no operation is active before recovery. State repair and import require care because an incorrect mapping can lead to destructive plans.

## Modules and dependencies

A module groups reusable configuration with inputs and outputs. Version modules, document assumptions, and prefer small clear interfaces over a single universal module. Terraform builds a dependency graph from references and can run independent operations in parallel. Separate state boundaries can reduce blast radius, but cross-state dependencies and permissions must be managed explicitly.

## Practice

Why is state locking not sufficient to prevent drift? Console edits and other automation bypass that lock. Why review a module upgrade? The same inputs can lead to different resources or replacement behavior in a new module version.

## Further reading

- [Terraform state](https://developer.hashicorp.com/terraform/language/state)
