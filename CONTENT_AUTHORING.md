# Content foundation and curriculum

## Scope

The original pilot contained **190 questions**: 187 legacy JSON questions and three
Markdown questions (`os-q001`–`os-q003`), plus one processes-and-threads lesson.
Additional topic-by-topic educational modules now extend that foundation. The
compiler reports current counts; the numbers above describe the historical pilot.

Open **Lessons → Processes, threads, and the execution lifecycle** on the OS tab,
or visit `/#/lesson/lesson-os-processes-threads`. Question cards also have a
**Read lesson** link. Hash URLs work on static Vercel hosting without server routes.

## Sources and identities

```text
content/subjects.json                 subject IDs and presentation metadata
content/topics.json                   curriculum topics, e.g. os-processes → os
content/concepts.json                 reusable concept IDs
content/subjects/os/processes/
  lessons/processes-and-threads.md     lesson with YAML metadata
  questions/os-q001.md                 canonical interview question
  assets/thread-memory.svg            local diagram
content/schemas/*.schema.json          JSON Schema validation contracts
content/compatibility/*.json           frozen migration baselines, NOT active content
src/data/*.json                        remaining legacy question sources
development-curriculum.md              authoritative Development outline reference
```

Every entity has a unique permanent ID. IDs do not depend on wording, filenames,
array position, or headings. Do not rename/recycle IDs during conversion. The
`custom-` namespace belongs to personal questions. Global duplicate IDs fail the
build, including a question appearing in both legacy JSON and Markdown.

`content/topics.json` is the single source of truth for curriculum outlines. Do not
create a parallel active curriculum file. Each topic records `priority` (`Essential`,
`Important`, or `Advanced`), a short `description`, a human-readable `scope` list,
an optional `group`, and `planningStatus`. AI Engineering topics additionally record
their learning `phase`, `phaseTitle`, `prerequisiteIds`, and (where applicable) a
hands-on `milestone`. `planned` means the outline exists without published material;
`in-progress` means some published material exists; `pending-planning` is used for
high-level areas that still need detailed curriculum planning. The UI derives actual
lesson and question counts from compiled content and never treats a planned topic as
completed.

System Design priorities are intentionally `null` because the reference curriculum
does not supply them. Do not turn inferred ordering into source-provided priority;
propose and review those values separately first. DevOps group names and priorities
come directly from the reference curriculum and should be preserved.

Subjects and topics are distinct. `os-processes` is a topic whose `subjectId` is
`os`. Existing personal custom questions still have `topicId: "os"` because that
field historically means a subject bucket. The compatibility adapter preserves
that convention; it never writes granular topic IDs into personal data.

## Add a topic

Add a stable record to `content/topics.json`. Keep the ID lowercase and permanent;
the ID is the link between the curriculum outline and future lessons/questions.

```json
{
  "id": "python-example-topic",
  "subjectId": "python",
  "title": "Example topic",
  "order": 130,
  "priority": "Important",
  "description": "A short explanation of the topic's purpose.",
  "scope": ["first concept", "second concept"],
  "planningStatus": "planned"
}
```

AI topics should make their dependency chain explicit:

```json
{
  "phase": 3,
  "phaseTitle": "Building LLM Applications",
  "prerequisiteIds": ["ai-llm-api-integration"],
  "milestone": "Ship a structured-output API with validation and retries."
}
```

Use `pending-planning` when only a high-level outline is supported by the curriculum
reference. Do not add lesson-shaped placeholders. The compiler rejects unknown subject
references, duplicate IDs, invalid priorities/statuses, and malformed scope metadata.

## Add a lesson

1. Reuse an existing topic or add one to `topics.json` with a unique ID, subject ID,
   title, numeric order, priority, description, scope, and planning status. Add
   genuinely reusable lesson concepts to `concepts.json` when they need stable links.
2. Create a `.md` file beneath `content/subjects/<subjectId>/`. The folder's subject
   must agree with the metadata topic's subject. Topic subfolders are organizational.
3. Begin with YAML frontmatter, for example:

```yaml
---
id: lesson-os-example
kind: lesson
topicId: os-processes
title: An example lesson
summary: What the reader will understand afterward.
status: draft
revision: 1
order: 20
tags: [concurrency]
conceptIds: [concept-process]
prerequisiteIds: [lesson-os-processes-threads]
relatedIds: [os-q001]
---
```

4. Write ordinary Markdown starting with `##` headings. The title is metadata, so
   do not repeat it as `#`. A lesson needs useful headings, not a fixed collection
   of empty template sections. Explanation, intuition, examples, applications,
   qualifications, recall prompts, and sources are suggestions, not mandatory slots.
5. Use `status: published` only after reviewing the rendered result and content.
Drafts are validated but excluded from the public catalog and payloads. Published
content cannot depend on/link to a draft. Use `npm run dev:drafts` for a loopback-only
preview of draft content; draft mode is never enabled by production builds and serves
draft payloads from memory.

Required common fields: `id`, `kind`, `topicId`, `status`, `revision`, `order`.
Lessons also require `title` and `summary`. Optional fields include `difficulty`,
tags, concept IDs, lesson prerequisites, related lesson/question IDs, and anchors.
Unknown metadata fields fail validation, including personal notes/status fields.

`order` affects display, never identity. Revision is an explicit content revision;
it does not reset user progress. Prerequisites must reference lessons and form an
acyclic graph. Related IDs reference lessons or questions, including legacy ones.

## Add an interview question

Create a separate Markdown file with a new, permanent ID:

```yaml
---
id: os-thread-example
kind: question
topicId: os-processes
lessonId: lesson-os-processes-threads
prompt: "What does joining a thread do?"
difficulty: easy
frequent: false
status: draft
revision: 1
order: 31
tags: [concurrency]
conceptIds: [concept-thread]
relatedIds: [os-q001]
followUps:
  - "How is joining different from locking?"
misconception: "Joining is not mutual exclusion."
---
```

The body must begin with `## Answer` (blank lines before it are allowed), followed by the canonical answer.
Use optional `###` subsections within that answer, not additional `##` sections
that an adapter might silently omit. `prompt` and `difficulty` are required;
`lessonId`, frequent, follow-ups, and misconception are optional. A primary lesson
must share the question's topic. A lesson's interview-question list is derived
from question metadata, not maintained twice.

The compatibility adapter maps prompt → `q`, compiled answer → `a`, difficulty →
`d`, frequent → `freq`, follow-ups → `cross`, and misconception → `trap`. Follow-ups
and misconception are plain text in the existing question UI; no HTML/Markdown is
executed from these metadata fields. The pilot retains even their original inline
markup text for fidelity. Existing question simplifications (for example the Go
goroutine statement in `os-q001`) are deliberately not silently corrected by
mechanical conversion. The new lesson explains the relevant qualifications.

## Links, images and code

- Standard relative links such as `../questions/os-q001.md` resolve at build time
  to permanent-ID hash URLs. In-document links such as `#memory-model` are checked.
- Default heading anchors are lower-case slugs. Referenced headings can have
  explicit stable IDs in frontmatter: `anchors: { memory-model: "Heading text" }`.
  Changing that heading's wording only requires updating the mapping value.
- Use `relatedIds` for relationships to legacy questions without a Markdown file.
- Images must be local and have meaningful alt text. Lesson images are wrapped with an accessible
  full-size link in rendered output. Missing assets, escaped
  content-root paths, absolute/protocol-relative paths, queries, remote images,
  unsafe URL schemes, and active/external SVG content (including style blocks) are rejected. Use simple
  hyphenated filenames without spaces. Images are emitted with fingerprinted URLs.
- Use fenced code blocks with a language label. Code is displayed, never executed.
  Raw HTML is escaped in new Markdown; MDX, embedded scripts, and iframes are not
  supported. Legacy/custom HTML retains its existing compatibility path.
- External `https`, `http`, and `mailto` links are allowed. Builds validate syntax
  and local targets, not the factual accuracy or continued availability of websites.

## Convert another existing question (after pilot approval)

Do not convert the remaining subjects in bulk yet. A later conversion should:

1. Keep the question's exact existing ID, prompt, difficulty, frequency, follow-ups,
   misconception, and substantive answer. Separate educational rewrites into review.
2. Retain its exact original published fields, original subject and one-based order
   in a frozen `content/compatibility/*.json` snapshot **before** removing the JSON
   entry. Never edit snapshots to reflect new prose. They are migration/test
   artifacts, not a second active source.
3. Remove the legacy entry and add the published Markdown source in the same change.
   Builds reject duplicate active IDs; they do not choose an arbitrary override.
4. Use its original order for a mechanical move. Baseline positions preserve the
   remaining legacy questions' placement even for non-contiguous conversions.
5. Add fidelity, stable-ID, mixed-source, and browser checks before merging.

Never regenerate `src/legacyReference.js`. Old browser snapshots must still match
their original identities. The baseline comparison also prevents harmless HTML
serialization changes from generating false recovery warnings. Genuine differing
user content is still retained in Migration 1 recovery/backups.

## Build and validation

```bash
npm run content:check   # Validate without writing generated output
npm run content:build   # Validate and generate static output
npm run content:new -- question os-thread-example --topic os-processes --lesson lesson-os-processes-threads --prompt "What does joining a thread do?"
npm run dev:drafts      # Loopback-only local preview, including drafts
npm run dev             # Compile initially; watch content and legacy data changes
npm test                # Generate content, then run pipeline + personal-data tests
npm run lint
npm run build           # Compile/validate automatically through Vite
npm run preview
```

The compiler uses build-time `yaml`, `markdown-it`, and `ajv`. Parsers are not
shipped to the browser. It produces ignored `src/generated/catalog.json` and
`public/learning-content/` assets. Do not edit or commit generated files. Validation
finishes before writes; invalid edits leave the last valid generated output in
place and show a Vite error overlay. The next valid change rebuilds and reloads. The scaffold
command validates a new draft before writing it and refuses `custom-` IDs, duplicate IDs,
unknown topics, and mismatched primary lessons.

The existing bank still eagerly loads its question answers for compatibility.
Detailed lesson HTML is fetched on demand from static fingerprinted JSON; headings,
metadata, and plain search text are in the catalog. This is a foundation, not yet
a global lesson search or a new assessment engine. Generated payloads and images
are copied into Vite's `dist/`, which is the Vercel static output directory.

Personal storage remains `cs-learning-personal-v1`. Notes, progress, custom
questions, deletion markers, legacy originals, and export/import remain separate
from all generated content. Lesson reading does not imply mastery or save new
personal fields. Future lesson progress/spaced repetition needs an explicit schema
upgrade rather than adding fields to the current strict validator.

### Small DSA maintenance fixes

The DSA table now uses the same filtered list as its header count. Template
descriptions fall back to the existing `example` field. Attempts now count
transitions into Practicing, not every repeated status click or mastery change;
previously stored attempt counts are retained, not recalculated.

For AI-assisted drafting, supply the schema, existing IDs/concepts, and one topic's
learning objectives. Validate a small batch, check claims and references, review
code examples and rendered diagrams, then publish. Structural validation does not
replace educational review; no runtime AI service is involved.

### AI Engineering topic-by-topic publication

`remaining-ai-topics-roadmap.md` (repository root) is the specification for the 39
subsequent AI Engineering topics, starting with Deep Learning Architectures. It is
an authoring reference, not a second active catalog. Reuse `ai-deep-learning` for
that topic and preserve the existing IDs for later topics. Its four authored
source lessons are in root `deep-learning-architectures-lessons.md`; adapted active
content lives under `content/subjects/ai-engineering/deep-learning/`.

Unless the user explicitly requests a multi-topic batch, publish one complete topic,
verify its technical sources, run examples and browser checks, then stop for
educational review before proceeding. Do not turn roadmap
rows or planning labels into placeholder lessons or permanent numeric topic IDs.
Use existing published prerequisite lessons when applicable; explain conceptual
prerequisites in the text when their dedicated lessons have not been authored.

The current renderer does **not** execute Mermaid or LaTeX. For this module the
three authored Mermaid flowcharts are faithfully adapted to local static SVGs
with meaningful alt text and adjacent text equivalents. Equations use readable
Unicode/plain-text notation in fenced `text` blocks, with every symbol explained;
do not leave raw LaTeX delimiters or Mermaid source as if they were rendered.
No rendering dependency or content schema extension is needed for these equations.

Interview questions have concise canonical answers, `### Supporting reasoning`,
plain-text `followUps` metadata, and a `### Evaluation rubric` inside the answer.
Rubrics and supporting reasoning are therefore revealed with the answer, rather
than leaking the solution into recall prompts.

To rerun this module's five actual Python fences independently (Python 3 + NumPy):

```bash
python scripts/check-deep-learning-examples.py
```

It checks the printed results in addition to the assertions inside the examples;
there are no model downloads, network calls, or random outputs. See
`docs/curriculum/deep-learning-publication-review.md` for coverage and review notes.

The user-requested four-topic Part 1 batch (Tokenization & Embeddings, LLM
Fundamentals, LLM API Integration, Prompt Engineering) is documented in
`docs/curriculum/ai-part1-four-topics-review.md`. Its local Python checks run with
`python scripts/check-ai-part1-examples.py`; live API calls are disabled in verification.

The subsequent requested Context Engineering / Structured Output / Embeddings batch
is documented in `docs/curriculum/context-structured-embeddings-review.md`. Run
`python3 scripts/check-ai-context-examples.py` with NumPy and Pydantic v2 to verify
its actual lesson fences. Tested optional local dependency versions are recorded
in `scripts/requirements-ai-context.txt`; they are not frontend dependencies.

The requested Transformers / Vector Databases / Retrieval Systems batch adds four
lessons and eight interview questions per topic under `transformers/`,
`vector-databases/`, and `retrieval-systems/`. Coverage, source qualifications, and
verification results are in
`docs/curriculum/transformers-vector-retrieval-review.md`. Run
`python3 scripts/check-ai-retrieval-examples.py` with Python 3 and NumPy to execute
all twelve actual lesson examples independently. The examples use no model APIs,
database services, or downloads; NumPy is a local teaching dependency only.

The RAG / AI Agents / Agent Frameworks batch adds four lessons and eight questions
per topic under `rag/`, `agents/`, and `agent-frameworks/`. Its review is
`docs/curriculum/rag-agents-frameworks-review.md`. Execute the twelve actual Python
fences with `python scripts/check-ai-rag-agents-examples.py` in an environment with
`scripts/requireme
