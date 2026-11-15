---
id: python-control-flow-loop-else
kind: question
topicId: python-control-flow
lessonId: lesson-python-control-flow
prompt: When does the else block on a Python loop run?
difficulty: medium
status: published
revision: 1
order: 20
tags: [python, control-flow]
misconception: Loop else does not mean that the loop body never ran.
---

## Answer

It runs when the loop completes normally, including when it has no iterations. It does not run if a `break` exits that loop; an exception or return also prevents normal completion.
