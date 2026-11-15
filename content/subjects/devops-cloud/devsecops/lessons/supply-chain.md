---
id: lesson-devops-devsecops
kind: lesson
topicId: devops-devsecops
title: DevSecOps and software supply chains
summary: Protect source, dependencies, builds, artifacts, and deployment credentials throughout delivery.
status: published
revision: 1
order: 10
tags: [security, supply-chain, cicd]
---

## Secure the delivery path

Protect source repositories and pipeline definitions with reviewed changes and appropriate access controls. Pin dependencies and build tools where practical, scan dependencies and container images, and maintain an update process. A software bill of materials (SBOM) inventories components; it helps identify exposure but does not prove software is safe. Vulnerability findings require context, prioritization, and remediation.

Build in isolated environments with minimal credentials. Prefer short-lived workload identities; never place secrets in image layers, build logs, or committed configuration. Scan for accidental secrets and rotate exposed credentials. Prevent untrusted pull-request code from accessing privileged deployment tokens.

## Artifact integrity

Record artifact digests and provenance linking an artifact to its source and build. Signing can provide evidence of identity and integrity, but only if the deployment system verifies signatures against a trusted policy. Promote the same verified artifact across environments. Regularly patch builders, base images, actions, and dependencies; a signed vulnerable artifact is still vulnerable.

## Practice

What does an SBOM tell you? Which components are listed, not whether every component is safe. Why verify signatures at deployment? A signature that is never checked does not enforce artifact provenance.

## Further reading

- [SLSA supply-chain security](https://slsa.dev/)
