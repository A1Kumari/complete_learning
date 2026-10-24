---
id: lesson-ai-mcp-architecture
kind: lesson
topicId: ai-mcp-tools
title: MCP Architecture, Discovery, and Trust Boundaries
summary: Understand hosts, clients, servers, capabilities, and why protocol discovery never replaces application authorization.
difficulty: medium
status: published
revision: 1
order: 100
tags: [mcp, tools, protocols, authorization]
---

## What MCP standardizes

The Model Context Protocol (MCP) is a protocol boundary between an AI application
and external capability providers. A host application owns the user session and
creates an MCP client connection to an MCP server. The server exposes capabilities
such as tools, resources, and prompts.

```text
user → host application → MCP client → transport → MCP server → external system
```

The protocol gives the client a discoverable vocabulary: tool names, descriptions,
input schemas, resources, and server capabilities. It does not decide whether a
particular user may read a customer record or send an email. That decision remains
in the host and the server's authorization boundary.

## Discovery is data, not authority

A safe connection starts with an initialization handshake and capability negotiation.
The client lists available tools, validates the returned schema, and presents only
an allowlisted subset to the model. Tool descriptions and resource contents are
untrusted data. They can contain misleading instructions, so they must not silently
change developer policy, credentials, or permission checks.

```python
server_tools = await client.list_tools()
allowed = {
    tool.name: tool for tool in server_tools
    if tool.name in {'search_docs', 'get_ticket'}
}

if not allowed:
    raise RuntimeError('no approved tools available')
```

The host should validate names, argument schemas, result sizes, timeouts, and
audience before exposing a tool. A model proposal still needs application-side
validation and authorization before the MCP client sends a call.

## Transport and lifecycle choices

Transport affects deployment and trust. A local process transport can be useful for
development but inherits the local process identity and filesystem environment. A
remote HTTP-based transport needs authentication, origin controls, TLS, request
timeouts, cancellation, and clear tenant context. Reconnect behavior must not turn a
previously approved capability into permanent authorization.

Treat each call as a bounded operation. Correlate the request and result, cap output
size, record the server identity and tool version, and surface structured errors.
For writes, use an application operation ID and idempotency handling; a protocol
request ID is not automatically a business deduplication key.

## Recall

Draw the host/client/server boundary. Which side owns the user session? Why is a
discovered tool description untrusted? What additional checks are required before a
model-generated call can modify an external system?

## Verified references

- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/latest)
- [Model Context Protocol architecture](https://modelcontextprotocol.io/docs/learn/architecture)
