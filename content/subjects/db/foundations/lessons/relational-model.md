---
id: lesson-db-relational-model
kind: lesson
topicId: db-foundations
title: Relational databases, keys, and data modeling
summary: Build a relational schema from an ER model and use keys and constraints to protect data integrity.
difficulty: easy
status: published
revision: 1
order: 10
tags: [dbms, modeling, constraints]
relatedIds: [db-q001, db-q002, db-q004, db-q005, db-q006]
---

## What a DBMS provides

A database is an organized collection of data; a DBMS is the software that defines, queries, and manages it. Depending on the product and configuration, the DBMS supplies access control, constraints, concurrent transactions, indexes, and recovery. Ordinary files can implement some of these capabilities too, but applications must arrange and maintain the mechanisms themselves.

The three-schema model separates an **external view** for a user or application, a **conceptual schema** describing shared logical data, and an **internal schema** describing storage. Physical data independence means changing storage or indexes without changing the logical model. Logical data independence means adapting logical structure while preserving external interfaces where possible. Neither is absolute: applications can depend on timing, query plans, column order, or specific schema details.

## Relations and keys

A relational table represents a relation, columns represent attributes, and rows represent tuples. SQL tables have practical differences from mathematical relations: duplicates can exist unless constrained, NULL represents missing or unknown information, and output order is unspecified without `ORDER BY`.

For `Student(student_id, email, name)`, assume both ID and email are unique and non-null:

| Term | Meaning | Example |
| --- | --- | --- |
| Superkey | Attributes that uniquely identify a row | `(student_id, name)` |
| Candidate key | Minimal superkey | `student_id` or `email` |
| Primary key | Chosen candidate key | `student_id` |
| Alternate key | Candidate key not chosen as primary | `email` |
| Composite key | Key with multiple attributes | `(student_id, course_id)` |
| Foreign key | Attribute or attributes referencing an eligible unique key in another or the same table | `course_id` references `Course` |

An artificial ID is a **surrogate key**. It can simplify references, but does not replace a unique constraint on a real business identifier when that identifier must also be unique. Nullable unique constraints differ between database engines; do not assume they enforce a candidate key without examining NULL behavior.

## From ER diagram to tables

An entity is a thing we track, such as a student or course; an attribute describes it; a relationship connects entities. Cardinality describes how many entities can be related. Optionality asks whether a relationship is required. A weak entity is identified using an owner and a partial identifier, such as an order line identified by `(order_id, line_number)`.

- **One-to-many:** place a foreign key on the many side, such as `course.department_id`. A `NOT NULL` constraint makes that reference mandatory for each course.
- **One-to-one:** use a foreign key with a unique constraint. Which side holds it affects which side is required; a unique foreign key alone does not guarantee that every parent has a child.
- **Many-to-many:** represent the association as a junction table, often with a composite key. Relationship attributes such as enrollment date belong there.

```sql
CREATE TABLE student (
  student_id INTEGER PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);
CREATE TABLE course (
  course_id INTEGER PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);
CREATE TABLE enrollment (
  student_id INTEGER NOT NULL REFERENCES student(student_id),
  course_id INTEGER NOT NULL REFERENCES course(course_id),
  enrolled_on DATE NOT NULL,
  PRIMARY KEY (student_id, course_id)
);
```

The composite primary key prevents duplicate pairs while allowing a student to take many courses. If retakes are legitimate, include an attempt or term identifier in the model rather than silently rejecting them. Exact data types and foreign-key enforcement settings vary by DBMS.

## Integrity in practice

Use `NOT NULL`, `UNIQUE`, `CHECK`, primary keys, and foreign keys to enforce rules close to the data. `CHECK (price >= 0)` alone normally permits NULL because UNKNOWN is not FALSE; add `NOT NULL` if missing prices are invalid. Referential actions such as `ON DELETE CASCADE` should reflect lifecycle rules, not be chosen merely for convenience. Validate application input too, but do not rely on application checks alone when multiple writers can access the database.

## Review

Why does an enrollment need two foreign keys? Each identifies one end of the association. Can a foreign key refer to the same table? Yes: an employee's manager can reference another employee. Does a primary key prevent duplicate email addresses? Only if email has its own appropriate uniqueness rule.

## Further reading

- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL relational concepts](https://www.postgresql.org/docs/current/tutorial-concepts.html)
