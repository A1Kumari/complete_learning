---
id: python-oop-employee-attribute-shadowing
kind: question
topicId: python-oop
lessonId: lesson-python-oop-classes-objects
prompt: "An Employee class has company = 'Google'. After e1.company = 'Microsoft' and Employee.company = 'Amazon', what do e1.company and e2.company return?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 20
tags: [python, oop, attributes]
followUps:
  - "What happens after deleting e1.company?"
  - "How would mutating a shared list differ from assigning a new attribute?"
---

## Answer

**Microsoft, Amazon.** Assigning `e1.company` creates an instance attribute
that shadows the class attribute. `e2` has no `company` of its own, so it
finds the updated value on `Employee`.

### Follow-up

After `del e1.company`, lookup on `e1` finds `Employee.company`, so it returns
`Amazon`. Mutating a shared class-level list changes that same list for all
instances that access it; assigning an ordinary instance attribute instead
shadows the class attribute.
