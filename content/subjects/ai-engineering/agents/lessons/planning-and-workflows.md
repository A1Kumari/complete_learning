---
id: lesson-ai-agent-planning-workflows
kind: lesson
topicId: ai-agents
title: Planning, ReAct, and Workflow Orchestration
summary: Compare fixed workflows, plans, and ReAct-style loops, then choose the smallest control structure that solves the task.
difficulty: medium
status: published
revision: 1
order: 575
tags: [agents, planning, react, orchestration]
prerequisiteIds: [lesson-ai-agent-loop, lesson-ai-agent-tools]
---

## Three control styles

Code-defined workflows are predictable and easy to test. A precomputed plan gives the
model a sequence to propose before execution. ReAct-style loops alternate reasoning
about the next action with observations. Plans can become stale; loops can repeat or
compound errors. Both need application-owned budgets and validators.

```text
task → choose next bounded action → observe result → update state → continue/stop
```

Use deterministic routing for known branches, model choice for genuinely uncertain
discovery, and a fixed validation step after autonomous work. Parallel tool calls need
conflict rules and independent authorization; concurrency is not free correctness.

## Measure the choice

Compare task success, unsupported claims, tool-call accuracy, latency, cost, and
recovery behavior against a simpler baseline. If an agent does not improve the target
metric, remove autonomy.

## Recall

Why can a plan be invalid after the first observation? What should remain deterministic
even inside a model-directed loop?
