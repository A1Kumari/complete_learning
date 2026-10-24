---
id: ai-framework-sdk-handoff-protocol
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-framework-portability
prompt: How do an agent-as-tool call, a handoff, and a tool protocol such as MCP differ?
difficulty: medium
status: published
revision: 1
order: 1240
tags: [agent-frameworks, agent-sdk, orchestration]
conceptIds: [concept-framework-portability]
followUps:
  - Which application policies should survive a handoff?
  - Does protocol interoperability imply durable workflow execution?
misconception: Delegation, protocol communication, authorization, and durable orchestration are separate concerns.
---

## Answer

An agent-as-tool call typically returns a specialist's result to the caller as
orchestrator. A handoff transfers conversational/control responsibility to another
configured agent. MCP standardizes parts of tool/resource client-server interaction;
it does not itself define the application's complete execution workflow.

### Supporting reasoning

Neither delegation mechanism automatically grants new permissions. Identity,
budgets, tool access, and acceptance rules still need defined propagation. A protocol
connection is not a checkpoint, approval, or effect ledger.

### Evaluation rubric

One point each: agent-as-tool role; handoff role; protocol role; retained
application responsibility or durability distinction.
