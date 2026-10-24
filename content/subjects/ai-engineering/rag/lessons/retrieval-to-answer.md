---
id: lesson-ai-rag-pipeline
kind: lesson
topicId: ai-rag
title: Build a Retrieval-to-Answer Pipeline with Citations
summary: Retrieve eligible evidence, pack a bounded context, produce an attributed answer, and return an explicit no-evidence result when support is missing.
difficulty: medium
status: published
revision: 1
order: 535
tags: [rag, retrieval, context, citations]
conceptIds: [concept-rag-pipeline]
prerequisiteIds: [lesson-ai-rag-ingestion, lesson-ai-context-packing, lesson-ai-hybrid-retrieval]
---

## Separate offline knowledge from online evidence

The offline path parses and indexes sources. The online path interprets a query,
retrieves eligible candidates, optionally reranks, selects evidence under a budget,
and passes that evidence to a generator. RAG changes supplied context; it does not
update model weights with each document. Fine-tuning can change behavior or domain
fit, but it is not a substitute for retrieving current, attributable records.

```text
question + trusted identity + effective time
  → eligible retrieval → rerank/dedupe → budgeted evidence
  → answer generator → citation/support checks → answer OR abstention
```

Retrieval can use a search service, SQL, an API, or a vector store. A vector database
is not required. Start with a transparent baseline and introduce dense/hybrid
retrieval when it improves measured coverage.

## Run a complete small pipeline without a model service

This corpus is invented. The generator deliberately copies one source sentence;
it is an **extractive test double**, not an LLM. Replacing that function with a model
requires prompt construction, token accounting, and answer acceptance tests.

```python
import re

corpus = [
    {'id': 'returns-v1', 'tenant': 'A', 'active': False,
     'text': 'Returns are accepted within 14 days.'},
    {'id': 'returns-v2', 'tenant': 'A', 'active': True,
     'text': 'Returns are accepted within 30 days.'},
    {'id': 'returns-B', 'tenant': 'B', 'active': True,
     'text': 'Returns are accepted within 90 days.'},
]
def words(text):
    return set(re.findall(r'[a-z0-9]+', text.lower()))

def answer(question, tenant, input_budget, generate):
    eligible = [row for row in corpus if row['tenant'] == tenant and row['active']]
    scored = [(len(words(question) & words(row['text'])), row) for row in eligible]
    ranked = [row for score, row in sorted(scored, key=lambda x: (-x[0], x[1]['id']))
              if score > 0]
    # Word counts are a test-double budget including citation ID overhead.
    remaining = input_budget - len(question.split())
    if remaining < 0:
        raise ValueError('question exceeds budget')
    evidence = []
    for row in ranked:
        cost = len(row['text'].split()) + 1
        if cost <= remaining:
            evidence.append(row)
            remaining -= cost
    if not evidence:
        return {'status': 'no_evidence', 'text': None, 'citations': []}
    result = generate(question, evidence)
    sent_ids = {row['id'] for row in evidence}
    if not result['citations'] or not set(result['citations']) <= sent_ids:
        raise ValueError('unknown or missing citation')
    return {'status': 'answered', **result}

def extractive(question, evidence):
    row = evidence[0]
    return {'text': row['text'], 'citations': [row['id']]}

result = answer('Returns window?', 'A', 20, extractive)
assert result['citations'] == ['returns-v2'] and '30 days' in result['text']
assert answer('Shipping fees?', 'A', 20, extractive)['status'] == 'no_evidence'
assert answer('Returns window?', 'C', 20, extractive)['status'] == 'no_evidence'
assert answer('Returns window?', 'A', 2, extractive)['status'] == 'no_evidence'
print('30-day answer cites returns-v2; missing, unauthorized, and unfit evidence abstain')
```

The example checks evidence identity, not unrestricted semantic entailment. The
next lesson shows why valid citation IDs alone are insufficient. Literal overlap
is intentionally weak: “How long can I send it back?” may fail despite a relevant
source. No-evidence can reflect a retrieval miss or packing failure, not corpus absence.

## Assemble the full model request deliberately

Keep stable application instructions distinct from labeled source blocks. A source
can contain text resembling commands; retrieval does not elevate that text to
application authority. Include source IDs beside their content, ask for claim-level
attribution and explicit uncertainty, and preserve the user's exact question.
Check the model's complete serialized request budget, including instructions,
history, tool schemas, citations, and reserved output capacity. The word counter
above is not a model-token counter.

Recheck freshness/access before disclosing evidence if permissions can change during
a request. Cache keys need identity/access scope, source/index version, query, and
relevant configuration. A cached answer from one tenant is not reusable for another
merely because the text of the question matches.

## Recall and application

List two reasons eligible retrieval can succeed while evidence packing fails.
Where would you insert a reranker? If the generator invents a source ID, should
the answer be accepted because its prose sounds plausible?

## References

- [LangChain: two-step and agentic RAG](https://docs.langchain.com/oss/python/langchain/retrieval)
- [Original RAG paper: retrieved nonparametric memory and generation](https://arxiv.org/abs/2005.11401)
