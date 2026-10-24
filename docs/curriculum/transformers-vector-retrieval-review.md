# Transformers, Vector Databases, and Retrieval Systems

## Publication scope

This requested three-topic batch follows topics 2, 10, and 11 of root
`remaining-ai-topics-roadmap.md`, using the existing permanent curriculum IDs.

| Topic ID | Folder under `content/subjects/ai-engineering/` | Lessons | Questions |
| --- | --- | ---: | ---: |
| `ai-transformers` | `transformers/` | 4 | 8 |
| `ai-vector-databases` | `vector-databases/` | 4 | 8 |
| `ai-retrieval-systems` | `retrieval-systems/` | 4 | 8 |

Each lesson has two primary interview questions. Questions include canonical
answers, supporting reasoning, evaluation rubrics, follow-ups, and a misconception.
Lesson prerequisites reuse published material. Topic priorities and curriculum
orders are preserved; planning status becomes `in-progress` using the existing
catalog convention for topics with published material.

## Coverage map

Each row also introduces a stable concept with the same suffix as the lesson ID
(`lesson-ai-scaled-attention` → `concept-scaled-attention`, for example), except
`lesson-ai-cached-decoding`, which maps to `concept-kv-cache`, and
`lesson-ai-approximate-indexes`, which maps to `concept-ann-indexes`.

| Lesson ID | Mechanisms and worked checks |
| --- | --- |
| `lesson-ai-scaled-attention` | Q/K/V, square-root scaling, row softmax, three-token attention, causal/padding masks, future-perturbation leakage test |
| `lesson-ai-transformer-blocks` | Learned head projections, split/transpose/merge, positions and RoPE, residuals, pre/post normalization, token-wise FFNs |
| `lesson-ai-transformer-variants` | Encoder/decoder visibility and objectives, shifted labels, rectangular cross-attention and source padding |
| `lesson-ai-cached-decoding` | Prefill/decode, per-layer cache, cached/full equivalence, mask offset, grouped-query head count, memory and complexity |
| `lesson-ai-exact-vector-search` | Storage/encoder contracts, exact cosine KNN, invalid vectors, tie policy, raw storage and scan cost |
| `lesson-ai-approximate-indexes` | HNSW/IVF/PQ distinctions, actual toy IVF assignment/probing, boundary miss, ANN recall, timed operations, realistic benchmark design |
| `lesson-ai-filtered-vector-search` | Prefilter/integrated/post-filter semantics, candidate starvation, trusted tenant predicates, metadata indexes and revocation |
| `lesson-ai-vector-lifecycle` | Versioned upserts, tombstones, stale-event rejection, atomicity, chunk cleanup, visibility, backfill/replay and coordinated model/index migration |
| `lesson-ai-lexical-retrieval` | Inverted postings, BM25 implementation, tf/df, saturation and length normalization, identifier analysis and phrase positions |
| `lesson-ai-hybrid-retrieval` | Independent dense scoring plus BM25, shared four-document corpus, deduplication, calculated RRF, score-scale/calibration trade-offs |
| `lesson-ai-retrieval-reranking` | Bi-/cross-encoder distinction, fixed-score adapter, candidate ceiling, shortlist/length/latency budgets and timeout semantics |
| `lesson-ai-retrieval-evaluation` | Human relevance versus ANN agreement, Recall/MRR/nDCG, graded trace, incomplete judgments, no-answer cases, query slices and stage attribution |

## Source review and teaching boundaries

- Read the original Transformer paper's full HTML, including scaling assumptions,
  multi-head shapes, cross-attention, post-normalization, masking, and positions.
  The lesson explicitly distinguishes its illustrative pre-norm block from the
  paper's post-norm architecture.
- Reviewed PyTorch's scaled-dot-product attention mask contract and Hugging Face's
  cache explanation. The examples use explicit allowed-key masks, avoiding an
  assumption that a nonsquare local causal triangle automatically includes a prefix.
- Reviewed BERT, RoFormer, and FlashAttention abstracts for their respective
  architectural claims. The lessons do not reuse their benchmark numbers as local
  measurements or equate memory-efficient attention with linear full-attention work.
- Read Faiss's index overview for flat/IVF/HNSW parameters, memory, and operation
  differences, and Qdrant filtering/distributed-deployment documentation for metadata
  conditions and implementation-dependent update/replication behavior.
- Reviewed Elastic's BM25 parameters and RRF formula/default rank constant,
  Sentence Transformers' retrieve-and-rerank explanation, and Stanford's ranked
  evaluation chapter. Reranker score ranges and relevance calibration remain
  model-specific; BM25 formula variants are explicitly declared.

The IVF demonstration is a one-dimensional, manually partitioned index, not an
optimized HNSW/Faiss benchmark. It measures local operation timings but makes no
speed claim from three points. Dense vectors and reranker scores are labeled
synthetic fixtures. The version-fence example is single-writer and explicitly
requires atomic conditional writes or serialization in a distributed implementation.
The cache example verifies an attention operation, not a complete trained LLM.

Equations and diagrams use explained plain-text notation compatible with the
current Markdown renderer. Code blocks scroll within the lesson on narrow screens.

## Verification results

- `npm run content:check`: passes, with 48 lessons and 290 total questions
  (103 Markdown questions) in the repository catalog at verification time.
- `python3 scripts/check-ai-retrieval-examples.py`: all 12 actual Python fences
  pass independently in isolated-mode subprocesses with assertions and exact
  expected output. NumPy version used: 2.3.5. No paid calls or model downloads.
- `npm test`: 46/46 existing tests pass.
- `npm run lint`, `npm run build`, and `git diff --check`: pass. The production
  build emits its existing large-chunk advisory and completes successfully.
- Chrome headless against a production preview on port 4191, using an isolated
  temporary profile: desktop 1280×900 and mobile emulation 390×844 both pass.
- At both viewports: all three topic dialogs show four lesson links and eight
  question links; all twelve lesson routes load their Python example and two
  practice links; contents are expanded on desktop and collapsed on mobile;
  no document-level horizontal overflow.
- All 24 question practice routes hide rubrics before reveal and show supporting
  reasoning and evaluation rubrics after reveal, at both viewport sizes. No browser
  error logs or uncaught JavaScript exceptions were recorded.
- Inspected representative desktop/mobile screenshots: prose is legible and the
  Python block stays inside its horizontally scrollable container.

These browser results use Chromium mobile emulation, not a physical-device test.
