---
id: ai-mcp-tool-contract
kind: question
topicId: ai-mcp-tools
lessonId: lesson-ai-mcp-tool-design
prompt: What makes an MCP tool contract safe and useful for an AI application?
difficulty: medium
status: published
revision: 1
order: 210
tags: [mcp, schemas, tool-design]
followUps:
  - Why is JSON Schema validation not enough for authorization?
  - When should a tool require approval?
misconception: A valid schema does not prove the operation is allowed.
---

## Answer

Use a narrow, descriptive operation with a strict bounded schema, explicit result and
error semantics, and clear side-effect behavior. Validate the request, enforce
authorization from trusted context, require approval for risky writes, and execute
with deadlines, output limits, idempotency, and observability.

### Evaluation rubric

One point each: narrow capability; strict schema; independent authorization;
approval and operational limits.
