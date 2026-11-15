---
id: db-sql-window-frame
kind: question
topicId: db-sql
lessonId: lesson-db-sql-advanced
prompt: "Why explicitly specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW for a running sum?"
difficulty: hard
frequent: false
status: published
revision: 1
order: 60
tags: [sql, window-functions]
---

## Answer

It defines a cumulative frame ending at the current row in the window order. Default frames can treat equal ordering values as peers and include them together. Include a stable unique tie-breaker if a reproducible row-by-row sequence is required, and verify the target database's frame rules.
