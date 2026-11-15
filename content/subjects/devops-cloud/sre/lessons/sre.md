---
id: lesson-devops-sre
kind: lesson
topicId: devops-sre
title: SLIs, SLOs, and error budgets
summary: Define measurable reliability objectives and use error budgets to guide operational decisions.
status: published
revision: 1
order: 10
tags: [sre, reliability]
---

## Start with the user's experience

A service-level indicator (SLI) measures an aspect of service, such as the fraction of valid requests completed successfully within one second. A service-level objective (SLO) sets a target for that indicator over a defined window. A service-level agreement (SLA) is an external commitment that may include consequences; it is not synonymous with an internal SLO.

For a 99.9% availability SLO over 30 days, the error budget is 0.1% of eligible events or time, depending on the SLI. If measured as elapsed time, 30 × 24 × 60 × 0.001 = 43.2 minutes. Request-based and time-based budgets are not interchangeable. Define eligible requests, success, latency, and treatment of errors and background jobs.

## Use the budget

An error budget makes the tradeoff between delivery and reliability explicit. Rapid burn can trigger investigation or a temporary change in release policy; a healthy budget can permit planned experimentation. Burn-rate alerts compare the observed error rate with the permitted rate over appropriate windows. The SLO should match user needs, not an arbitrary number chosen because it looks impressive.

## Practice

Why can a 200 response still violate an SLO? It may be too slow or fail to complete the promised business operation. Why define a measurement window? The same error count has different meaning across traffic volumes and time periods.

## Further reading

- [Google SRE service level objectives](https://sre.google/sre-book/service-level-objectives/)
