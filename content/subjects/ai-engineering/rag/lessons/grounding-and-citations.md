---
id: lesson-ai-rag-grounding
kind: lesson
topicId: ai-rag
title: Validate Citations, Claim Support, and Freshness
summary: Distinguish citation existence from semantic support, validate a narrow numeric claim against evidence, and diagnose unsupported answers despite good retrieval.
difficulty: hard
status: published
revision: 1
order: 540
tags: [rag, grounding, citations, evidence]
conceptIds: [concept-rag-grounding]
prerequisiteIds: [lesson-ai-rag-pipeline, lesson-ai-output-typed-validation]
---

## A real citation can still support the wrong answer

An answer saying “Returns last 90 days [returns-v2]” can cite an existing source
whose actual rule says 30 days. Citation **integrity** asks whether references resolve
to supplied eligible evidence. Claim **support** asks whether that evidence actually
justifies the statement, including its subject, conditions, units, and time scope.

Groundedness is not completeness: an answer can state one supported rule while
omitting an important exception. Nor is groundedness universal truth: a source can
itself be wrong. Evaluate authority and provenance alongside faithful evidence use.

```text
candidate claims + citations → resolve IDs → scope/version checks
                            → claim-support checks → accept / reject / review
```

## Validate one narrow domain contract

For an approved “return-window days” field, a deterministic check can compare an
integer claim with a fact extracted under an explicit source format. This handles
a constrained data contract, not general natural-language entailment.

```python
import re

evidence = {'returns-v2': {
    'tenant': 'A', 'revision': 2, 'active': True,
    'text': 'Returns are accepted within 30 days. Final-sale items are excluded.',
}}

def accept(claim, tenant):
    if set(claim) != {'source_id', 'days', 'quote'} or type(claim['days']) is not int:
        return False
    row = evidence.get(claim['source_id'])
    if not row or row['tenant'] != tenant or not row['active']:
        return False
    quote = claim['quote']
    if not isinstance(quote, str) or not quote or quote not in row['text']:
        return False
    pattern = r'Returns are accepted within (\d+) days\.'
    source_fact, quoted_fact = re.search(pattern, row['text']), re.fullmatch(pattern, quote)
    return bool(source_fact and quoted_fact and
                int(source_fact[1]) == int(quoted_fact[1]) == claim['days'])

good = {'source_id': 'returns-v2', 'days': 30,
        'quote': 'Returns are accepted within 30 days.'}
assert accept(good, 'A')
assert not accept({**good, 'days': 90}, 'A')
assert not accept({**good, 'source_id': 'invented'}, 'A')
assert not accept({**good, 'quote': 'Final-sale items are excluded.'}, 'A')
assert not accept(good, 'B')
assert not accept({**good, 'days': True}, 'A')
print('supported 30-day field accepted; false claim, irrelevant quote, wrong ID/scope rejected')
```

Do not generalize this regex into a free-text verifier. A different sentence format,
negation, table, jurisdiction, or product class requires different parsing and
judgment. The accepted field also does not establish that all products qualify;
the final-sale exception still belongs in a complete answer where relevant.

## Preserve claim-to-evidence relationships

Require each substantive claim to identify its supporting source span, rather than
attaching a list of vaguely related documents to the whole answer. Validate quoted
text against the declared revision and coordinate system. A source ID resolving to
the latest webpage can drift from what was actually retrieved; retain revision or
content hash so evidence can be reconstructed.

Conflicting policies need explicit effective-time and authority rules. Do not
average 14-day and 30-day policies into a fabricated 22-day rule. Historical
questions may correctly require old revisions, while a current request should not
quietly use an obsolete policy.

## Diagnose the whole path

If retrieval quality is high but answers hallucinate, inspect the actual evidence
**sent** to the model: packing may drop the decisive paragraph, truncation may cut
the condition, or duplicated chunks may crowd out an exception. Then inspect
generation, citation association, and acceptance. A model can ignore good evidence
or substitute familiar parametric knowledge.

For broad prose, combine reviewed evaluation examples with human or calibrated
model-assisted support judgments. An LLM judge can disagree or share the generator's
biases; benchmark it against independent labels. Retry only failures that a bounded
retry can plausibly repair; unsupported evidence may require retrieval refinement,
clarification, or abstention instead of repeated confident wording.

## Recall and application

Why does checking `quote in source` not prove that an adjacent claim is supported?
Describe one supported-but-incomplete answer and one plausible-but-unsupported
answer. What source identity information allows an auditor to reconstruct a claim?

## References

- [LangSmith: evaluate answer correctness, groundedness, and retrieval separately](https://docs.langchain.com/langsmith/evaluate-rag-tutorial)
- [RAG paper: provenance and updating knowledge](https://arxiv.org/abs/2005.11401)
