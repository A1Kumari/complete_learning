---
id: lesson-ai-context-memory
kind: lesson
topicId: ai-context-engineering
title: Conversation Memory, Summaries, and Compaction
summary: Distinguish history from durable memory and caches, preserve corrections and provenance, and evaluate what summaries lose across long conversations.
difficulty: medium
status: published
revision: 1
order: 280
tags: [context-engineering, memory, summarization, python]
conceptIds: [concept-context-memory]
prerequisiteIds: [lesson-ai-context-selection, lesson-ai-context-packing]
---

## Four different kinds of state

**Request history** is the messages/items replayed into this model call.
**Persistent memory** is information stored outside the call and selected later.
**A summary** is a derived, lossy representation of some history. **A KV cache**
stores computational activations for efficient inference. None should be confused
with automatically retraining the model from a conversation.

A provider-managed conversation or previous-response reference can simplify state
transfer, but it does not eliminate context limits, retention considerations, or
the application's responsibility to choose appropriate data. Inspect current API
semantics rather than assuming every instruction or parameter is inherited.

```text
history → extract facts / decisions / open tasks → provenance-bearing memory
   ↓ compact less important detail                          ↓ select and recheck
summary + recent complete turns + current request → assembled model input
```

## A correction is not an additional permanent fact

Turn 1: “Send the quote to office A.” Turn 7: “Actually, use office B.” Appending
both to a summary without a resolution policy leaves contradictory state. Keep
explicit keys, sources, timestamps/sequence numbers, scope, and status. Mark old
facts superseded rather than letting a later retrieval choose arbitrarily.

Not every last-mentioned claim wins. A user correction to their preferred language
may supersede their earlier preference; a retrieved page cannot override an
application security rule. The next example deliberately handles only same-user,
same-key preference events, not arbitrary authority resolution.

```python
def current_preferences(events, user, now):
    state = {}
    for event in sorted(events, key=lambda e: e['sequence']):
        if event['user'] != user:
            continue
        if event['kind'] == 'delete':
            state.pop(event['key'], None)
        else:
            state[event['key']] = event
    # Expiring a new preference does not resurrect the older superseded value.
    return {key: event for key, event in state.items()
            if event['expires'] > now}

events = [
    {'sequence': 1, 'kind': 'set', 'user': 'u1', 'key': 'language', 'value': 'es', 'expires': 100},
    {'sequence': 2, 'kind': 'set', 'user': 'u1', 'key': 'language', 'value': 'en', 'expires': 20},
    {'sequence': 3, 'kind': 'set', 'user': 'u2', 'key': 'language', 'value': 'fr', 'expires': 100},
]
assert current_preferences(events, 'u1', 10)['language']['value'] == 'en'
assert current_preferences(events, 'u1', 30) == {}
deleted = events + [dict(sequence=4, kind='delete', user='u1', key='language')]
assert current_preferences(deleted, 'u1', 10) == {}
print('latest preference en; expiry does not revive es; deletion respected')
```

The ordering is important. If expired events were filtered before resolving
supersession, the old Spanish preference could incorrectly reappear. Real memory
systems need immutable provenance/audit records, current authorization, deletion
propagation, and isolation between users/tenants. A generated summary should not
grant itself access to another user's memory.

## What compaction should preserve

Preserve the active objective, unresolved questions, important constraints, decisions
and their reasons, exact IDs needed for action, completed-versus-pending status,
and references to supporting sources. Discard redundant raw outputs only when
their needed information is safely retained or can be fetched again. A summary
that says “payment arranged” must not blur “user requested payment” with “payment
service confirmed operation 42.”

Progressive disclosure keeps lightweight source IDs and loads details when needed.
That trades extra retrieval/tool latency for fewer irrelevant tokens. Summaries
should keep provenance so the application can reload exact evidence when an
important detail is uncertain. The summary is not a higher-authority instruction
channel just because the application generated it.

## Evaluate memory rather than assuming continuity

Create long traces containing corrections, cancelled tasks, repeated identifiers,
privacy-boundary changes, and explicit deletions. Compare answers/actions before
and after compaction. Test facts that become relevant only later, not only those
the summarizer knew were important at the time. Measure stale-state errors and
cross-user retrieval, not just summary length reduction.

The newest user request can change the task. “Continue drafting” and “cancel the
draft and explain the policy” require different state selection. A persisted note
must not force continuation after cancellation. Application-owned workflow state
is preferable to inferring completed actions from prose.

## Active recall

Why does filtering expired events before resolving corrections revive stale data?
Which of history, memory, summary, and cache changes learned model weights by
default? Design one compaction test for a cancelled side effect and explain which
source record establishes whether it actually executed.

## Verified references

- [OpenAI: manual replay and persisted conversation state](https://developers.openai.com/api/docs/guides/conversation-state)
- [Anthropic: compaction and structured note-taking](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
