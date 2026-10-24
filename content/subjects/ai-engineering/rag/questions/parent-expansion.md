---
id: ai-rag-parent-expansion
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-patterns
prompt: A small retrieved chunk is permitted, but expanding its parent could expose a retired revision or another access scope. What checks belong at expansion?
difficulty: hard
status: published
revision: 1
order: 1080
tags: [rag, parent-retrieval, permissions]
conceptIds: [concept-rag-patterns]
followUps:
  - What is gained by retrieving children and generating from larger parents?
  - How does expansion affect context packing?
misconception: Eligibility of one child does not automatically establish eligibility of every parent version or sibling.
---

## Answer

Resolve the matching parent identity and revision, recheck its current tenant/ACL
and effective-time eligibility, and count expanded text against the full request
budget. Reject unauthorized or mismatched expansion instead of broadening access
for context completeness.

### Supporting reasoning

Child matches can provide precise retrieval while parents restore conditions and
nearby context. This benefit depends on preserving provenance and selecting only
permitted, relevant surrounding material.

### Evaluation rubric

One point each: matching parent revision; access/time checks; expanded budget;
retrieval-versus-context rationale.
