---
id: ai-transformer-head-shapes
kind: question
topicId: ai-transformers
lessonId: lesson-ai-transformer-blocks
prompt: For B=2, T=5, D=12 and H=3 equal-width heads, trace multi-head attention shapes and explain why a reshape alone may merge heads incorrectly.
difficulty: medium
status: published
revision: 1
order: 800
tags: [transformers, tensor-shapes]
conceptIds: [concept-transformer-block]
followUps:
  - Does splitting one tensor by itself learn distinct heads?
  - What is lost if head outputs are averaged before concatenation?
misconception: Matching the final shape does not prove token and head channels are in the correct order.
---

## Answer

Projected Q/K/V are `(2,5,12)`, split/transposed tensors `(2,3,5,4)`, weights
`(2,3,5,5)`, and head outputs `(2,3,5,4)`. Transpose back to `(2,5,3,4)` before
merging to `(2,5,12)` and applying an output projection.

### Supporting reasoning

Reshaping the head-major tensor directly can scramble token/head coordinates while
producing a plausible final shape. Different learned projections enable distinct
heads; dimension splitting only organizes their activations.

### Evaluation rubric

One point each: head width; score shape; transpose-before-merge; learned-projection
versus layout distinction.
