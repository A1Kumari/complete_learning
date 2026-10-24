---
id: ai-output-constrained-contract
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-schema-contracts
prompt: What does schema-constrained generation add beyond asking for JSON, and what remains unchecked?
difficulty: medium
status: published
revision: 1
order: 620
tags: [structured-output, validation]
conceptIds: [concept-output-contracts]
followUps:
  - Can a perfectly typed policy period still be wrong?
  - What makes a change from calendar days to business days a contract migration?
misconception: Structural constraints cannot establish truth, source authority, or permission to act.
---

## Answer

Supported constrained generation restricts output toward a declared schema rather
than relying only on a natural-language formatting request. The application must
still handle lifecycle/refusal paths and verify evidence, scope, business semantics,
authorization, and version compatibility.

### Supporting reasoning

An integer 30 can be valid but refer to the wrong policy or units. JSON mode,
schema adherence, local strict typing, and semantic acceptance are different layers.

### Evaluation rubric

One point each: constrained-structure mechanism; distinction from JSON syntax;
remaining semantic/lifecycle checks; version/units compatibility example.
