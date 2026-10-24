---
id: lesson-ai-hybrid-retrieval
kind: lesson
topicId: ai-retrieval-systems
title: Dense Retrieval and Reciprocal Rank Fusion
summary: Combine lexical and dense candidate lists by identity, calculate reciprocal rank fusion, and explain why raw score addition can mislead.
difficulty: medium
status: published
revision: 1
order: 490
tags: [retrieval, dense-search, hybrid-search, rrf]
conceptIds: [concept-hybrid-retrieval]
prerequisiteIds: [lesson-ai-lexical-retrieval, lesson-ai-exact-vector-search]
---

## Use complementary retrieval signals

A bi-encoder represents queries and documents separately. Documents can be embedded
ahead of time; query-time vector search finds nearby document representations.
This can recover paraphrases such as “recover login credentials” for a password
reset question. It can also confuse nearly identical error codes or ignore crucial
negation. The learned geometry and training distribution determine behavior.

Lexical retrieval preserves explicit term evidence. Dense retrieval can supply
semantic candidates without shared words. **Hybrid retrieval** combines them to
improve candidate coverage, subject to evaluation rather than a guarantee that
every query improves.

```text
                 ┌→ lexical analyzer + BM25 → ranked eligible IDs ┐
query + policy ──┤                                               ├→ dedupe + fuse
                 └→ query encoder + vectors → ranked eligible IDs ┘
```

Each branch must apply the same required eligibility policy. Fuse stable document
or chunk IDs so a hit found by both branches is one candidate, not two unrelated
records. Decide separately how multiple chunks from one document are aggregated.

## Calculate rank fusion on a small failure case

Reciprocal rank fusion (RRF) assigns `sum 1/(c + rank)` across input lists, using
one-based ranks. A missing document contributes zero for that list. The positive
constant c controls how strongly the first few ranks dominate; 60 is a commonly
used setting, not a universal optimum or the number of returned results.

```python
from collections import Counter, defaultdict
from math import log, sqrt
import re

docs = {'A': 'reset password account', 'B': 'recover login credentials',
        'C': 'error zx-42 connection', 'D': 'password password security guide'}
def tokens(text):
    return re.findall(r'[a-z0-9]+(?:-[a-z0-9]+)*', text.lower())

query = 'ZX-42'
tf = {doc: Counter(tokens(text)) for doc, text in docs.items()}
avglen = sum(sum(row.values()) for row in tf.values()) / len(tf)
lex_scores = defaultdict(float)
for term in set(tokens(query)):
    df = sum(term in row for row in tf.values())
    idf = log(1 + (len(tf)-df+.5)/(df+.5))
    for doc, row in tf.items():
        freq = row[term]
        if freq:
            lex_scores[doc] += idf*freq*2.2/(freq+1.2*(.25+.75*sum(row.values())/avglen))
lexical = sorted(lex_scores, key=lambda doc: (-lex_scores[doc], doc))
# Invented vectors deliberately model an exact-code failure, not measured embeddings.
vectors = {'A': (.8, .6), 'B': (1., 0.), 'C': (.6, .8), 'D': (.7, sqrt(.51))}
q = (1., 0.)
cosine = {doc: sum(a*b for a, b in zip(q, v))/sqrt(sum(x*x for x in v))
          for doc, v in vectors.items()}
dense = sorted(cosine, key=lambda doc: (-cosine[doc], doc))
rrf = defaultdict(float)
for ranking in [lexical, dense]:
    assert len(ranking) == len(set(ranking))
    for rank, doc in enumerate(ranking, 1):
        rrf[doc] += 1/(60+rank)
fused = sorted(rrf, key=lambda doc: (-rrf[doc], doc))
assert lexical == ['C'] and dense == ['B', 'A', 'D', 'C']
assert fused == ['C', 'B', 'A', 'D']
print('lexical: C; dense: B, A, D, C; fused: C, B, A, D')
```

C gets `1/61 + 1/64 ≈ 0.032018`, while B gets only `1/61 ≈ 0.016393`. RRF
raises C because both branches find it, even though dense ranks it last. This is a
constructed demonstration of the merge rule, not empirical proof of an embedding
model's weaknesses or of hybrid superiority across real queries.

## Why not add BM25 and cosine directly?

BM25 and cosine have different ranges and distributions. Multiplying one system's
scores by 100 would change a raw weighted-sum ranking even if its ordering did not
change. RRF uses ranks, so it is insensitive to that scale change. It also discards
score margins: a decisive rank-one hit and a near-tie rank-one hit receive the same
rank contribution.

Score fusion can work with calibration or a justified normalization/weighting
scheme tuned on representative development data. Per-query min–max normalization
can be unstable for short lists or outliers; probabilities cannot be assumed.
Compare approaches on held-out query slices instead of declaring one universally
correct. Candidate depths, branch weights, c, deduplication, and final cutoff all
change behavior. A relevant item absent from both lists cannot be recovered by
fusion alone.

## Recall and application

Compute C's fused score without running the code. If each branch returns only one
item, how do the fused tie and final cutoff affect C? Explain why a strict SKU
lookup might need an exact field constraint rather than trusting hybrid ranking.

## References

- [Elasticsearch: RRF definition and rank constant](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)
- [Sentence Transformers: retrieve and rerank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)
