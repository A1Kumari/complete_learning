# AI Engineering Part 1: four requested topics

## Scope

The user explicitly requested a four-topic batch after the Deep Learning review.
The specification is root `ai-engineering-part1-blueprint.md`, topics 9–12, together
with the overlapping coverage requirements in `remaining-ai-topics-roadmap.md`.
All existing subject/topic IDs, orders, and priorities are retained. No placeholder
lessons are created for other topics.

| Existing topic | Lessons | Questions | Active folder |
| --- | ---: | ---: | --- |
| `ai-tokenization-embeddings` | 3 | 6 | `tokenization/` |
| `ai-llm-fundamentals` | 4 | 8 | `llm-fundamentals/` |
| `ai-llm-api-integration` | 4 | 8 | `llm-api/` |
| `ai-prompt-engineering` | 4 | 8 | `prompting/` |

All folders are under `content/subjects/ai-engineering/`. Every lesson has two
associated standalone Markdown questions with answers, supporting reasoning,
follow-ups, misconception, and evaluation rubric. Relationships are derived from
existing metadata rather than parallel runtime catalogs.

## Lesson and concept mapping

- `lesson-ai-text-tokenization` → `concept-tokenization`: character/word/subword,
  BPE trace, WordPiece, normalization, special tokens, Unicode, token budgets.
- `lesson-ai-token-representations` → tokenization + `concept-token-representations`:
  table lookup, `(B,L,D)` shapes, masks, positional and contextual distinctions.
- `lesson-ai-sentence-embeddings` → `concept-text-similarity` + token representations:
  pooling, cosine, ranking, zero vectors, retrieval evaluation and model compatibility.
- `lesson-ai-language-model-pretraining` → `concept-language-modeling` + existing
  self-supervision: shifted targets, causal mask, cross-entropy/perplexity, leakage.
- `lesson-ai-instruction-tuning-alignment` → language modeling +
  `concept-preference-optimization`: SFT, RLHF, DPO objective arithmetic, proxy limits.
- `lesson-ai-llm-inference` → `concept-llm-inference`: logits, softmax, temperature,
  top-k/top-p, cache, context/output budget, stop conditions.
- `lesson-ai-llm-capabilities-limitations` → `concept-llm-reliability`: hallucinations,
  evidence and tool interventions, evaluated model comparison with fictional fixtures.
- `lesson-ai-model-api-lifecycle` → `concept-model-api-lifecycle`: real request shape,
  offline adapter tests, opt-in live example, auth, output items, usage/errors/deadlines.
- `lesson-ai-api-structured-responses` → `concept-structured-model-output`: Responses
  `text.format`, strict schema, semantic acceptance, null/refusal/incomplete handling.
- `lesson-ai-api-tool-calling` → `concept-model-tool-calls`: proposal/execution,
  server identity, validation, correlation, bounded loop, side-effect idempotency.
- `lesson-ai-api-streaming` → `concept-model-streaming`: event assembly, SSE boundary
  distinctions, multiple item buffers, lifecycle, cancellation, partial failure.
- `lesson-ai-prompt-instruction-design` → `concept-prompt-contracts`: task repair,
  channel authority, evidence, missing values, explicit acceptance contract.
- `lesson-ai-prompt-examples-patterns` → `concept-prompt-examples`: zero/few-shot,
  representative demonstrations, decomposition, checkable artifacts and trade-offs.
- `lesson-ai-prompt-templates` → `concept-prompt-templates` + prompt contracts:
  serialized dynamic data, trusted allowlisted configuration, versions and budgets.
- `lesson-ai-prompt-evaluation` → `concept-prompt-evaluation`: fixture evaluation,
  format versus semantics, paired regressions, leakage, variability, failure taxonomy.

API integration uses four lessons rather than the blueprint's provisional two;
the blueprint explicitly allowed splitting tool calling and streaming. Existing
Transformers/Math topics remain planned; conceptual prerequisites are explained
without inventing dependency IDs or linking to unpublished lessons.

## Source and technical review

Retrieved Hugging Face BPE/WordPiece course sections, causal training chapter, and
generation guide; Sentence Transformers similarity documentation; Sentence-BERT,
InstructGPT, and DPO abstracts; current OpenAI text, structured-output, function-call,
and streaming guides; official Python SDK README. The existing verified Transformer
paper supplies background embedding/masking mechanics.

Key qualifications retained: token IDs are not vectors; pooling is not automatically
semantic; WordPiece trainer reconstruction is not a universal specification;
byte-complete tokenization does not imply one character per token; predictive loss
is not factuality; low temperature does not verify truth; DPO still needs preferences;
provider parameters vary; JSON validity is not evidence; function proposals are not
execution; call IDs are not business idempotency keys; stream chunks are not tokens;
prompt delimiters/JSON escaping are not authorization; fictional outputs and offline
fixtures are never presented as actual model evaluations.

No hardcoded provider model availability, pricing, or claimed live success. The
optional SDK call is disabled unless the reader explicitly supplies configuration
and opts in. SDK docs were checked as current interfaces, not represented as a
live integration test or a guarantee about every installed SDK version.

## Rendering and reproducible checks

The batch uses supported Markdown, explained text equations, and fenced text flow
diagrams, preserving the current static build with no new renderer dependency.
`scripts/check-ai-part1-examples.py` executes all 16 actual Python fences independently,
checks assertions and output, disables live calls, and removes provider credentials
from child environments. NumPy is only needed for the token lookup example.

### Verification results

- `npm run content:check`: passes. Catalog total is 242 questions (55 Markdown)
  and 24 lessons; this batch adds exactly 30 questions and 15 lessons.
- `python3 scripts/check-ai-part1-examples.py`: all 16 blocks pass, including
  expected numerical output, invalid fixtures, request status failures, cross-tenant
  tool rejection, interrupted-stream rejection, and prompt evaluator fixtures.
  The optional live-call block reports `live request skipped`.
- `npm test`: 46/46 pass, including historical identity and personal-data tests.
- `npm run lint`, `npm run build`, `git diff --check`: pass. Vite reports the
  existing eager-bundle size advisory; production build completes successfully.
- Chrome headless against the dedicated production preview on port 4190, at
  1280×900 and 390×844 mobile emulation: all four topic panels show their expected
  counts; all 15 lesson routes load Python/text content; Contents is expanded on
  desktop and collapsed on mobile; two practice links per lesson render; Back
  returns to the subject topic grid; no document-level horizontal overflow.
- Checked each lesson's first practice link at both sizes, including its return
  link. Checked all 30 question recall routes: answers are hidden before Reveal,
  then Supporting reasoning and Evaluation rubric render. No uncaught JavaScript
  or browser error-log entries during the run.
- Visually inspected mobile sampling-code and desktop streaming-code screenshots.
  Long code lines scroll locally inside the existing code block rather than
  expanding the page. This batch uses text flow diagrams rather than remote images
  or unsupported Mermaid/LaTeX source.

Browser results describe Chromium mobile emulation, not Safari or a physical-device
test. Local fixtures verify examples and integration contracts; no real provider
requests or claims about measured commercial-model quality are part of verification.
