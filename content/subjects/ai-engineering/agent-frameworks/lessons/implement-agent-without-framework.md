---
id: lesson-ai-agent-without-framework
kind: lesson
topicId: ai-agent-frameworks
title: Implement an Agent Without a Framework
summary: Build the smallest explicit Python controller first so state, tool authorization, budgets, and completion remain visible.
difficulty: medium
status: published
revision: 1
order: 605
tags: [agent-frameworks, python, agents]
prerequisiteIds: [lesson-ai-agent-loop, lesson-ai-agent-tools]
---

## Make the hidden runtime explicit

A framework usually packages a loop, message conversion, tool dispatch, state storage,
callbacks, and sometimes retries. Implementing a small version reveals which policies
are yours:

```python
def run(task, propose, tools, max_steps=5):
    state = {'task': task, 'observations': [], 'receipts': []}
    for step in range(max_steps):
        action = propose(state)
        if action['kind'] == 'finish':
            return validate_answer(action, state)
        if action['name'] not in tools:
            return {'status': 'invalid_tool'}
        result = tools[action['name']](action['args'])
        state['receipts'].append({'step': step, 'action': action, 'result': result})
        state['observations'].append(result)
    return {'status': 'step_limit'}
```

Real code must validate arguments, authorize against trusted identity, distinguish
unknown effects from failures, and make side effects idempotent. The point is not to
ship this toy unchanged; it is to know what a framework must preserve.

## Recall

Which responsibilities should not be delegated to a framework's default agent loop?
Why should receipts be separate from model messages?
