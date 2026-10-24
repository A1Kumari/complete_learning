---
id: ai-mcp-approval-boundary
kind: question
topicId: ai-mcp-tools
lessonId: lesson-ai-mcp-tool-design
prompt: How should an MCP integration handle a tool that sends an external message?
difficulty: medium
status: published
revision: 1
order: 410
tags: [mcp, approvals, side-effects]
followUps:
  - What must an approval be bound to?
  - Why is a model's claim that an email was sent insufficient evidence?
misconception: A model-generated request is equivalent to user approval.
---

## Answer

Separate preview from commit. Show the exact recipient, content, and side effect,
obtain explicit approval when policy requires it, then commit through an authorized
service with an operation ID. Report success only after the service confirms the
side effect.

### Evaluation rubric

One point each: preview/commit separation; specific approval; authorized execution;
evidence-based success reporting.
