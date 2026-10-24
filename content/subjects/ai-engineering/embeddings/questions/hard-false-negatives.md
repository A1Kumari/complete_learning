---
id: ai-embedding-hard-false-negatives
kind: question
topicId: ai-embeddings
lessonId: lesson-ai-embedding-objectives
prompt: Distinguish a hard negative from a false negative in embedding training.
difficulty: medium
status: published
revision: 1
order: 700
tags: [embeddings, training-data]
conceptIds: [concept-embedding-objectives]
followUps:
  - Can in-batch negatives accidentally contain another valid answer?
  - Why not use arbitrary generation-model token states as retrieval vectors?
misconception: Confusing examples are useful negatives only if they are actually nonrelevant under the task's judgments.
---

## Answer

A hard negative is confusing but genuinely nonrelevant, such as the wrong product's
similar warranty policy. A false negative is actually relevant but labeled negative,
which can train the encoder to separate examples that should match.

### Supporting reasoning

In-batch candidates can contain duplicate or multiple valid answers. Review
judgment scope and objective assumptions. Retrieval representations require
appropriate training, pooling, and evaluation—not just any hidden vector.

### Evaluation rubric

One point each: correct hard-negative definition; false-negative definition;
concrete task example; data/objective qualification.
