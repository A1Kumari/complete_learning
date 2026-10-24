---
id: lesson-ai-mcp-tool-design
kind: lesson
topicId: ai-mcp-tools
title: Designing Safe MCP Tools and Integrations
summary: Design narrow tool contracts with explicit authorization, error semantics, approvals, and observable execution.
difficulty: medium
status: published
revision: 1
order: 200
tags: [mcp, tool-design, schemas, reliability]
---

## Prefer narrow capabilities

A good tool represents one meaningful operation, not a general-purpose shell. Its
name and description should say what it does, what it can access, and what it cannot
do. Use a strict JSON Schema with bounded strings, enumerated values, required
fields, and `additionalProperties: false` where supported.

```json
{
  "name": "create_calendar_draft",
  "description": "Create a draft event; never sends invitations.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": {"type": "string", "maxLength": 120},
      "start": {"type": "string", "format": "date-time"}
    },
    "required": ["title", "start"],
    "additionalProperties": false
  }
}
```

Schema validation prevents malformed input; it does not establish identity or
business permission. Resolve tenant, user, and resource ownership from trusted
application context. Never accept an authorization identity supplied only by the
model.

## Separate preview, approval, and commit

Read-only tools can often run automatically within a bounded policy. Destructive or
externally visible operations should return a preview, require an explicit approval
when appropriate, and commit through a durable service boundary. Keep the approval
specific to the operation and arguments so a changed model proposal cannot reuse it.

```text
model proposal → schema validation → policy check → preview
                                            ↓ approval
                                  idempotent commit → result
```

Return structured errors such as `invalid_arguments`, `not_authorized`,
`needs_approval`, or `upstream_timeout`. Do not turn a failed tool call into a
successful natural-language claim.

## Operate the boundary

Log the request ID, server identity, tool name, policy decision, duration, and
result class without logging secrets or unrestricted personal data. Add deadlines,
cancellation, output limits, retry rules, and circuit breaking. Test duplicate
requests, stale approvals, malicious descriptions, partial network failures, and
server version changes.

MCP improves interoperability. It does not make an integration safe by itself. The
host still owns model-facing policy, and the server still owns resource-level
authorization.

## Recall

Why should a calendar tool create a draft instead of sending immediately? Which
identity should be resolved outside the model? List three operational limits that
keep an unresponsive MCP server from blocking the user request.
