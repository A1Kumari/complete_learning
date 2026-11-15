---
id: lesson-db-normalization
kind: lesson
topicId: db-normalization
title: Functional dependencies and normalization
summary: Work through update anomalies, keys, normal forms, and lossless decompositions using a concrete enrollment schema.
difficulty: medium
status: published
revision: 1
order: 10
tags: [normalization, schema-design]
prerequisiteIds: [lesson-db-relational-model]
relatedIds: [db-q008, db-q009]
---

## Start with the problem

Imagine `Enrollment(student_id, student_name, course_id, course_title, instructor_id, instructor_name, grade)`. Suppose each student has one name, each course has one title and instructor, and each instructor has one name. Each student may enroll in many courses, and each course has many students. Under those rules, `(student_id, course_id)` identifies an enrollment.

Repeating course and instructor details on every enrollment creates three common anomalies:

- **Update:** changing an instructor's name requires changing every matching row; missed rows disagree.
- **Insertion:** recording a new course may require inventing a student or allowing an incomplete enrollment.
- **Deletion:** deleting the last enrollment can erase the only recorded course details.

The rules are business assumptions, not conclusions from a small sample. If an instructor can teach different namesakes or a course has multiple instructors, model those facts explicitly.

## Functional dependencies and keys

`X → Y` means any two valid rows agreeing on X must agree on Y. Here `student_id → student_name`, `course_id → course_title, instructor_id`, `instructor_id → instructor_name`, and `(student_id, course_id) → grade`. A dependency can hold even if X is not unique. A candidate key is a minimal set determining all attributes of the relation; determine it from the full set of dependencies, not merely a convenient ID.

**Closure** helps find keys: start with X, repeatedly add attributes determined by what you have, and stop when no new attribute can be added. In the example, the pair determines grade, both names, course title, and instructor ID, so its closure covers the relation. Neither ID alone covers it.

## Normal forms

| Form | Requirement and example |
| --- | --- |
| 1NF | Attributes have values from their defined domains rather than repeating columns or unmodeled lists. Atomicity depends on the chosen domain; a string or supported array type is not inherently invalid in every design. |
| 2NF | In 1NF, every non-prime attribute is fully dependent on every candidate key, not just part of a composite candidate key. `student_id → student_name` violates this for the example. |
| 3NF | For each nontrivial FD `X → A`, X is a superkey or A is a prime attribute, meaning it belongs to some candidate key. A transitive dependency through a non-key attribute is a common violation, but the formal rule handles exceptions. |
| BCNF | For every nontrivial FD `X → Y`, X must be a superkey. This is stricter than 3NF. |

## Decompose deliberately

One decomposition is `Student(student_id, student_name)`, `Instructor(instructor_id, instructor_name)`, `Course(course_id, course_title, instructor_id)`, and `Enrollment(student_id, course_id, grade)`. Each fact now has a natural home. Define primary and foreign keys to enforce the assumed relationships.

A decomposition should be **lossless**: joining the decomposed relations must reconstruct exactly the original relation for every valid instance, without spurious rows. It is also useful to preserve dependencies so constraints can be checked without joining tables. BCNF decomposition can sacrifice dependency preservation, so evaluate both properties rather than assuming every split is automatically correct.

## Denormalization is a tradeoff

Duplicating a course title in an analytics table can speed some reads or preserve a historical snapshot, but it introduces freshness and update rules. Distinguish an intentional snapshot from a cached copy that should reflect the latest value. Measure actual joins and indexes before denormalizing, then specify how the derived value is maintained and repaired.

## Check yourself

If a course title changes, how many rows should need updating in the decomposed design? One course row. Does 3NF require every determinant to be a superkey? No; the prime-attribute exception makes BCNF stricter. Does a decomposition that loses information qualify as a good normalization? No.

## Further reading

- [IBM database normalization basics](https://www.ibm.com/think/topics/database-normalization)
