---
id: lesson-ai-embedding-input-contracts
kind: lesson
topicId: ai-embeddings
title: Embedding Input Contracts, Languages, and Domain Fit
summary: Preserve model-specific query/document formatting, pooling, and truncation behavior; evaluate multilingual and domain inputs without pretending one model works uniformly.
difficulty: medium
status: published
revision: 1
order: 360
tags: [embeddings, multilingual, preprocessing, python]
conceptIds: [concept-embedding-input-contracts, concept-tokenization]
prerequisiteIds: [lesson-ai-embedding-objectives, lesson-ai-context-selection]
---

## An embedding model includes preprocessing

The deployable encoder is more than its weights. It includes tokenizer revision,
normalization, query/document prefixes or instructions, pooling, maximum input
length, output normalization, and any dimensionality/precision settings. Changing
one can alter the coordinate distribution and retrieval behavior.

```text
raw query / passage → task-specific formatting → tokenizer and length policy
                                                   ↓
                                       encoder + prescribed pooling
                                                   ↓
                                 normalization → versioned text vector
```

For example, the multilingual-e5-base model card prescribes `query: ` and
`passage: ` prefixes for asymmetric retrieval, including non-English text, and
demonstrates masked average pooling and normalization. Its documented input limit
is 512 tokens. Those are facts about this model, not universal requirements for
every embedding service. Use the chosen model's current release contract.

## Preserve tasks and boundaries

For query-to-passage retrieval, a short question and a long answer serve different
roles. For paraphrase similarity, both sides may use the same formatting. Do not
infer the role from string length or language; pass it explicitly. Prefixes can
consume budget and affect the encoder, so count the formatted input rather than
only the raw text.

An overly long passage may be truncated by a library without a hard error. If the
answer occurs near the end, the resulting vector never represented it. Define a
policy: reject, split into coherent passages, or intentionally truncate after
evaluation. Averaging arbitrary chunk vectors is not guaranteed to equal embedding
the whole document or to preserve an important exception.

## Test a formatting and length boundary

This fixture uses word splitting **only as a synthetic counter**. It tests the
builder's decisions without downloading a model. Real deployment needs the actual
tokenizer and special-token accounting; multilingual words are not one token each.

```python
def prepare(text, kind, count_tokens, limit):
    if kind not in {'query', 'passage'}:
        raise ValueError('explicit supported input role required')
    if type(text) is not str or not text.strip():
        raise ValueError('nonempty text required')
    formatted = f'{kind}: {text}'
    if count_tokens(formatted) > limit:
        raise ValueError('split or reject: do not truncate silently')
    return formatted

fixture_count = lambda text: len(text.split())
query = prepare('réinitialiser mon mot de passe', 'query', fixture_count, 8)
passage = prepare('Reset your password from account settings.', 'passage', fixture_count, 8)
assert query.startswith('query: réinitialiser')
assert passage.startswith('passage: Reset')
for text, kind in [('word ' * 20, 'passage'), ('', 'query'), ('hello', 'unknown')]:
    try:
        prepare(text, kind, fixture_count, 8)
    except ValueError:
        pass
    else:
        raise AssertionError('bad input accepted')
print('roles preserved; French text retained; long and invalid inputs rejected')
```

The example does not prove cross-lingual relevance: it preserves the French bytes
and appropriate role label. Actual semantic quality requires real encoder outputs
and reviewed query/document judgments. Avoid lowercasing, translation, or accent
removal unless the model/task contract calls for it and evaluation supports it.

## Domain and multilingual evaluation

“Supports many languages” is not evidence of equal performance in all of them.
Create native-query/native-document and cross-lingual query/document slices.
Include product abbreviations, code-switched text, typos, proper nouns, exact
identifiers, and negated policies. Human review should understand both languages
and the domain; machine translation can erase distinctions your test is meant to
measure.

For medical or legal corpora, topical similarity can be dangerously incomplete:
two documents may concern the same condition but opposite contraindications, or
the same clause under different jurisdictions. A domain-trained encoder is a
candidate, not automatic proof of suitability. Compare against a lexical baseline
and investigate slice errors before fine-tuning.

## Practical operating contract

Store model revision and preprocessing settings with the vector generation job.
Keep source identity, content revision, and passage boundaries. Do not mix document
vectors generated under different prefix/pooling/model contracts in a common
comparison merely because they share width. Rechecking source authorization stays
necessary regardless of how the text was embedded.

## Recall

Why count after applying a prefix? Why does a preserved French string not prove
multilingual quality? What if the relevant policy exception was past the token
limit? Explain a task where query/passages need different formatting and one where
the selected model prescribes the same formatting on both sides.

## Verified references

- [Multilingual E5: usage, prefixes, pooling, language caveats, and length limit](https://huggingface.co/intfloat/multilingual-e5-base)
- [Sentence Transformers: semantic similarity](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html)
