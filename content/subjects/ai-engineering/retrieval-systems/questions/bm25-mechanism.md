---
id: ai-retrieval-bm25-mechanism
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-lexical-retrieval
prompt: How do an inverted index and BM25 work together, and what do term frequency, document frequency, k1, and b represent?
difficulty: medium
frequent: true
status: published
revision: 1
order: 940
tags: [retrieval, bm25]
conceptIds: [concept-lexical-retrieval]
followUps:
  - Does doubling term frequency necessarily double the BM25 score?
  - What extra posting information supports phrase queries?
misconception: Term frequency within one document is not document frequency across the collection.
---

## Answer

The inverted index maps analyzed terms to matching document postings. BM25 scores
those candidates with term rarity, saturated within-document frequency, and length
normalization. tf counts a term in one document, df counts documents containing it,
k1 controls frequency saturation, and b controls length normalization.

### Supporting reasoning

Repeated mentions provide diminishing returns. Longer documents receive a length
adjustment rather than automatically winning by having more words. Phrase matching
requires positional information or equivalent indexed structure, not just term sets.

### Evaluation rubric

One point each: postings mechanism; tf/df distinction; k1 saturation; b length effect.
