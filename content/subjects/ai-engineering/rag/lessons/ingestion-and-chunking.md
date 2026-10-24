---
id: lesson-ai-rag-ingestion
kind: lesson
topicId: ai-rag
title: Parse, Chunk, and Preserve Document Provenance
summary: Turn source revisions into retrievable evidence units without losing headings, scope, or the source locations needed for citations and updates.
difficulty: medium
status: published
revision: 1
order: 520
tags: [rag, ingestion, chunking, provenance]
conceptIds: [concept-rag-ingestion]
prerequisiteIds: [lesson-ai-vector-lifecycle, lesson-ai-lexical-retrieval]
---

## Retrieval starts before the query

Retrieval-augmented generation supplies external evidence to an answer generator at
request time. The online model cannot reliably reconstruct a table or exception
that an offline parser already discarded. Treat ingestion as a versioned data
pipeline with observable outputs, rather than a one-time “upload and embed” step.

```text
source revision → parse structure → normalize → split evidence units
                → attach provenance + eligibility → lexical/vector indexes
source update   → replace revision manifest → remove obsolete chunk IDs
```

For digital PDFs, extract text with page/layout information. Scans need OCR; reading
order, merged cells, headers, and footnotes need review. HTML navigation can dominate
the main text if boilerplate is not removed. Keep the original source or immutable
reference so parsing errors can be inspected. The example below starts from already
parsed sections; it does not pretend to parse arbitrary PDFs.

## Choose the unit of evidence

A fixed token window is simple but can split a sentence, code block, or table row.
Heading/paragraph-aware chunks preserve structure but can vary greatly in size.
Large chunks preserve context and consume more budget; tiny chunks may omit the
condition needed to interpret a rule. Overlap can reduce boundary misses while
duplicating text, index storage, and retrieved results.

Keep source title, section path, page/span, revision, effective dates, tenant/access
scope, and parent identity. Enrichment can prepend a heading for retrieval without
altering the authoritative source quote. Model-written summaries or hypothetical
questions are derived search aids, not automatically primary evidence.

## Create stable revision-scoped chunk identities

```python
from hashlib import sha256

source = {
    'id': 'returns', 'revision': 2, 'tenant': 'A',
    'sections': [
        {'heading': 'Window', 'page': 1, 'text': 'Returns are accepted within 30 days.'},
        {'heading': 'Exception', 'page': 2, 'text': 'Final-sale items cannot be returned.'},
    ],
}

def ingest(doc):
    chunks = []
    for ordinal, section in enumerate(doc['sections']):
        # Offsets would refer to this normalized section, not original PDF bytes.
        text = ' '.join(section['text'].split())
        if not text:
            continue
        identity = f"{doc['id']}:{doc['revision']}:{ordinal}:{text}"
        chunk_id = sha256(identity.encode()).hexdigest()[:16]
        chunks.append({
            'id': chunk_id, 'source_id': doc['id'], 'revision': doc['revision'],
            'tenant': doc['tenant'], 'heading': section['heading'],
            'page': section['page'], 'text': text,
            'search_text': section['heading'] + ': ' + text,
        })
    return chunks

first, again = ingest(source), ingest(source)
assert first == again and len(first) == 2
assert len({row['id'] for row in first}) == 2
assert first[1]['page'] == 2 and 'Final-sale' in first[1]['text']
new_revision = ingest({**source, 'revision': 3})
assert not ({row['id'] for row in first} & {row['id'] for row in new_revision})
print('2 reproducible chunks; source pages retained; revisions have distinct IDs')
```

These truncated hashes illustrate identity construction, not collision-proof global
IDs. A production scheme must handle collisions and namespace tenants/sources
unambiguously. A revision manifest lists all chunk IDs for one source version;
switch the active manifest and retire old chunks when rechunking changes boundaries.

## Review the corpus, not just the parser's success code

Inspect samples with tables, Unicode, multilingual text, repeated headers, and
cross-page exceptions. Record parse warnings, empty documents, chunk sizes, duplicate
rates, and source/index lag. A successful HTTP upload is not proof that usable
evidence is searchable. Compare retrieval using representative questions when
choosing chunk size; there is no universally correct “500 tokens with 50 overlap.”

An embedding model's tokenizer limit and a generator's context window are separate
constraints. Use the encoder's actual counting/preprocessing contract for indexing.
Whitespace normalization in the example changes character offsets, so preserve an
offset map if citations must highlight exact original spans.

## Recall and application

How would an exception on page two survive chunking? Why does an upsert of new
chunk IDs not remove obsolete chunks? Design an ingestion review case where a
table's column association matters more than raw extracted word count.

## References

- [LangChain: retrieval building blocks and RAG architectures](https://docs.langchain.com/oss/python/langchain/retrieval)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
