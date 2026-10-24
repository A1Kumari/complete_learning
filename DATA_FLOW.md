# Learning content and personal data

## Data flow

`content/` Markdown/YAML + catalogs and remaining `src/data/*.json` → build-time
compiler → generated catalog → compatibility adapter → published subject buckets

`localStorage[cs-learning-personal-v1]` → validated personal state

`deriveTopics` / `deriveTemplates` combine both for the existing React UI. Only
personal state is saved after edits. Published additions, answers, difficulty,
wording, and ordering therefore update without resetting users' notes/progress.
Legacy answers remain HTML; new Markdown compiles to safe HTML at build time.
Detailed lesson bodies are static, lazy-loaded payloads. There is no backend or
personal-data schema change. See [CONTENT_AUTHORING.md](CONTENT_AUTHORING.md).

## Identity and ownership

- Every published question has a permanent explicit ID (for example `os-q001`).
  The numbers were assigned once; they are **not** current positions. Never
  renumber, recycle, or change IDs when rewording, moving, or reordering questions.
- New published questions need new unique IDs. Template IDs are also permanent.
- Newly created custom questions use `custom-<UUID>` IDs. Their content belongs to
  the user; it is not matched against published wording on subsequent loads.
- Personal schema version 1 contains `questionState` (notes/status by ID),
  `customQuestions` (content/topic/ID), `hiddenQuestionIds`, `templateState`
  (notes/status/attempts), and `recovery` (reason/source/original JSON string).
- Delete adds a personal tombstone, including for custom questions. Original
  custom content and notes are retained. Published removal does not erase personal
  state: it reconnects if that ID returns. Unknown topics/IDs in backups remain
  preserved even when the current UI cannot display them.
- Empty notes/status fields in older bundled JSON are seed defaults only; personal
  defaults/state are applied by the derivation functions, never written to content.

## One-time legacy migration

`openPersonalStore` reads only. The mount effect commits through `save`; edits use
the same commit boundary. Once the new record exists, legacy data is not remigrated.
This prevents duplicate custom entries on reload, retry, and React Strict Mode.

The old keys `cs-learning-data`, `dsa-templates`, and `dsa-notes` are **never changed
or deleted**. Before the initial new record is written, their exact strings are
copied into a verified, retained `cs-learning-backup:<number>` archive. Failed
backup creation prevents migration commit. Successful backup plus failed commit
can be retried without duplicating the archive.

Matching uses an existing published ID first, otherwise topic + normalized question
text and the frozen v0 text fingerprints in `src/legacyReference.js`. Fingerprints
are matching hints, not runtime IDs; do not regenerate the historical reference
when content changes. No fuzzy answer-based or array-position matching is used.
An exact content match can disambiguate multiple published questions with the same
wording; otherwise ambiguous identities are not guessed.

- One unambiguous published identity: migrate notes/status to that ID, display
  current published content, and retain differing legacy content in recovery.
- Multiple legacy entries matching the same published ID: first personal state
  wins; every later record is retained in recovery, without custom duplicates.
- No unambiguous identity: retain as a separate custom question with a deterministic
  migration ID. Identical custom entries remain distinct to avoid dropping data.
- **Missing legacy questions never imply deletion.** All published questions return
  during migration. Only explicit deletions in the new model create tombstones.
- Conflicting template notes prefer `dsa-notes`; alternative notes are retained in
  recovery. Missing/invalid attempts become zero; original invalid values are kept.
- Malformed legacy records are retained in recovery and exact original backups.
  Usable records still migrate. Unknown legacy fields are retained in the originals.

An unmatched question whose wording was independently changed cannot be reliably
identified as published without an ID or historical alias. Keeping it as custom
is intentional. Raw legacy storage/archives remain the lossless source of truth
for all ambiguities. Migration/recovery details appear above the search bar when
attention is needed; Export Backup includes full original records.

## Saving and failures

New-format data is validated before writing. Unsupported versions or corrupt new
records are never automatically overwritten. Save errors are visible; in-memory
edits remain exportable and Retry Save retries them. If storage cannot be read,
export includes available in-memory/cached data with a recovery notice.

Optimistic comparison detects another tab's changed personal record before a
write (and changed legacy data before initial migration). Export unsaved work and
reload after a conflict. LocalStorage has no multi-tab transaction/compare-and-swap;
this detects observed conflicts, not perfectly simultaneous writes.

## Export and validated restore

Use **Export Backup** to download versioned JSON containing personal data, recovery
records, retained archives, legacy raw values, and the original saved personal
record. Backups are local files; clearing browser storage removes browser copies.

Use **Import Backup** to select an exported JSON file. Validation rejects unsupported
versions, malformed fields/statuses, duplicate custom IDs, and unsafe identifiers
before any writes. Confirming restore **replaces**, rather than merges, personal
state; published content always comes from the current app. Repeated imports do
not append duplicate custom questions.

Before replacement, saved data and current in-memory edits are archived. Imported
archives/originals are retained without overwriting existing archives. If any
archive write fails, the current personal record is not replaced. Archives may be
left by an interrupted restore; they are harmless and retained. A validated restore
can also recover from a corrupt current personal record, after archiving it.

Recovery payloads are stored as inert JSON strings and included in exports. They
are not automatically applied as content. Import validates structure, not HTML
sanitization: the app retains its existing HTML-answer behavior.

## Verification

Run `npm test`, `npm run lint`, and `npm run build`. Tests use Node's built-in test
runner and in-memory storage, covering migration, restored published questions,
duplicates/conflicts, future updates, tombstones, invalid data, failed writes,
retries, cross-tab conflicts, and validated export/import round trips.

Manual browser checks: start with legacy keys, verify notes/status/custom questions,
check recovery details, export, change a note, import the export, and reload. Try
an invalid JSON import: it must leave current data unchanged. To test future
content changes, keep an ID while editing its answer and add another unique ID;
both content updates should appear while personal state stays attached.
