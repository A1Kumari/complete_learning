---
id: lesson-devops-alerting
kind: lesson
topicId: devops-alerting
title: Actionable alerts and incident diagnosis
summary: Design alerts around user impact, route them correctly, and investigate with correlated evidence.
status: published
revision: 1
order: 10
tags: [alerting, incidents]
---

## Alert on actionable symptoms

An alert should identify a meaningful condition, affected service, severity, owner, and a useful runbook. Page for urgent user impact or imminent loss of service; use tickets or dashboards for lower-urgency capacity and maintenance issues. Alert on sustained error ratios or SLO burn, with traffic volume and no-data behavior considered, rather than a noisy single threshold alone.

Prometheus alerting rules can send alerts to Alertmanager, which groups, routes, silences, and inhibits notifications according to configuration. Group related symptoms to reduce noise, but do not suppress independent failures blindly. Test the entire path from metric to on-call notification, including missing telemetry and escalation.

## Investigate and mitigate

Establish the impact, start time, and scope; compare recent changes; inspect request rate, errors, latency, saturation, traces, and logs. Form a hypothesis and test it against evidence. Mitigate safely, monitor the result, communicate status, and capture a timeline. A restart may be helpful in some incidents but can also erase evidence or increase load.

## Practice

Why can CPU at 90% be a poor page by itself? It may be expected with no user impact or may miss an I/O-bound outage. Why alert on missing metrics separately? A broken collector can mask the actual condition.

## Further reading

- [Prometheus Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)
