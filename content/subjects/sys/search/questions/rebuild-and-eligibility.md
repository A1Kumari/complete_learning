---
id: sys-design-search-rebuild-eligibility
kind: question
topicId: system-design-search
lessonId: lesson-sys-search
prompt: "How would you change a search analyzer without downtime while preserving deletions and permission boundaries?"
difficulty: hard
status: published
revision: 1
order: 432
tags: [system-design, search]
followUps: ["Why can filtering only the final top ten lose recall?", "Which metrics separate retrieval coverage from ranking quality?"]
---

## Answer

Build a versioned replacement index, backfill from a consistent source boundary, and apply ongoing changes with source versions and deletion tombstones. Verify catch-up, eligibility behavior, query relevance, and latency before switching an alias or routing pointer. Keep a rollback plan accounting for changes accepted after the new index becomes active.

Apply tenant and permission eligibility during retrieval and revalidate sensitive access as required. Deleting the primary record alone does not remove stale snippets, counts, or cached results from derived systems.

### Evaluation rubric

Require snapshot-plus-change synchronization, no stale update resurrection, and measurable freshness. Strong answers use Recall@k for candidate coverage and ranking measures such as nDCG/MRR on labeled query slices rather than relying solely on click rate.
