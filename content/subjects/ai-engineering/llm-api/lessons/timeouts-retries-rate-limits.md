---
id: lesson-ai-api-reliability
kind: lesson
topicId: ai-llm-api-integration
title: Timeouts, Retries, Rate Limits, and Error Handling
summary: Design deadline-aware API calls that distinguish safe retries from unknown outcomes and provider throttling.
difficulty: medium
status: published
revision: 1
order: 205
tags: [llm-api, reliability, retries]
prerequisiteIds: [lesson-ai-building-python-llm-client]
---

## Failure is part of the request lifecycle

An API call can fail before the provider receives it, while the provider is working,
after the provider completed but before your client received the response, or because
the response is malformed. A timeout tells you that your client stopped waiting; it
does not prove that no server-side work occurred.

## Retry only with a policy

Retry transient transport errors and documented rate limits with exponential backoff,
jitter, and a total deadline. Do not blindly retry a side-effecting tool request or a
request whose completion is unknown. Use idempotency keys where the provider supports
them, and reconcile unknown outcomes before repeating an effect.

```text
deadline → attempt → response
             ├ transient + budget remains → backoff → retry
             ├ permanent → fail clearly
             └ unknown effect → reconcile, do not duplicate
```

Respect `Retry-After`, bound concurrency, and expose a typed error to the caller.
Record attempts and outcome class for operations, not sensitive prompt contents.

## Recall

Why does a timeout not prove that a tool call is safe to retry? What belongs in a total
retry deadline besides individual request timeouts?
