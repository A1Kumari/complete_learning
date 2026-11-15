---
id: lesson-devops-kubernetes-config
kind: lesson
topicId: devops-kubernetes-config
title: Kubernetes configuration, secrets, and storage
summary: Configure workloads with ConfigMaps and Secrets and provide persistent volumes through claims.
status: published
revision: 1
order: 10
tags: [kubernetes, storage, configuration]
---

## Configuration and secrets

ConfigMaps hold non-secret configuration; Secrets hold sensitive values and can be supplied as environment variables or mounted files. Kubernetes Secret values are base64-encoded in manifests, not encrypted by that encoding. Restrict RBAC, configure encryption at rest where appropriate, and consider an external secret manager. Avoid committing plaintext secrets. Environment variables injected into an existing container do not automatically change when a ConfigMap or Secret changes; mounted content and application reload behavior have their own timing and limitations.

## Persistent storage

A PersistentVolume (PV) represents storage; a PersistentVolumeClaim (PVC) requests capacity and access characteristics. A StorageClass can enable dynamic provisioning through an appropriate driver. Access modes and topology constrain where a claim can be mounted; they are not a complete file-level access-control system. Reclaim policies determine what happens to backing storage after a claim is released, so inspect them before deletion.

Stateful workloads still need application-consistent backup and restoration. A PVC keeps storage independent from a particular Pod, but does not provide an independent backup or guarantee replication.

## Practice

Why is a PVC Pending? Check its StorageClass, provisioner, requested access mode, capacity, and events. Why is base64 not sufficient for secrets? It is reversible encoding, not encryption.

## Further reading

- [Kubernetes persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
