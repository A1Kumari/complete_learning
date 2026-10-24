# Context Engineering, Structured Output, and Embeddings

## Requested scope and stable identities

This user-requested batch follows topics 7–9 of root
`remaining-ai-topics-roadmap.md`. Existing topic IDs, subject, priorities, and
catalog orders are preserved. No unrelated topic or placeholder is published.

| Existing topic | Lessons | Questions | Active path below `content/subjects/ai-engineering/` |
| --- | ---: | ---: | --- |
| `ai-context-engineering` | 4 | 8 | `context/` |
| `ai-structured-output` | 4 | 8 | `structured-output/` |
| `ai-embeddings` | 4 | 8 | `embeddings/` |

Every lesson has two linked standalone questions with concise answers, supporting
reasoning, two follow-ups, misconception, and evaluation rubric. The reader derives
question lists from `lessonId`. New lessons reference existing published foundations
rather than duplicating the Part 1 introductions or inventing prerequisite IDs.

## Coverage and permanent lesson-to-concept mapping

| Lesson ID | New concept | Main worked mechanism |
| --- | --- | --- |
| `lesson-ai-context-selection` | `concept-context-selection` | Eligibility before ranking; tenant/date-sensitive policy selection |
| `lesson-ai-context-packing` | `concept-context-budgeting` | Complete-request counter injection, mandatory budget, whole-item greedy packing |
| `lesson-ai-context-memory` | `concept-context-memory` | Corrections, expiry, deletion, isolation; no stale preference resurrection |
| `lesson-ai-context-evaluation` | `concept-context-evaluation` | Omission versus evidence-use analysis; controlled position and distractor tests |
| `lesson-ai-output-schema-contracts` | `concept-output-contracts` | Required/nullable/closed schema, constrained generation, versioned semantics |
| `lesson-ai-output-typed-validation` | `concept-output-validation` | Real strict Pydantic validation plus evidence/business acceptance |
| `lesson-ai-output-recovery` | `concept-output-recovery` | Bounded structural repair; semantic review; refusal/incomplete/exhaustion states |
| `lesson-ai-output-stream-acceptance` | `concept-output-stream-acceptance` | Complete-item plus terminal response gating before accepting JSON |
| `lesson-ai-embedding-objectives` | `concept-embedding-objectives` | Stable contrastive-loss calculation; false/hard negatives; bi-encoder distinction |
| `lesson-ai-embedding-metrics` | `concept-embedding-metrics` | NumPy dot/cosine/L2 winners and unit-vector equivalence |
| `lesson-ai-embedding-input-contracts` | `concept-embedding-input-contracts` | Task prefixes, explicit length rejection, multilingual/domain evaluation |
| `lesson-ai-embedding-evaluation-migration` | `concept-embedding-evaluation` | Recall@k/MRR, drift diagnosis, compatible-space migration |

The modules deepen context selection/memory, typed-output reliability, and whole-text
representations. They preserve boundaries with future RAG, Vector Databases,
Retrieval Systems, Security, and Streaming AI Systems topics.

## Source review and qualifications

- Read Anthropic's context-engineering article and OpenAI conversation-state guide.
  Separate provider behavior from broader engineering advice. Persistent state
  does not eliminate input accounting or make summaries authoritative.
- Verified Lost in the Middle's reported position-sensitivity findings from its
  abstract; lessons present them as results for the studied models/tasks, not a
  universal behavior of all current systems.
- Read official JSON Schema object semantics and Pydantic v2 model/strict-mode docs.
  Required and nullable are independent; extra-field policies need nested scope;
  strictness differs by input mode/type; construct APIs bypass validation.
- Structured-output and streaming interfaces follow the official OpenAI guides
  already reviewed for the API module. The new examples normalize lifecycle events
  explicitly rather than presenting invented fixture names as wire-level API names.
- Reviewed Sentence Transformers metric documentation from its source and the
  multilingual-e5-base model card's usage/FAQ/limitations sections. Prefixes,
  normalization, pooling, language caveats, and 512-token limit are model-specific.
- Verified NumPy norm behavior in official documentation and MTEB's multi-task
  evaluation findings from the paper abstract. Published benchmark numbers are not
  reused as claimed measurements of these teaching examples.

Synthetic token costs and word counters are clearly labeled test doubles. A real
request counter must use the model's actual serialization/tokenizer. Candidate
rankings, contrastive scores, context outcomes, and policy sources are deterministic
fixtures, not fabricated live model experiments. No paid calls or model downloads.

## Rendering and example environment

Uses existing YAML/Markdown contracts, explained plain-text equations, tables, and
text flow diagrams. No schema/compiler/renderer dependency extension is required.
Pydantic and NumPy are local teaching dependencies only; the React app gains none.

Run `python3 scripts/check-ai-context-examples.py` with NumPy and Pydantic v2.
`scripts/requirements-ai-context.txt` records tested versions (2.3.5 and 2.13.4).
The checker reads all twelve actual Python fences, runs independent `-I`
subprocesses with assertions enabled, and verifies exact expected printed results.

Verification outcomes are recorded after execution below.
