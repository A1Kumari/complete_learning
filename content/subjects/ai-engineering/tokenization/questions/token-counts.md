---
id: ai-tokenizer-count-budget
kind: question
topicId: ai-tokenization-embeddings
lessonId: lesson-ai-text-tokenization
prompt: Why are token counts not word counts, and how should you budget multilingual requests?
difficulty: medium
status: published
revision: 1
order: 240
tags: [tokenization, context]
followUps:
  - Can a byte-level tokenizer split one Unicode character across tokens?
  - What request content beyond the user text contributes tokens?
misconception: A fixed characters-per-token ratio is an estimate, not a universal budget calculation.
---

## Answer

Tokens depend on vocabulary, normalization, boundaries, and byte/subword rules.
Words, code, and languages can split differently. Count the actual serialized
request with the model's tokenizer and reserve generation space.

### Supporting reasoning

Include instructions, history, examples, tool schemas, and message/special-token
overhead. UTF-8 byte sequences can span tokens, so incremental decoding must handle
incomplete characters. Changing chat templates can change counts and behavior.

### Evaluation rubric

One point each: model-specific segmentation; multilingual/code variation;
complete serialized-input budget; output reservation or Unicode qualification.
