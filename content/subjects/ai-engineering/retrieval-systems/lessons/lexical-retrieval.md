---
id: lesson-ai-lexical-retrieval
kind: lesson
topicId: ai-retrieval-systems
title: Inverted Indexes, Analysis, and BM25
summary: Build term postings, calculate BM25 with term-frequency saturation and length normalization, and preserve identifiers during text analysis.
difficulty: medium
status: published
revision: 1
order: 480
tags: [retrieval, inverted-index, bm25, lexical]
conceptIds: [concept-lexical-retrieval]
prerequisiteIds: [lesson-ai-text-tokenization]
---

## Retrieve words without scanning every document

An **inverted index** maps a term to postings: document IDs, term frequencies, and
optionally positions. The forward view is document → terms; the inverted view is
term → matching documents. Query processing combines postings and scores candidates.
Positions support phrase constraints, while term membership alone does not prove
two words occurred adjacently.

```text
documents → analyzer → term counts + lengths → term → postings
query → same compatible analyzer → matching postings → BM25 → ranked candidates
```

Consider four small support documents, reused conceptually throughout this module:
A: “reset password account”; B: “recover login credentials”; C: “error zx-42
connection”; D: “password password security guide.” Literal overlap helps match
“password” and the exact error code. It misses B for “password” unless analysis or
query expansion connects the vocabulary.

## Score with saturation and length normalization

One common positive-IDF BM25 variant is:

```text
score(q,d) = sum over distinct query terms t of
  IDF(t) * tf(t,d)*(k1+1) / (tf(t,d) + k1*(1-b+b*len(d)/avglen))
IDF(t) = ln(1 + (N-df(t)+0.5)/(df(t)+0.5))
```

N is document count, df counts documents containing a term, tf counts its occurrences
in a document, and lengths count analyzed tokens. `k1 > 0` controls term-frequency
saturation; `b` between 0 and 1 controls length normalization. More repetitions give
diminishing returns rather than unlimited linear score growth. The length factor
reduces the advantage of long documents with more opportunities to match.

BM25 variants differ in IDF and query weighting. The implementation below ignores
repeated query-term weighting and uses explicit `k1=1.2,b=0.75`. Do not expect its
floating-point scores to reproduce every Lucene implementation or distributed
index's statistics exactly.

## Build and inspect a small index

```python
from collections import Counter, defaultdict
from math import log
import re

docs = {'A': 'reset password account', 'B': 'recover login credentials',
        'C': 'error zx-42 connection', 'D': 'password password security guide'}
def analyze(text):
    return re.findall(r'[a-z0-9]+(?:-[a-z0-9]+)*', text.lower())

counts = {doc: Counter(analyze(text)) for doc, text in docs.items()}
lengths = {doc: sum(terms.values()) for doc, terms in counts.items()}
postings = defaultdict(dict)
for doc, terms in counts.items():
    for term, tf in terms.items():
        postings[term][doc] = tf
n, avglen = len(docs), sum(lengths.values()) / len(docs)
def bm25(query, k1=1.2, b=.75):
    scores = defaultdict(float)
    for term in set(analyze(query)):
        hits = postings.get(term, {})
        idf = log(1 + (n-len(hits)+.5)/(len(hits)+.5))
        for doc, tf in hits.items():
            norm = k1 * (1-b+b*lengths[doc]/avglen)
            scores[doc] += idf * tf*(k1+1)/(tf+norm)
    return sorted(scores, key=lambda doc: (-scores[doc], doc))

assert bm25('password') == ['D', 'A']
assert bm25('ZX-42') == ['C']
assert bm25('unseen') == []
assert postings['password'] == {'A': 1, 'D': 2}
assert analyze('ZX-42') == ['zx-42']
print('password: D, A; ZX-42: C; unseen: no lexical matches')
```

Here df(password)=2, IDF is about 0.6931, and avglen=3.25. A scores about 0.715;
D scores about 0.895. D's repetition wins despite its greater length, but doubling
term frequency does not double its score.

## Match analyzer choices to the query distribution

Lowercasing and hyphen preservation are deliberate choices here. They are not a
universal multilingual tokenizer. Stemming, accent folding, stop words, synonyms,
and language segmentation change matches and length statistics. Index and query
analysis must be compatible. For an identifier such as `ZX-42`, a keyword/exact
field can enforce whole-value lookup; ordinary BM25 text matching is not a
substitute for an exact equality constraint.

Evaluate natural-language questions separately from codes, names, versions, and
quoted phrases. Preserve original source text and use fields suited to each case.
If exact-code searches fail, inspect analyzed terms and postings before increasing
embedding dimensions or changing a reranker.

## Recall

Distinguish tf from df. Explain why a query absent from every posting returns no
lexical results. What information would the index need to enforce “reset password”
as an exact phrase rather than two independent matching terms?

## References

- [Stanford IR book: inverted indexes](https://nlp.stanford.edu/IR-book/html/htmledition/a-first-take-at-building-an-inverted-index-1.html)
- [Elasticsearch: BM25 k1 and b](https://www.elastic.co/docs/reference/elasticsearch/index-settings/similarity)
