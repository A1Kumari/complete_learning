---
id: lesson-ai-building-python-llm-client
kind: lesson
topicId: ai-llm-api-integration
title: Build a Basic Python LLM Client
summary: Wrap a provider request in a small typed boundary with configuration, response checks, and testable behavior.
difficulty: easy
status: published
revision: 1
order: 185
tags: [llm-api, python, clients]
prerequisiteIds: [lesson-ai-model-api-lifecycle]
---

## Keep provider details at the boundary

The application owns the user request, authorization, prompt policy, timeout, and
acceptance rules. The provider owns model execution, tokenization, scheduling, and
provider-side limits. A client adapter translates between those contracts.

```python
class ModelClient:
    def __init__(self, transport, model, timeout_seconds=20):
        self.transport = transport
        self.model = model
        self.timeout_seconds = timeout_seconds

    def complete(self, messages):
        response = self.transport.post('/chat', {
            'model': self.model, 'messages': messages
        }, timeout=self.timeout_seconds)
        if response.status != 200 or 'output' not in response.json:
            raise RuntimeError('invalid model response')
        return response.json
```

Use dependency injection so tests can provide a deterministic fake transport. Never
hard-code keys or let arbitrary user input become a high-authority system instruction.
Validate response shape before using text, usage, or tool calls.

## Recall

Which responsibilities belong to the client rather than the provider? Why does a fake
transport make API behavior easier to test?
