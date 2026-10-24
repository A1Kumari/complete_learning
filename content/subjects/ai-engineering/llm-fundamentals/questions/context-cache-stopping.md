---
id: ai-llm-context-cache-stopping
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-llm-inference
prompt: What do prefill, decoding, and a KV cache do, and how should output completion be detected?
difficulty: medium
status: published
revision: 1
order: 340
tags: [llm, inference, context]
followUps:
  - Does a cache update learned parameters?
  - Why does a closed connection not establish successful completion?
misconception: A large context window and retained cache do not guarantee permanent memory or reliable recall.
---

## Answer

Prefill processes the supplied prefix. Decoding repeatedly selects and appends tokens.
A KV cache reuses earlier attention key/value activations. Inspect terminal response
status and stop reasons rather than inferring success from transport closure.

### Supporting reasoning

Caches normally change activations, not weights. Budget serialized input and output
space; a limit, refusal, interruption, or cancellation may leave incomplete output.

### Evaluation rubric

One point each: prefill/decode distinction; activation reuse; context/output budget;
explicit successful versus incomplete terminal handling.
