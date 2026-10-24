---
id: ai-transformer-causal-mask
kind: question
topicId: ai-transformers
lessonId: lesson-ai-scaled-attention
prompt: A causal decoder gives future positions nonzero attention after their logits are set to zero. What is wrong, and how would you test the fix?
difficulty: medium
status: published
revision: 1
order: 790
tags: [transformers, masking]
conceptIds: [concept-scaled-attention]
followUps:
  - What happens if an entire query row has no allowed keys?
  - How does a padding mask differ from a causal mask?
misconception: A zero logit does not imply zero softmax probability.
---

## Answer

Softmax exponentiates zero to one, so those positions still receive weight. Mask
forbidden logits before softmax with negative infinity or the kernel's documented
equivalent. Check future weights are zero and perturb future inputs to verify
earlier outputs remain unchanged.

### Supporting reasoning

Inspect triangle orientation and API boolean meaning. Combine padding and causal
eligibility. An entirely masked row needs explicit handling because ordinary
softmax has no valid distribution over an empty allowed set.

### Evaluation rubric

One point each: exp(0) explanation; correct masking stage; future-perturbation
test; padding/all-masked/API-contract qualification.
