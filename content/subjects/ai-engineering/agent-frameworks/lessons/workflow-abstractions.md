---
id: lesson-ai-workflow-abstractions
kind: lesson
topicId: ai-agent-frameworks
title: Understand the Workflow Before Choosing a Framework
summary: Implement a small plain-Python evidence workflow and identify which orchestration responsibilities a framework can and cannot own.
difficulty: medium
status: published
revision: 1
order: 600
tags: [agent-frameworks, workflows, orchestration, python]
conceptIds: [concept-workflow-abstractions]
prerequisiteIds: [lesson-ai-agent-recovery, lesson-ai-rag-pipeline]
---

## A framework changes implementation, not the task contract

Start by drawing the state transitions and invariants. What is the input? Which
component chooses the next step? What state persists? What does completion mean?
Where are authorization, budgets, retries, and effects checked? If those answers
are unclear, replacing functions with graph nodes does not clarify them by itself.

```text
trusted request → retrieve eligible policy → evidence present?
                                         ├→ yes: attributed answer → completed
                                         └→ no: explicit no_evidence → completed
```

This is a deterministic workflow with a branch. It is not a model-directed agent
merely because its components might be called “tools” or “nodes.” A model can later
be placed inside a node without gaining control over the whole graph.

## Define the plain-Python baseline

```python
policies = [{'id': 'returns-v2', 'tenant': 'A',
             'text': 'Returns are accepted within 30 days.'}]

def retrieve(state):
    hits = [row for row in policies
            if row['tenant'] == state['tenant'] and 'return' in state['query'].lower()]
    return {**state, 'evidence': hits}

def present(state):
    if not state['evidence']:
        return {'status': 'no_evidence', 'text': None, 'citations': []}
    row = state['evidence'][0]
    return {'status': 'answered', 'text': row['text'], 'citations': [row['id']]}

def workflow(request):
    if set(request) != {'query', 'tenant'} or not all(type(v) is str for v in request.values()):
        raise ValueError('invalid trusted request envelope')
    return present(retrieve(request))

requests = [{'query': 'return window', 'tenant': 'A'},
            {'query': 'shipping cost', 'tenant': 'A'},
            {'query': 'return window', 'tenant': 'B'}]
results = [workflow(request) for request in requests]
assert [row['status'] for row in results] == ['answered', 'no_evidence', 'no_evidence']
assert results[0]['citations'] == ['returns-v2']
print('plain workflow: answered, no_evidence, no_evidence')
```

The trusted envelope assumes authentication happened upstream; validating that
`tenant` is a string does not authenticate it. Retrieval is a tiny substring fixture
and presentation is extractive. These simplifications isolate orchestration from
retrieval quality and model behavior. The next lesson composes this same contract
with actual LangChain runnables.

## Match abstractions to responsibilities

| Approach | Useful abstractions | Still application-owned |
| --- | --- | --- |
| Plain functions | Explicit calls, easy local debugging | All orchestration and persistence choices |
| LangChain | Model/tool interfaces, runnable composition, higher-level agent harness | Domain policy, effect semantics, relevance and completion |
| LangGraph | State, nodes/edges, checkpoints, interrupts | Persistence deployment, state access authorization, replay-safe effects |
| Agent SDK | Model/tool loop, handoffs, sessions, tracing; details vary | Business authorization, durable effect ledger, task acceptance |

These categories overlap. Modern LangChain agents use LangGraph underneath; using
one does not mean you can never use the other. An SDK session storing conversation
history is not necessarily a resumable workflow checkpoint. Inspect the actual
runtime and backend rather than inferring durability from the word “memory.”

## Decide who controls the path

Fixed sequences, routing, and fan-out/fan-in can be code-driven. A model-directed
loop is useful when the required steps cannot be predetermined. Mix the two when
needed: a graph can host an agent node with a strict budget and return to a fixed
validation step. More agents add delegation and result-merging contracts, not
automatic independence or quality.

Evaluate the simplest baseline first. A short request-response function may not
need a durable workflow engine. Long-running jobs with human pauses, failures,
and resumable work may justify one. Compare task outcomes, debug effort, deployment
burden, and recovery behavior—not only a framework's initial line count.

## Recall

Which part of this example is routing? What extra behavior would make the model
control the next tool? Name one capability a graph runtime provides and one
business invariant it cannot infer for you.

## References

- [Anthropic: simple workflows versus autonomous agents](https://www.anthropic.com/engineering/building-effective-agents)
- [LangChain: agents and the harness](https://docs.langchain.com/oss/python/langchain/agents)
- [OpenAI Agents SDK: primitives and direct-API trade-offs](https://openai.github.io/openai-agents-python/)
