---
id: ai-retrieval-identifier-analysis
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-lexical-retrieval
prompt: Dense search retrieves the wrong error code for ZX-42, and keyword search also fails. What would you inspect before replacing the embedding model?
difficulty: medium
status: published
revision: 1
order: 950
tags: [retrieval, analysis, exact-identifiers]
conceptIds: [concept-lexical-retrieval]
followUps:
  - How might hyphen splitting change the matches?
  - When should an exact identifier field be used instead of ordinary text ranking?
misconception: Exact identifier correctness is not guaranteed by either semantic similarity or an arbitrary text analyzer.
---

## Answer

Inspect source ingestion, index/query analyzer outputs, term postings, case and
punctuation handling, and eligibility filters. Preserve the identifier under a
declared normalization contract and use a keyword/exact field when whole-ID equality
is required. Then trace whether fusion or shortlist truncation discards the match.

### Supporting reasoning

Splitting ZX-42 into common fragments can blur code identity, while incompatible
query/index analysis can eliminate matches. Reranking cannot restore a document
missing from its input candidates.

### Evaluation rubric

One point each: analyzer/posting inspection; identifier normalization; exact-field
contract; stage-by-stage candidate or filter diagnosis.
