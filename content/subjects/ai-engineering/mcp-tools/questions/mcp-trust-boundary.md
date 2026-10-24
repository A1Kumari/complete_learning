---
id: ai-mcp-trust-boundary
kind: question
topicId: ai-mcp-tools
lessonId: lesson-ai-mcp-architecture
prompt: Does MCP tool discovery grant the model permission to call every discovered tool?
difficulty: medium
status: published
revision: 1
order: 110
tags: [mcp, authorization, trust-boundaries]
followUps:
  - Which component owns the user's identity and permissions?
  - Why must tool descriptions be treated as untrusted input?
misconception: A discovered capability is not an authorization grant.
---

## Answer

No. Discovery tells the host what a server offers. The host must allowlist the
capability, validate arguments, and authorize the operation using trusted user and
tenant context. The server must enforce resource-level authorization again.

### Evaluation rubric

One point each: discovery versus permission; host-side policy; server-side
authorization; untrusted tool metadata.
