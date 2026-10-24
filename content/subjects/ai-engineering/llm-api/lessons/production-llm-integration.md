---
id: lesson-ai-production-llm-integration
kind: lesson
topicId: ai-llm-api-integration
title: "Production LLM Integration: Cost, Logging, Caching, and Testing"
summary: Operate model API calls with bounded retries, safe telemetry, cache keys, budget controls, and deterministic tests.
difficulty: medium
status: published
revision: 1
order: 215
tags: [llm-api, production, cost, testing]
prerequisiteIds: [lesson-ai-api-streaming, lesson-ai-api-tool-calling]
---

## Observe without leaking

Log request IDs, model version, latency, status, token usage, retry count, and a safe
trace reference. Redact secrets, personal data, and sensitive prompt content by
default. A useful trace lets you reproduce configuration without becoming a copy of
the customer's private conversation.

## Cost and caching

Budget input and output tokens, choose models by measured task quality, and cache only
when the key includes model, prompt/template version, relevant context, identity scope,
and freshness. Never reuse one tenant's answer for another because the question text
matches.

## Testing the boundary

Use fake transports for timeout, provider error, malformed JSON, tool-call, and partial
stream cases. Use a small live smoke test separately. Contract tests should assert
that retries respect a deadline and that a response is not accepted until semantic
validation succeeds.

## Recall

What must be in a safe cache key? Why should a provider timeout test not require a live
provider call?
