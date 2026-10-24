---
id: ai-agent-document-tool-injection
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-tools
prompt: A page returned by a browsing tool tells a read-only agent to call write_policy. What should prevent the write even if the planner follows that instruction?
difficulty: hard
status: published
revision: 1
order: 1130
tags: [agents, tool-boundaries, observations]
conceptIds: [concept-agent-tools]
followUps:
  - What is the authority of tool output compared with application policy?
  - Why are an allowlisted tool name and narrow capability useful?
misconception: Retrieved content can supply evidence but cannot grant execution permissions.
---

## Answer

The executor must enforce the read-only capability and reject the unavailable or
unauthorized write independently of the model's proposal. Retrieved page text is
untrusted data, so it cannot modify the tool allowlist, trusted identity, or policy.

### Supporting reasoning

Prompt instructions help communicate the boundary, but enforcement belongs at
dispatch and the resource/service authorization layer. Trace the rejected proposal
without treating denial as a reason to retry alternate write paths.

### Evaluation rubric

One point each: executor enforcement; source-data authority distinction;
capability/authorization mechanism; non-bypass behavior after denial.
