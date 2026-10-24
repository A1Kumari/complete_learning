---
id: lesson-ai-langgraph-execution
kind: lesson
topicId: ai-agent-frameworks
title: LangGraph State, Checkpoints, and Approval Interrupts
summary: Run a real state graph with conditional edges and a resumable approval pause, observe node replay, and distinguish in-memory checkpoints from durable production storage.
difficulty: hard
status: published
revision: 1
order: 620
tags: [agent-frameworks, langgraph, checkpoints, interrupts]
conceptIds: [concept-langgraph-execution]
prerequisiteIds: [lesson-ai-langchain-composition, lesson-ai-agent-approval]
---

## Model the workflow as state updates and edges

LangGraph's `StateGraph` defines nodes that read state and return updates. Edges
select execution paths; conditional edges route based on the current state.
Reducers determine how concurrent updates merge where configured. A `TypedDict`
describes expected fields for development, but is not by itself strict runtime
input validation or an authorization system.

```text
START → retrieve → evidence?
                     ├→ no: abstain → END
                     └→ yes: review [interrupt/checkpoint]
                                 → approved: present → END
                                 → rejected: declined → END
```

This extends the same policy workflow with a demonstrative review-before-publication
step. It is not a requirement that ordinary RAG answers always need human approval.

## Pause and resume the actual graph

Install the optional requirements from the preceding lesson. The code uses the
default `invoke` API, whose pause result contains `__interrupt__` in the tested version.

```python
import os
os.environ['LANGSMITH_TRACING'] = 'false'
from typing import TypedDict
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

class State(TypedDict, total=False):
    query: str
    tenant: str
    evidence: list[dict]
    approved: bool
    result: dict

review_runs = []
def retrieve(state):
    hits = ([{'id': 'returns-v2', 'text': 'Returns are accepted within 30 days.'}]
            if state['tenant'] == 'A' and 'return' in state['query'].lower() else [])
    return {'evidence': hits}

def review(state):
    review_runs.append('entered')  # Instrumentation: deliberately shows node replay.
    decision = interrupt({'source_id': state['evidence'][0]['id'], 'action': 'publish'})
    return {'approved': decision is True}

def present(state):
    row = state['evidence'][0]
    return {'result': {'status': 'answered', 'text': row['text'], 'citations': [row['id']]}}

def abstain(state):
    return {'result': {'status': 'no_evidence', 'text': None, 'citations': []}}

def decline(state):
    return {'result': {'status': 'declined', 'text': None, 'citations': []}}

builder = StateGraph(State)
for name, function in [('retrieve', retrieve), ('review', review), ('present', present),
                       ('abstain', abstain), ('decline', decline)]:
    builder.add_node(name, function)
builder.add_edge(START, 'retrieve')
builder.add_conditional_edges('retrieve', lambda s: 'review' if s['evidence'] else 'abstain')
builder.add_conditional_edges('review', lambda s: 'present' if s['approved'] else 'decline')
for name in ['present', 'abstain', 'decline']:
    builder.add_edge(name, END)
graph = builder.compile(checkpointer=InMemorySaver())
request = {'query': 'return window', 'tenant': 'A'}
config = {'configurable': {'thread_id': 'review-A-1'}}
paused = graph.invoke(request, config)
assert paused['__interrupt__'] and 'result' not in paused
resumed = graph.invoke(Command(resume=True), config)
assert resumed['result']['citations'] == ['returns-v2']
assert len(review_runs) == 2  # Code before interrupt ran initially and on resume.
rejected_config = {'configurable': {'thread_id': 'review-A-2'}}
graph.invoke(request, rejected_config)
assert graph.invoke(Command(resume=False), rejected_config)['result']['status'] == 'declined'
missing = graph.invoke({'query': 'shipping', 'tenant': 'A'},
                       {'configurable': {'thread_id': 'review-A-3'}})
assert missing['result']['status'] == 'no_evidence' and not missing.get('__interrupt__')
print('LangGraph pauses, resumes, rejects, and abstains; review node replays on resume')
```

The review node restarts from its beginning when resumed. The first `interrupt`
gets the saved resume value and execution continues. Therefore the instrumentation
list receives two entries. Do not put a non-idempotent charge or notification
before that call. Keep interrupt order stable and avoid swallowing the runtime's
interrupt signal in a broad exception handler.

## A thread identifier is not an access credential

Reuse the same thread ID to resume the intended checkpoint. Authorize the caller's
access to that thread independently, and bind the review decision to the actual
proposal as taught in the approval lesson. A hard-coded `decision is True` in a
local example does not establish reviewer identity or approval freshness.

`InMemorySaver` stores checkpoints in RAM and loses them on process restart. Use an
appropriate persistent checkpointer for cross-process recovery, with schema/version
compatibility, retention, and operational management. A durable store is only one
part of the guarantee; test the deployed failure and replay behavior too.

## Checkpoints do not make side effects exactly once

The runtime can restore graph state without undoing already committed external
effects. Use stable operation IDs and reconcile receipts at the effect service.
Moving a write into its own node improves observability but does not eliminate
the crash window after effect commit and before checkpoint persistence.

Keep ordinary conversation continuation separate from resuming an interrupt:
`Command(resume=...)` supplies a pending decision, while new conversation turns
are normal input state updates. Test rejection, duplicate resume, changed resource
versions, unavailable storage, and unauthorized thread access at application level.

## Recall

Which lines rerun after resume? Why does the example need a checkpointer and a
thread ID? What additional infrastructure would make a restart-survival claim true?

## References

- [LangGraph: interrupt and resume semantics](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [LangGraph: checkpointers versus cross-thread stores](https://docs.langchain.com/oss/python/langgraph/persistence)
