---
id: lesson-ai-why-agent-frameworks
kind: lesson
topicId: ai-agent-frameworks
title: Why Agent Frameworks Exist
summary: Understand the repeated orchestration problems frameworks address and the costs they introduce before learning framework syntax.
difficulty: easy
status: published
revision: 1
order: 595
tags: [agent-frameworks, orchestration, state]
prerequisiteIds: [lesson-ai-agent-loop, lesson-ai-agent-recovery]
---

## Repeated plumbing becomes a system

An agent application may need message conversion, tool schemas, routing, retries,
streaming events, checkpoints, human pauses, tracing, and provider adapters. A
framework can standardize those mechanics and provide tested extension points.

## Abstraction is not ownership

The framework cannot infer whether a refund is authorized, whether a retry duplicated a
charge, whether retrieved data is current, or whether an answer satisfies the business
task. It can expose hooks; the application must define invariants and acceptance.

## Choose by failure behavior

Compare plain Python, a runnable composition library, a graph runtime, and an agent SDK
on debugging, state persistence, interrupts, portability, observability, dependency
cost, and recovery. Start with the smallest baseline that makes the state transitions
clear.

## Recall

Name one problem a framework solves and one problem it cannot solve without domain
policy. Why should framework selection follow a working conceptual baseline?

Continue to [implementing an agent without a framework](implement-agent-without-framework.md).
