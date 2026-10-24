---
id: lesson-ai-what-is-an-agent
kind: lesson
topicId: ai-agents
title: What Makes a System an AI Agent?
summary: Distinguish a model call, deterministic workflow, and model-directed agent by examining who chooses the next action and who executes it.
difficulty: easy
status: published
revision: 1
order: 555
tags: [agents, workflows, autonomy]
prerequisiteIds: [lesson-ai-model-api-lifecycle, lesson-ai-api-tool-calling]
---

## Labels are less useful than control flow

A model call maps input to output. A deterministic workflow follows code-defined steps.
An agent lets a model propose the next step from a task, state, observations, and
available tools. The application still validates and executes that proposal.

```text
model proposal ≠ permission ≠ execution ≠ successful completion
```

For a policy assistant, retrieve-then-answer is often a workflow. A system that decides
which policy source to query next, requests approval for a refund, and resumes after a
pause is more agent-like. More autonomy adds latency, cost, and failure modes; it is
not automatically an improvement.

## Define completion first

An agent needs a task-specific success condition, step and cost budgets, tool allowlist,
and explicit failure states. “The model said done” is not evidence that a side effect
occurred or that the answer is supported.

## Recall

Who should execute a proposed tool call? Give one reason a fixed workflow may be safer
than an agent for a narrow task.

Continue to [the observe-plan-act loop](agent-loop.md).
