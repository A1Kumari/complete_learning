---
id: ai-embedding-input-preprocessing
kind: question
topicId: ai-embeddings
lessonId: lesson-ai-embedding-input-contracts
prompt: What belongs to an embedding encoder's input/output contract besides its weights?
difficulty: medium
status: published
revision: 1
order: 730
tags: [embeddings, preprocessing]
conceptIds: [concept-embedding-input-contracts]
followUps:
  - Why count formatted inputs after adding query or passage prefixes?
  - What if a policy exception lies beyond the tokenizer limit?
misconception: A vector does not represent text that was silently truncated before encoding.
---

## Answer

Version tokenizer, normalization, task prefixes/instructions, pooling, maximum
length and truncation/chunking, output normalization, dimensions, and precision.
Use the released model's task-specific formatting rather than universal prefixes.

### Supporting reasoning

Prefixes consume tokens and affect behavior. Reject or split long passages under
a measured policy; do not assume the truncated vector covers omitted exceptions.
Change query and document contracts consistently.

### Evaluation rubric

One point each: input/tokenizer contract; task/pooling/output conventions;
explicit length policy; compatible versioned query/document processing.
