---
id: lesson-devops-incidents
kind: lesson
topicId: devops-incidents
title: Incident response and learning
summary: Coordinate incident roles, mitigation, communication, and blameless follow-up.
status: published
revision: 1
order: 10
tags: [incidents, reliability]
---

## Respond in a structured way

An incident begins with detection and assessment: identify user impact, scope, and severity, then assign an incident lead and communication channel. Delegate investigation and record a timeline. Stabilize the service with a reversible mitigation where possible, such as reducing traffic, disabling a feature, or rolling back a compatible release. Avoid assuming the most recent change is the cause without evidence.

Communicate what is known, what is being done, and when the next update will arrive. Escalate when expertise or authority is needed. Preserve useful logs and metrics and track actions so multiple responders do not make conflicting changes. Verify recovery against user-facing indicators, not only process status.

## Learn after recovery

A blameless postmortem describes impact, timeline, contributing conditions, detection, response, and specific follow-up actions with owners. Look for systemic causes and multiple contributing factors rather than stopping at human error. Track actions to completion and test the runbook or automation that changes as a result.

## Practice

If a deployment coincides with an outage, what next? Compare affected versions and rollback feasibility while checking other evidence. Why name an incident lead? Coordination and decisions need a clear owner while others investigate.

## Further reading

- [Google SRE incident management](https://sre.google/sre-book/managing-incidents/)
