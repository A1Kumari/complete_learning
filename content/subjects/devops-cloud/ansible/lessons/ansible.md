---
id: lesson-devops-ansible
kind: lesson
topicId: devops-ansible
title: Ansible and idempotent configuration
summary: Use inventories, playbooks, roles, and handlers to manage machine configuration consistently.
status: published
revision: 1
order: 10
tags: [ansible, configuration-management]
---

## Inventory and execution

Ansible selects hosts from an inventory and runs tasks from a playbook, commonly connecting to Linux hosts over SSH. Modules describe operations such as installing a package or managing a file. Variables parameterize environments; roles organize tasks, handlers, templates, and defaults. Privilege escalation should be scoped to tasks that need it.

An idempotent task reaches the desired state without making unnecessary changes on subsequent runs. For example, a package module can ensure a package is installed; an unconditional shell command may execute every time. Idempotence depends on module behavior and configuration; a playbook is not automatically idempotent just because Ansible runs it.

## Verify and operate

Use check mode and diff mode where supported to preview changes, but modules vary and previews cannot guarantee production behavior. Test against a representative environment, limit initial rollout, and use handlers to restart a service only after relevant configuration changes. Protect inventory secrets with an appropriate secret manager or Ansible Vault, and avoid printing them in logs.

## Practice

Why prefer a package module over `shell: apt install ...`? The module can express desired state and report changes consistently. Why might a handler fail to run? The notifying task may not report a change, or execution may fail before handlers run.

## Further reading

- [Ansible getting started](https://docs.ansible.com/ansible/latest/getting_started/index.html)
