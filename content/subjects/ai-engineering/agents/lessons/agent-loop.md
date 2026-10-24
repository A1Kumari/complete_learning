---
id: lesson-ai-agent-loop
kind: lesson
topicId: ai-agents
title: Build a Bounded Observe–Plan–Act Loop
summary: Distinguish model-directed agents from fixed workflows, trace tool observations through explicit state, and stop repeated or exhausted runs.
difficulty: medium
status: published
revision: 1
order: 560
tags: [agents, planning, state-machine, tools]
conceptIds: [concept-agent-loop]
prerequisiteIds: [lesson-ai-api-tool-calling, lesson-ai-rag-pipeline]
---

## An agent chooses its next step from observations

A fixed workflow executes predefined paths, such as retrieve → summarize → validate.
An agent lets a model propose the next action using the task, available tools, and
previous observations. The application executes permitted actions and feeds results
back. Terminology varies, but this distinction exposes where control actually lies.

```text
task + working state → model proposal → validate + authorize → tool execution
          ↑                                                    ↓
          └──────────────── observation + state update ─────────┘
                   final answer / pause / failure / budget stop
```

A generated plan is a proposal about future work, not proof that it happened.
Store intended steps separately from completed actions and tool receipts. A useful
plan can be revised after an observation disproves an assumption; it must not grant
new permissions or remove execution limits.

## Implement the controller independently of the model

The scripted planner below stands in for model output. It makes control flow
deterministic so the example can test successful completion and repetitive behavior
without a provider call. The read tool is local and has no side effects.

```python
def run(planner, max_steps=3):
    state = {'observations': [], 'trace': []}
    seen = set()
    for _ in range(max_steps):
        proposal = planner(state)
        if proposal.get('kind') == 'finish':
            if not state['observations']:
                return 'unsupported_finish', state
            return 'completed', state
        if proposal != {'kind': 'tool', 'name': 'read_policy', 'args': {}}:
            return 'invalid_proposal', state
        signature = ('read_policy', ())
        if signature in seen:
            return 'repeated_action', state
        seen.add(signature)
        state['trace'].append('read_policy')
        state['observations'].append({'source_id': 'returns-v2', 'days': 30})
    return 'step_limit', state

def planner(state):
    if state['observations']:
        return {'kind': 'finish'}
    return {'kind': 'tool', 'name': 'read_policy', 'args': {}}

status, state = run(planner)
assert status == 'completed' and state['trace'] == ['read_policy']
repeat = lambda state: {'kind': 'tool', 'name': 'read_policy', 'args': {}}
assert run(repeat)[0] == 'repeated_action'
assert run(planner, max_steps=1)[0] == 'step_limit'
assert run(lambda state: {'kind': 'tool', 'name': 'delete_policy', 'args': {}})[0] == 'invalid_proposal'
assert run(lambda state: {'kind': 'finish'})[0] == 'unsupported_finish'
print('read then finish; repeats, unknown tools, unsupported finish, and step exhaustion stop')
```

Here steps count planner turns, including the final proposal. With a one-turn
budget, a successful read still leaves no turn to finish; the status must say
`step_limit`, not success. The evidence-presence check is only a toy completion
condition; real completion needs task-specific validation and claim support.

## Bound more than one dimension

Enforce maximum model turns, tool calls, elapsed time, tokens/cost, parallel work,
and output sizes. A tool timeout does not guarantee its operation was cancelled.
A controller's cancellation signal must propagate to ongoing operations where
supported, and unresolved effects need reconciliation before retrying.

Repeated-action detection can compare normalized tool arguments and observation
versions. Identical reads may be reasonable after an external update, so define
when repetition is useful instead of permanently banning the same tool name. A
no-progress detector complements, but does not replace, hard budgets.

## Choose autonomy where it pays

A policy FAQ may need only two-step RAG. A task requiring discovery across several
systems can benefit from choosing which source to query next. More autonomous
steps add latency, cost, and opportunities for compounding mistakes. Compare task
success and operating cost against a fixed workflow on representative scenarios.

Planning, tool execution, and answer generation can share a model or use different
components; architectural separation does not require multiple agents. Multi-agent
delegation adds coordination state and must inherit bounded budgets and scoped
access. It does not automatically improve correctness.

## Recall and application

Which part of the loop is allowed to execute a tool? Why is a model saying “done”
not sufficient completion evidence? Sketch a run where a read succeeds but a
deadline expires before the final answer is generated.

## References

- [Anthropic: workflows, agents, tools, and stopping conditions](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK: runtime and orchestration primitives](https://openai.github.io/openai-agents-python/)
