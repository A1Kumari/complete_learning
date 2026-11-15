---
id: db-normalization-partial
kind: question
topicId: db-normalization
lessonId: lesson-db-normalization
prompt: "Given key (student_id, course_id) and course_id → course_title, which normal form is violated and why?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 20
tags: [functional-dependencies, normalization]
---

## Answer

Assuming this pair is a candidate key and `course_title` is non-prime, the relation violates 2NF: the title depends on only part of the composite key. Move the course fact to a course relation keyed by `course_id`, and keep the enrollment relationship separately.
