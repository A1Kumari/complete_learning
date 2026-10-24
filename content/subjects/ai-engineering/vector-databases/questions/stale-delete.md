---
id: ai-vector-stale-delete
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-vector-lifecycle
prompt: Revision 8 deletes a document, but an embedding job for revision 7 finishes afterward. How do you prevent the document from reappearing?
difficulty: hard
status: published
revision: 1
order: 920
tags: [vector-databases, deletion, consistency]
conceptIds: [concept-vector-lifecycle]
followUps:
  - Why does deleting the tombstone immediately weaken replay protection?
  - What concurrency guarantee is required for a revision check?
misconception: Deleting a vector once does not prevent a delayed upsert from recreating it.
---

## Answer

Retain a revision-8 tombstone or equivalent version fence and reject writes whose
source revision is not newer. Enforce the check and write atomically or through
serialized event processing. Also exclude deleted records from serving while
physical index/cache cleanup completes.

### Supporting reasoning

An in-memory check is insufficient across concurrent workers. Tombstone retention
must cover possible replay windows. Chunk manifests are needed to remove obsolete
chunk IDs when one source document changes its segmentation.

### Evaluation rubric

One point each: monotonic source revisions; retained delete fence; atomicity or
serialization; serving exclusion/replay/chunk cleanup consideration.
