# Python curriculum authoring

The 21 ordered topic cards and their scope are defined in `content/topics.json`,
the single active curriculum source. Their `group` fields identify the four
levels. All topics are planned until actual material is published.

Each topic has a directory under `content/subjects/python/`. Its name is the
topic ID without the `python-` prefix (for example, `python-oop` uses `oop/`).
Add material using the existing content pipeline:

```text
content/subjects/python/oop/
  lessons/classes-and-instances.md
  questions/python-classes-example.md
  assets/                           # optional local diagrams
```

Use the exact topic ID in each file's `topicId` frontmatter. Create `lessons/`,
`questions/`, and `assets/` when needed. Order lessons from prerequisites to
more complex concepts with their `order` and `prerequisiteIds` metadata. Explain
concepts with runnable examples, edge cases and common mistakes; add relevant
interview questions as separate question files linked by `lessonId`. Add practical
exercises in lessons where appropriate. Start as drafts and publish only after
review. The topic card automatically picks up published lessons and questions.

For the full schema, authoring examples, preview and validation commands, see
`CONTENT_AUTHORING.md`. Python backend frameworks and AI/data specializations
belong in their respective subjects rather than this core curriculum.
