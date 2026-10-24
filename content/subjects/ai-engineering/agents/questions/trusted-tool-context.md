---
id: ai-agent-trusted-tool-context
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-tools
prompt: A tool request includes a schema-valid policy ID and a model-selected tenant ID. Why is that insufficient for authorized retrieval?
difficulty: medium
status: published
revision: 1
order: 1120
tags: [agents, tools, authorization]
conceptIds: [concept-agent-tools]
followUps:
  - What fields should come from authenticated runtime context?
  - Why might an inaccessible ID and a nonexistent ID share an external error status?
misconception: Correct argument shape does not authenticate the caller or establish resource ownership.
---

## Answer

The model-controlled tenant is not trusted identity. Bind the executor to the
authenticated server-side caller and independently check ownership/access of the
requested policy. Validate the tool name, argument types, and current business
conditions as separate requirements.

### Supporting reasoning

A strict schema can still express an unauthorized resource request. Omitting
identity from model arguments reduces impersonation opportunities, while generic
unavailable responses can avoid unnecessary resource-existence disclosure.

### Evaluation rubric

One point each: schema-versus-authorization distinction; trusted context; resource
access lookup; additional boundary or disclosure consideration.
