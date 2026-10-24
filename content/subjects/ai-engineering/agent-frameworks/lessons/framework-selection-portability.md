---
id: lesson-ai-framework-portability
kind: lesson
topicId: ai-agent-frameworks
title: Agent SDKs, Portability, and Framework Selection
summary: Compare agent SDK primitives with workflow runtimes, define an application-owned result contract, and test adapters without confusing normalized events with provider wire formats.
difficulty: hard
status: published
revision: 1
order: 630
tags: [agent-frameworks, agent-sdk, portability, evaluation]
conceptIds: [concept-framework-portability]
prerequisiteIds: [lesson-ai-langgraph-execution]
---

## Compare operational contracts, not only API syntax

An agent SDK may provide instructions/tools, a model/tool loop, handoffs, sessions,
and tracing. For example, the OpenAI Agents SDK exposes Agent/Runner abstractions,
agents-as-tools, handoffs, and session facilities. A handoff transfers control to
another configured agent; invoking an agent as a tool commonly keeps the caller as
the orchestrator. Neither automatically establishes a new trust boundary.

LangChain offers higher-level model/tool composition and agent harnesses. LangGraph
provides explicit state transitions and resumable execution machinery. Plain Python
can implement a short bounded loop with fewer dependencies. These are overlapping
choices; select the needed capabilities and understand which backend implements them.

| Need | Questions to ask |
| --- | --- |
| Long-lived approvals | What is persisted, who may resume, and where does replay start? |
| Multiple model providers | Which tool/schema/streaming semantics differ despite a common interface? |
| Concurrent tool writes | Where are ordering, idempotency, cancellation, and resource versions enforced? |
| Memory | Is it conversation history, a checkpoint, an application store, or a workspace? |
| Observability | Which spans/events exist, what data is exported, and can traces be replayed locally? |
| Deployment and upgrades | What workers, database, migrations, and version compatibility are required? |

## Own a small result contract outside the framework

```text
provider or framework result → adapter → application result / event contract
                                     → domain acceptance + persistence
framework migration → replay fixtures → compare outcomes and effect counts
```

The fixture formats below are deliberately invented adapters, **not** LangChain,
LangGraph, or OpenAI wire event names. They demonstrate why an application should
normalize terminal status explicitly instead of assuming any final-looking text
means success.

```python
def normalize_sequence(events):
    receipts, result = [], None
    terminal = False
    for event in events:
        if terminal:
            raise ValueError('event after terminal outcome')
        if event['type'] == 'receipt':
            if event['id'] not in receipts:
                receipts.append(event['id'])
        elif event['type'] == 'answer':
            result = event['text']
        elif event['type'] == 'complete':
            terminal = True
        else:
            raise ValueError('unknown fixture event')
    return {'status': 'completed' if terminal and result is not None else 'incomplete',
            'text': result, 'receipt_ids': receipts}

def normalize_snapshot(snapshot):
    return {'status': 'completed' if snapshot['done'] and snapshot['answer'] is not None
            else 'incomplete', 'text': snapshot['answer'],
            'receipt_ids': list(dict.fromkeys(snapshot['receipts']))}

events = [{'type': 'receipt', 'id': 'read-1'},
          {'type': 'answer', 'text': '30 days [returns-v2]'},
          {'type': 'complete'}]
snapshot = {'done': True, 'answer': '30 days [returns-v2]', 'receipts': ['read-1']}
assert normalize_sequence(events) == normalize_snapshot(snapshot)
assert normalize_sequence(events[:-1])['status'] == 'incomplete'
duplicate = [events[0], events[0], *events[1:]]
assert normalize_sequence(duplicate)['receipt_ids'] == ['read-1']
print('two fixture adapters agree; truncated output stays incomplete; duplicate receipt IDs dedupe')
```

This checks normalization, not factual grounding or exactly-once execution.
Deduplicating receipt IDs in a result cannot undo two actual refunds. Real adapters
must map documented success, failure, refusal, cancellation, handoff, tool-call, and
partial-stream semantics from the specific SDK version. Preserve raw diagnostic
references when useful so normalization does not hide important error distinctions.

## Portability needs behavioral fixtures

Keep domain schemas, authorization, source identity, operation IDs, acceptance
rules, and budgets application-owned. Put framework-specific messages, graph
configuration, and provider envelopes behind adapters. A common Python method name
does not make provider tool behavior or stored checkpoints interchangeable.

Before a migration, compare successful tasks, no-evidence answers, invalid tool
proposals, approval rejection, restart replay, timeouts after writes, and duplicate
events. Check effects and permission enforcement as well as final prose. Pin
dependencies, review release changes, and migrate persisted state explicitly.

## A framework is not a tool protocol

MCP standardizes aspects of client/server tool and resource interaction. A framework
orchestrates application execution. A model API transports model requests and
responses. These layers can integrate, but protocol interoperability does not
supply your tenant authorization, action approval, or durable workflow semantics.
Detailed MCP interfaces belong to the separate MCP & Tool Protocols topic.

Choose a framework by evidence from the task: quality, latency, recovery behavior,
development/debug effort, deployment cost, and team familiarity. Retain a clear
plain-Python baseline so abstraction costs and benefits remain measurable.

## Recall

Why can two agents with identical final text have different correctness outcomes?
What is the difference between a handoff and an agent-as-tool call? Which persisted
state would make replacing a framework harder than changing a model API adapter?

## References

- [OpenAI Agents SDK: agents, runners, sessions, handoffs, and tracing](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK: agent orchestration patterns](https://openai.github.io/openai-agents-python/multi_agent/)
- [LangGraph: persistence boundaries](https://docs.langchain.com/oss/python/langgraph/persistence)
