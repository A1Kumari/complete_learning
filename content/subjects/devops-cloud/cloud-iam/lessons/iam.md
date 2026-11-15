---
id: lesson-devops-cloud-iam
kind: lesson
topicId: devops-cloud-iam
title: Cloud identity, roles, and least privilege
summary: Model who can perform which actions on which resources and prefer short-lived credentials.
status: published
revision: 1
order: 10
tags: [cloud, iam, security]
---

## Identity and authorization

An identity represents a person or workload. A role grants permissions through policies and is assumed by an authorized principal; exact evaluation depends on the provider. In AWS, identity policies, resource policies, permission boundaries, organization policies, and explicit denies can all affect the result. A policy should limit actions, resources, and relevant conditions rather than grant unrestricted administrative access.

Prefer workload identity and temporary credentials over long-lived access keys embedded in applications or CI. Authenticate humans through centralized identity and use MFA as appropriate. Store secrets in a dedicated system, rotate them, restrict access, and avoid logging values. Encryption keys require their own access and recovery planning.

## Diagnose access

Identify the actual principal, action, resource, environment, and denied request. Check trust policy and role assumption separately from permissions on the target resource; inspect audit logs and provider policy tools. A correct identity policy may still be limited by another control or an explicit deny.

## Practice

Why is an instance role preferable to an access key in a container image? Credentials can be temporary and managed separately from the artifact. Does permission to assume a role automatically grant every resource action? No; the role's effective policies determine access.

## Further reading

- [AWS IAM documentation](https://docs.aws.amazon.com/IAM/)
