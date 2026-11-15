---
id: lesson-devops-helm
kind: lesson
topicId: devops-helm
title: Helm charts and releases
summary: Package Kubernetes manifests with charts, values, templates, and versioned releases.
status: published
revision: 1
order: 10
tags: [helm, kubernetes]
---

## Charts and values

A Helm chart packages templates, defaults, metadata, and optionally dependencies. Values customize the rendered Kubernetes manifests; a release is an installed instance of a chart in a cluster. Chart version and application version are distinct. A values file can configure replicas, image identity, resources, and service settings, but should not contain committed plaintext secrets.

`helm lint` checks a chart, and `helm template` renders manifests locally for inspection. `helm upgrade --install` can install or update a release, but applying it changes the cluster; review rendered manifests and target namespace first. Pin chart and image versions, inspect upstream changes, and validate the generated resources against the target Kubernetes version.

## Upgrade and rollback

Helm tracks release revisions and supports rollback, but restoring Kubernetes manifests does not automatically reverse database migrations, persistent data, or external side effects. Hooks can run lifecycle actions and introduce ordering and cleanup complexity. Monitor rollout and application health after an upgrade, and test recovery with the actual data lifecycle.

## Practice

Why render a chart before installation? Values and templates can produce unexpected resources. Does `helm rollback` guarantee the application is restored? No; stateful changes and compatibility must be handled separately.

## Further reading

- [Helm documentation](https://helm.sh/docs/)
