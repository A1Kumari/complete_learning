---
id: lesson-devops-terraform
kind: lesson
topicId: devops-terraform
title: Terraform configuration and workflow
summary: Read Terraform resources, providers, variables, outputs, plans, and dependencies.
status: published
revision: 1
order: 10
tags: [terraform, iac]
---

## The configuration model

Terraform uses HCL to describe resources managed by providers. A `resource` declares an object to manage; a data source reads information from an existing system. Input variables parameterize configuration and outputs expose selected results. References create dependency relationships; use explicit `depends_on` only when a real dependency is not captured by references.

`terraform init` initializes providers and the configured backend; `terraform fmt -check` checks formatting, `terraform validate` checks configuration, and `terraform plan` previews proposed changes. `terraform apply` makes changes and can incur real cost or replace resources. Use a dedicated environment, reviewed configuration, and appropriate credentials. Commit the provider lock file where recommended and pin compatible versions.

## Example shape

An application module might accept a region and network ID, create a service and security rules using a cloud provider, and output the service endpoint. A data source can look up an existing network, but an ambiguous lookup or changed environment can select the wrong resource. Review the plan and resource addresses before applying.

Sensitive variable markings reduce accidental display but do not guarantee values are absent from state or plan files. Protect those artifacts as sensitive data.

## Practice

Does `validate` confirm your cloud account has permission to create every resource? No. Does changing a resource's name in configuration necessarily rename it in place? Not always; inspect the plan for replacement.

## Further reading

- [Terraform language documentation](https://developer.hashicorp.com/terraform/language)
