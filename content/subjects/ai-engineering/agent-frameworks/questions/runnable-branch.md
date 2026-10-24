---
id: ai-framework-runnable-branch
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-langchain-composition
prompt: What do RunnableLambda, a pipe-composed sequence, and RunnableBranch contribute to the policy workflow, and what behavior do they not establish?
difficulty: medium
status: published
revision: 1
order: 1200
tags: [agent-frameworks, langchain, runnables]
conceptIds: [concept-langchain-composition]
followUps:
  - What receives one step's output in a runnable sequence?
  - Why test supported, absent-evidence, and wrong-tenant requests against the plain version?
misconception: Runnable composition does not inherently call an LLM, establish autonomy, or provide durable recovery.
---

## Answer

RunnableLambda wraps a callable, the pipe sequence passes each output into the next
step, and RunnableBranch chooses the first matching predicate with a default path.
They standardize orchestration and invocation but do not prove model tool-selection
quality, authorization, or checkpoint durability.

### Supporting reasoning

The offline lesson executes real library objects on deterministic local data.
Comparison with the plain workflow tests the declared input/output behavior without
pretending to measure a model or a remote batch API.

### Evaluation rubric

One point each: lambda role; sequence data flow; branch/default role;
clear limitation of the demonstrated behavior.
