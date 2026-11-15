---
id: db-normalization-anomalies
kind: question
topicId: db-normalization
lessonId: lesson-db-normalization
prompt: "Give insertion, update, and deletion anomalies for a table repeating course details on enrollment rows."
difficulty: medium
frequent: true
status: published
revision: 1
order: 10
tags: [normalization]
---

## Answer

Insertion: a course cannot be recorded without an enrollment if the table requires a student. Update: changing the title requires editing every enrollment, risking disagreement. Deletion: removing the last enrollment can remove the only record of the course. Separate course facts from enrollment facts.
