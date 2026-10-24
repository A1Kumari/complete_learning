---
id: lesson-ai-rag-patterns
kind: lesson
topicId: ai-rag
title: Query Expansion, Parent Retrieval, and Bounded RAG Refinement
summary: Choose advanced RAG patterns by observed failure, merge multi-query evidence safely, and bound iterative retrieval without treating generated search aids as facts.
difficulty: hard
status: published
revision: 1
order: 550
tags: [rag, multi-query, parent-retrieval, agentic-rag]
conceptIds: [concept-rag-patterns]
prerequisiteIds: [lesson-ai-rag-grounding, lesson-ai-retrieval-evaluation]
---

## Add a pattern to repair a measured failure

| Observed failure | Candidate pattern | Cost or qualification |
| --- | --- | --- |
| Vocabulary mismatch | Query rewriting or multiple query variants | Extra calls/searches; preserve names, negation, dates, and intent |
| Match lacks nearby conditions | Retrieve small chunks, expand to parent/neighbor context | More context; recheck parent eligibility and revision |
| Relevant items rank low | Hybrid retrieval plus reranking | More candidates and scoring latency |
| Question requires multiple facts | Decompose into subquestions and join evidence | Preserve entity/time links; each missing fact remains missing |
| Unclear evidence sufficiency | Bounded retrieve–check–refine loop | Repeated search can loop or drift; explicit stopping rules |
| Poor embedding query form | Hypothetical-document search aid | Generated content is a query representation, not factual evidence |

“Advanced RAG” is a collection of design choices, not one mandatory architecture.
Use a two-step baseline to establish whether complexity buys useful coverage or
answer quality at acceptable latency.

```text
original question → bounded query variants → eligible hits → ID deduplication
                  → authorized parent expansion → budget/coverage check
                  → answer OR bounded refinement OR explicit insufficiency
```

## Merge two evidence needs without widening access

This deterministic fixture represents a question asking for both the window and
its exception. Search results are predeclared; no model is generating the queries.

```python
chunks = {
    'window': {'parent': 'returns-v2', 'tenant': 'A', 'active': True,
               'text': 'Returns are accepted within 30 days.'},
    'exception': {'parent': 'returns-v2', 'tenant': 'A', 'active': True,
                  'text': 'Final-sale items cannot be returned.'},
    'private': {'parent': 'other', 'tenant': 'B', 'active': True,
                'text': 'Private customer agreement.'},
}
parents = {'returns-v2': {'tenant': 'A', 'active': True},
           'other': {'tenant': 'B', 'active': True}}
hits = {'window query': ['window', 'private'],
        'exception query': ['window', 'exception']}

def gather(queries, tenant, max_searches=2):
    seen_queries, collected = set(), {}
    searches = 0
    for query in queries:
        if query in seen_queries:
            continue
        if searches >= max_searches:
            break
        seen_queries.add(query)
        searches += 1
        for chunk_id in hits.get(query, []):
            row = chunks[chunk_id]
            parent = parents[row['parent']]
            if (row['tenant'] == parent['tenant'] == tenant and
                    row['active'] and parent['active']):
                collected[chunk_id] = row
    return collected, searches

evidence, used = gather(['window query', 'window query', 'exception query'], 'A')
assert set(evidence) == {'window', 'exception'} and used == 2
assert gather(['window query', 'exception query'], 'A', 1)[0].keys() == {'window'}
parents['returns-v2']['active'] = False
assert gather(['window query'], 'A')[0] == {}
print('2 searches cover window and exception; duplicates, other tenant, stale parent excluded')
```

The parent metadata check prevents expanding a permitted hit into a forbidden or
retired parent. Real parent text must also be fetched from the matching revision
and counted in the complete-request budget. A known relevant child does not imply
every sibling or current parent version is eligible.

## Bound iterative retrieval

Track query variants, source IDs, required evidence needs, search count, elapsed
time, and cost. Stop on sufficient supported evidence, exhausted budget, repeated
queries, or no new usable information under a declared policy. An agent may choose
which tool/query to run next; the application still enforces limits and eligibility.
The next topic teaches that execution loop directly.

Agentic RAG can vary its number of searches, while a fixed two-step pipeline always
retrieves before generating. Neither definition requires a specific framework.
Multi-hop answers must validate the connection between facts: finding a company
name in one source and an unrelated date in another does not prove the joined claim.

## Evaluate against the simpler baseline

Use the same held-out questions and corpus snapshot. Measure relevant evidence
coverage, claim support, exception completeness, abstention behavior, and latency
at each pattern's operating point. Test injected instructions in retrieved text as
untrusted content. Framework retries or a second “reflection” prompt do not by
themselves establish support. Detailed scoring methodology belongs in RAG Evaluation;
this lesson focuses on choosing and bounding pipeline mechanisms.

## Recall

Which failure calls for parent expansion rather than a new encoder? When should a
multi-query run stop even though it has budget remaining? Why must hypothetical
generated documents not be shown to users as retrieved primary sources?

## References

- [LangChain: two-step, hybrid, and agentic RAG patterns](https://docs.langchain.com/oss/python/langchain/retrieval)
- [HyDE: hypothetical documents as retrieval representations](https://arxiv.org/abs/2212.10496)
