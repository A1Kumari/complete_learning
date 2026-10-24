---
id: ai-token-contextual-states
kind: question
topicId: ai-tokenization-embeddings
lessonId: lesson-ai-token-representations
prompt: Why can two occurrences of the same token have different contextual representations?
difficulty: medium
status: published
revision: 1
order: 260
tags: [embeddings, context]
followUps:
  - How does a causal mask limit available context?
  - Are token table rows interchangeable with retrieval embeddings?
misconception: A lookup vector, contextual hidden state, and whole-text embedding are different objects.
---

## Answer

They may start from the same embedding row, but contextual layers incorporate
permitted neighboring information and positional structure. Thus “bank” in a river
context can produce a different state from “bank” in an account context.

### Supporting reasoning

A causal state cannot read future positions; a bidirectional encoder may. Retrieval
quality additionally depends on pooling, objective, normalization, and model version.
Equal vector dimensions do not make model coordinate systems compatible.

### Evaluation rubric

One point each: shared initial row; contextual transformation; position/mask effect;
distinction from a task-trained whole-text embedding.
