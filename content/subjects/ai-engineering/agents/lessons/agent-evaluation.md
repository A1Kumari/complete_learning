---
id: lesson-ai-agent-evaluation
kind: lesson
topicId: ai-agents
title: Agent Reliability and Task Evaluation
summary: Evaluate agent task success, tool correctness, recovery, safety, and cost with traces rather than judging the final prose alone.
difficulty: hard
status: published
revision: 1
order: 600
tags: [agents, evaluation, reliability]
prerequisiteIds: [lesson-ai-agent-recovery, lesson-ai-agent-approval]
---

## Success is more than a final answer

Record whether the requested task was completed, whether every tool call was allowed
and correctly parameterized, whether side effects happened once, whether evidence was
supported, and how much time, money, and model work were used. A polished answer can
hide a failed write or an unauthorized read.

## Build scenario traces

Include normal tasks, ambiguous inputs, tool errors, timeouts after side effects,
stale approvals, repeated actions, unavailable tools, and no-permission cases. Assert
state transitions and receipts, not just text similarity. Human review remains useful
for high-impact decisions and for calibrating automated graders.

## Operational loop

Sample traces in production, cluster failure causes, add the scenario to a regression
set, and compare the new policy or model against the old one. Keep privacy boundaries
in the trace store.

## Recall

Why can final-answer accuracy overestimate agent reliability? Name two trace fields that
help diagnose a duplicate side effect.
