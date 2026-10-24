---
id: ai-output-evidence-acceptance
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-typed-validation
prompt: Why is a schema-valid object with a source quote not necessarily an acceptable answer?
difficulty: medium
status: published
revision: 1
order: 640
tags: [structured-output, evidence, validation]
conceptIds: [concept-output-validation]
followUps:
  - What if the quote says 30 days but excludes the user's product?
  - Which source attributes belong to trusted application checks?
misconception: A present substring and a source identifier do not establish support for the scoped claim.
---

## Answer

The source must be authorized, current for the task's reference time, and actually
support the claim including its scope and exceptions. Types and a quoted substring
cannot establish all those semantic facts.

### Supporting reasoning

A standard-order policy may not apply to custom orders. Check source revision,
permissions, effective dates, cross-field consistency, and question scope. Route
uncertain cases to review or a declared insufficient-evidence result.

### Evaluation rubric

One point each: structural/semantic distinction; scoped exception example;
trusted source checks; explicit uncertainty/review policy.
