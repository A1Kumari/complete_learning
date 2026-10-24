---
id: ai-text-similarity-not-truth
kind: question
topicId: ai-tokenization-embeddings
lessonId: lesson-ai-sentence-embeddings
prompt: Why can a high-similarity document still be an incorrect answer, and how would you evaluate an embedding upgrade?
difficulty: medium
status: published
revision: 1
order: 280
tags: [embeddings, retrieval, evaluation]
followUps:
  - Why can opposite policies have similar embeddings?
  - Can old document vectors be mixed with a new embedding model of the same width?
misconception: Similarity is not entailment, freshness, factuality, or access permission.
---

## Answer

Similarity can reflect topic rather than support for the specific claim. Evaluate
reviewed query/document relevance, negation, exact identifiers, languages, and no-answer
cases. Regenerate compatible document vectors when changing the embedding model.

### Supporting reasoning

“Refunds allowed” and “refunds not allowed” concern the same topic. Equal embedding
width does not establish aligned coordinates. Choose thresholds on validation data,
and apply permissions before returning results.

### Evaluation rubric

One point each: topic/support distinction; concrete failure example; relevant
held-out evaluation; model-version/index compatibility.
