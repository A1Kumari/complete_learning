---
id: lesson-ai-langchain-composition
kind: lesson
topicId: ai-agent-frameworks
title: Compose and Compare a Real LangChain Workflow
summary: Rebuild the plain-Python policy workflow with RunnableLambda and RunnableBranch, preserve its acceptance contract, and distinguish composition from an autonomous agent loop.
difficulty: medium
status: published
revision: 1
order: 610
tags: [agent-frameworks, langchain, runnables, integration]
conceptIds: [concept-langchain-composition]
prerequisiteIds: [lesson-ai-workflow-abstractions]
---

## Wrap small functions behind an invocation interface

LangChain Core's Runnable interface standardizes composition and invocation. A
`RunnableLambda` adapts an ordinary callable. A sequence built with `|` passes one
step's output to the next. `RunnableBranch` routes to the first matching predicate,
with a required default branch. These abstractions are ordinary orchestration;
they do not inherently call a model or decide tool policy.

```text
request → RunnableLambda(validate) → RunnableLambda(retrieve)
        → RunnableBranch(evidence? → answer; otherwise → abstain)
```

Optional local teaching dependencies are recorded in
`scripts/requirements-ai-rag-agents.txt`. From the repository root, install them in
a virtual environment before running this lesson. No frontend package is needed.

```bash
python3 -m venv /tmp/opencode/ai-framework-venv
/tmp/opencode/ai-framework-venv/bin/python -m pip install -r scripts/requirements-ai-rag-agents.txt
```

## Verify the same behavior through actual library objects

```python
import os
os.environ['LANGSMITH_TRACING'] = 'false'
from langchain_core.runnables import RunnableBranch, RunnableLambda

policies = [{'id': 'returns-v2', 'tenant': 'A',
             'text': 'Returns are accepted within 30 days.'}]
def validate(request):
    if set(request) != {'query', 'tenant'} or not all(type(v) is str for v in request.values()):
        raise ValueError('invalid trusted request envelope')
    return dict(request)

def retrieve(state):
    hits = [row for row in policies
            if row['tenant'] == state['tenant'] and 'return' in state['query'].lower()]
    return {**state, 'evidence': hits}

def answer(state):
    row = state['evidence'][0]
    return {'status': 'answered', 'text': row['text'], 'citations': [row['id']]}

def abstain(state):
    return {'status': 'no_evidence', 'text': None, 'citations': []}

def plain(request):
    state = retrieve(validate(request))
    return answer(state) if state['evidence'] else abstain(state)

chain = (RunnableLambda(validate) | RunnableLambda(retrieve) |
         RunnableBranch((lambda state: bool(state['evidence']), RunnableLambda(answer)),
                        RunnableLambda(abstain)))
requests = [{'query': 'return window', 'tenant': 'A'},
            {'query': 'shipping cost', 'tenant': 'A'},
            {'query': 'return window', 'tenant': 'B'}]
results = chain.batch(requests, config={'max_concurrency': 1})
assert results == [plain(request) for request in requests]
assert [row['status'] for row in results] == ['answered', 'no_evidence', 'no_evidence']
print('LangChain matches plain workflow on supported, missing, and wrong-tenant requests')
```

This executes real LangChain Core composition. Data is local, tracing is disabled,
and no model/network call is made. `batch` here processes a list through the runnable
contract; it does not imply that a remote model offers a discounted batch endpoint.
The concurrency limit is explicit to make execution easy to inspect.

## Know when to use the higher-level agent interface

LangChain's `create_agent` wraps a model/tool loop, configured with tools, prompt,
and middleware. That serves a different need from the fixed runnable pipeline
above. To turn a retrieval capability into an agent tool, define its schema,
inject trusted runtime identity outside model arguments, and retain controller
limits. An agent's tool-selection quality must be evaluated with actual model runs;
the deterministic composition test proves no such model behavior.

Do not copy provider/model identifiers from a tutorial as if they were timeless.
Choose a supported provider integration, pin compatible dependencies, configure
credentials outside source, and test schema/stream/error behavior in that version.
This module demonstrates library mechanics offline, while the existing API lessons
cover provider lifecycle details.

## Keep policy outside convenience wrappers

Retries on a runnable can repeat its whole wrapped function. Retrying a pure
retriever differs from retrying a write with an unknown effect. A callback or trace
hook can observe execution but cannot make an external operation atomic. Keep
authorization and idempotency at the tool boundary even when the framework provides
useful wrappers and middleware.

Compare outputs, failure modes, cancellation, and timing with the plain baseline.
Preserving a function's happy-path result does not establish checkpoint durability
or cross-process recovery; those are the next lesson's concerns.

## Recall

What does `|` pass between runnables? Why is the default branch important? Which
new failure modes appear if a model/tool agent replaces this fixed workflow?

## References

- [LangChain Core: RunnableLambda](https://reference.langchain.com/python/langchain-core/runnables/base/RunnableLambda)
- [LangChain Core: RunnableBranch](https://reference.langchain.com/python/langchain-core/runnables/branch/RunnableBranch)
- [LangChain: create_agent and runtime state](https://docs.langchain.com/oss/python/langchain/agents)
