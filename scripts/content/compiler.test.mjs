import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { compileContent, loadContent, parseFrontmatter, validateURL } from './compiler.mjs';
import { draftPreviewEnabled } from './vite-plugin.mjs';
import { projectRoot, buildContent } from '../build-content.mjs';
import { toSubjectGroups, contentHref, parseContentRoute } from '../../src/content/adapter.js';
import { emptyPersonal, deriveTopics, updateQuestion, deleteQuestion, migrateLegacy, openPersonalStore, parseBackup, PERSONAL_KEY } from '../../src/personalData.js';
import { LEGACY_REFERENCE } from '../../src/legacyReference.js';

const actual = await loadContent(projectRoot);
const compiled = await compileContent(actual);
const lesson = { id: 'lesson-test', kind: 'lesson', topicId: 'os-processes', title: 'A lesson', summary: 'A summary', status: 'published', revision: 1, order: 10 };
const question = { id: 'os-test', kind: 'question', topicId: 'os-processes', prompt: 'A question?', difficulty: 'easy', status: 'published', revision: 1, order: 1 };
const doc = (metadata = lesson, body = '## Overview\n\nA flexible explanation.', file = 'subjects/os/lesson.md') => ({
  file, source: `---\n${JSON.stringify(metadata)}\n---\n${body}\n`,
});
const fixture = overrides => ({
  catalogs: { subjects: [{ id: 'os', title: 'OS', icon: '⚙️' }], topics: [{ id: 'os-processes', subjectId: 'os', title: 'Processes', order: 1 }], concepts: [] },
  schemas: actual.schemas, documents: [doc()], ...overrides,
});
test('mixed catalog preserves every historical identity and accepts additional live content', () => {
  const { catalog } = compiled;
  const ids = new Set(catalog.questions.map(q => q.id));
  assert.equal(ids.size, catalog.questions.length);
  for (const original of LEGACY_REFERENCE) assert.ok(ids.has(original.id), `Missing historical ID ${original.id}`);
  const legacyCount = actual.legacySubjects.flatMap(subject => subject.questions).length;
  const published = actual.documents.map(doc => parseFrontmatter(doc.source).metadata).filter(doc => doc.status === 'published');
  assert.equal(catalog.questions.length, legacyCount + published.filter(doc => doc.kind === 'question').length);
  assert.equal(catalog.lessons.length, published.filter(doc => doc.kind === 'lesson').length);
  const pilot = catalog.lessons.find(l => l.id === 'lesson-os-processes-threads');
  assert.equal(pilot.topicId, 'os-processes');
  assert.equal(pilot.subjectId, 'os');
});

test('editorial revisions preserve pilot IDs and classification without rewriting historical snapshots', () => {
  const groups = toSubjectGroups(compiled.catalog);
  for (const baseline of Object.values(actual.baselines)) {
    const current = groups.flatMap(g => g.questions).find(q => q.id === baseline.id);
    for (const key of ['q', 'd', 'freq']) assert.deepEqual(current[key], baseline[key], `${baseline.id}.${key}`);
    const canonical = compiled.catalog.questions.find(q => q.id === baseline.id);
    assert.ok(canonical.revision >= 2);
    assert.ok(canonical.sections.some(s => s.title === 'Follow-up prompts'));
    assert.ok(canonical.sections.some(s => s.title === 'What a good answer covers'));
    const opening = /<p>([\s\S]*?)<\/p>/.exec(current.a)[1].replace(/<[^>]*>/g, '');
    assert.ok(opening.split(/\s+/).length <= 110, 'Opening answer should be concise');
    assert.notEqual(current.a, baseline.a);
  }
  assert.deepEqual(groups[0].questions.slice(0, 5).map(q => q.id), ['os-q001', 'os-q002', 'os-q003', 'os-q004', 'os-q005']);
});

test('frozen legacy migration reference has not changed', async () => {
  const source = await readFile(new URL('../../src/legacyReference.js', import.meta.url));
  assert.equal(createHash('sha256').update(source).digest('hex'), 'fde4f28fd2c3a14745c1fb0e85dbf9d1a94846cfb8c2c53f2494a9d695eecd60');
  const baseline = await readFile(new URL('../../content/compatibility/os-processes-v1.json', import.meta.url));
  assert.equal(createHash('sha256').update(baseline).digest('hex'), '25ff24c7d73f9b24bddb13abaff2ecd81ad92cfd67c44d66995127700b017f0d');
});

test('rejects duplicate IDs across Markdown and legacy sources instead of overriding', async () => {
  await assert.rejects(compileContent(fixture({ documents: [doc(question, '## Answer\n\nAnswer.')], legacySubjects: [{ id: 'os', questions: [{ id: question.id, q: question.prompt, a: 'Old', d: 'e', freq: false }] }] })), /duplicate ID/);
  await assert.rejects(compileContent(fixture({ documents: [doc(), doc(lesson, '## Another\n\nBody.', 'subjects/os/duplicate.md')] })), /duplicate ID/);
});

test('schema rejects missing/unknown fields, invalid values and personal data in published metadata', async () => {
  for (const change of [{ id: undefined }, { difficulty: 'expert' }, { kind: 'unknown' }, { revision: 0 }, { notes: 'personal' }, { status: 'mastered' }, { tags: ['bad tag'] }]) {
    await assert.rejects(compileContent(fixture({ documents: [doc({ ...lesson, ...change })] })), /must/);
  }
  await assert.rejects(compileContent(fixture({ documents: [doc({ ...question, title: 'Not a lesson' }, '## Answer\n\nText')] })), /must/);
});

test('catalogs reject duplicate IDs, unknown subjects and subject/topic confusion', async () => {
  const input = fixture();
  input.catalogs.topics[0].subjectId = 'missing';
  await assert.rejects(compileContent(input), /Unknown subject/);
  const confused = fixture();
  confused.catalogs.topics[0].id = 'os';
  await assert.rejects(compileContent(confused), /duplicate ID/);
  await assert.rejects(compileContent(fixture({ documents: [doc({ ...lesson, topicId: 'os' })] })), /unknown topic/);
});

test('YAML rejects duplicate keys, aliases, invalid types and empty bodies', async () => {
  assert.throws(() => parseFrontmatter('---\nid: one\nid: two\n---\n## Text'), /invalid YAML/);
  assert.throws(() => parseFrontmatter('---\nid: &id test\nother: *id\n---\n## Text'), /alias/i);
  assert.throws(() => parseFrontmatter('No metadata'), /frontmatter/);
  assert.throws(() => parseFrontmatter('---\nid: one\n---\n'), /empty/);
  await assert.rejects(compileContent(fixture({ documents: [{ file: 'bad.md', source: '---\n- wrong\n---\n## Body' }] })), /must be object/);
});

test('lesson headings are flexible; questions have a canonical answer without losing subsections', async () => {
  const output = await compileContent(fixture({ documents: [doc(lesson, '## Just one useful section\n\nExplanation.') ] }));
  assert.equal(output.catalog.lessons[0].sections.length, 1);
  const q = await compileContent(fixture({ documents: [doc(question, '## Answer\n\nShort answer.\n\n### Detail\n\nMore detail.')] }));
  assert.ok(q.catalog.questions[0].answerHtml.includes('More detail.'));
  await assert.rejects(compileContent(fixture({ documents: [doc(question, '## Answer\n\nText\n\n## Lost section\n\nText')] })), /## Answer/);
  await assert.rejects(compileContent(fixture({ documents: [doc(lesson, '# Duplicate title\n\nText')] })), /use ##/);
  await assert.rejects(compileContent(fixture({ documents: [doc(question, '## Answer')] })), /body content/);
  const spaced = await compileContent(fixture({ documents: [doc(question, '\n\n## Answer\n\nA complete answer.\n\n### Reasoning\n\nDetail.')] }));
  assert.ok(spaced.catalog.questions[0].answerHtml.includes('A complete answer.'));
  assert.ok(spaced.catalog.questions[0].answerHtml.includes('id="question-os-test--reasoning"'));
});

test('non-contiguous conversions preserve remaining legacy positions', async () => {
  const legacyQ = id => ({ id, q: 'Question?', a: 'Original', d: 'e', freq: false });
  const out = await compileContent(fixture({
    legacySubjects: [{ id: 'os', questions: [legacyQ('os-first'), legacyQ('os-third')] }],
    documents: [doc({ ...question, id: 'os-second', order: 2 }, '## Answer\n\nOriginal')],
    baselines: { 'os-second': { ...legacyQ('os-second'), subjectId: 'os', order: 2 } },
  }));
  assert.deepEqual(toSubjectGroups(out.catalog)[0].questions.map(q => q.id), ['os-first', 'os-second', 'os-third']);
});

test('validates related IDs, concepts, primary lesson kinds/topics and prerequisites', async () => {
  for (const change of [{ conceptIds: ['missing'] }, { relatedIds: ['missing'] }, { prerequisiteIds: ['missing'] }]) {
    await assert.rejects(compileContent(fixture({ documents: [doc({ ...lesson, ...change })] })), /unknown concept|reference/);
  }
  await assert.rejects(compileContent(fixture({ documents: [doc({ ...question, lessonId: 'missing' }, '## Answer\n\nText')] })), /reference/);
  await assert.rejects(compileContent(fixture({ documents: [doc({ ...lesson, relatedIds: [lesson.id] })] })), /self reference/);
  await assert.rejects(compileContent(fixture({ documents: [doc({ ...lesson, prerequisiteIds: ['lesson-other'] }),
    doc({ ...lesson, id: 'lesson-other', prerequisiteIds: [lesson.id] }, '## Body\n\nText', 'subjects/os/other.md')] })), /cycle/);
});

test('drafts validate but are excluded, and published references cannot target drafts', async () => {
  const out = await compileContent(fixture({ documents: [doc({ ...lesson, status: 'draft' })] }));
  assert.equal(out.catalog.lessons.length, 0);
  assert.equal(out.emitted.size, 0);
  await assert.rejects(compileContent(fixture({ documents: [doc({ ...lesson, status: 'draft' }),
    doc({ ...question, lessonId: lesson.id }, '## Answer\n\nText', 'subjects/os/q.md')] })), /draft/);
});

test('draft preview includes related draft items in memory, never in default production output', async () => {
  const input = fixture({ documents: [doc({ ...lesson, status: 'draft' }),
    doc({ ...question, status: 'draft', lessonId: lesson.id }, '\n## Answer\n\nDraft answer.', 'subjects/os/q.md')] });
  const preview = await compileContent({ ...input, includeDrafts: true });
  assert.equal(preview.catalog.draftPreview, true);
  assert.equal(preview.catalog.questions[0].status, 'draft');
  assert.match(preview.catalog.lessons[0].payloadUrl, /^\/__draft-content\//);
  const production = await compileContent(input);
  assert.equal(production.catalog.draftPreview, false);
  assert.equal(production.catalog.questions.length, 0);
  assert.equal(production.catalog.lessons.length, 0);
  assert.equal(production.emitted.size, 0);
  assert.equal(draftPreviewEnabled({ command: 'serve', mode: 'drafts', isPreview: false }), true);
  assert.equal(draftPreviewEnabled({ command: 'build', mode: 'drafts' }), false);
  assert.equal(draftPreviewEnabled({ command: 'serve', mode: 'drafts', isPreview: true }), false);
});

test('local links resolve to stable hash routes and explicit anchors survive heading wording', async () => {
  const out = await compileContent(fixture({ documents: [doc({ ...lesson, anchors: { 'stable-section': 'A renamed heading' } },
    '## A renamed heading\n\n[Self](#stable-section)\n\n[Question](q.md)'),
  doc(question, '## Answer\n\nText', 'subjects/os/q.md')] }));
  const payload = JSON.parse([...out.emitted.values()].find(v => typeof v === 'string'));
  assert.ok(payload.html.includes('href="#/lesson/lesson-test/stable-section"'));
  assert.ok(payload.html.includes('#/question/os-test?practice=1'));
  assert.ok(payload.html.includes('from='));
  for (const body of ['## Body\n\n[Missing](missing.md)', '## Body\n\n[Missing](#missing)', '## Body\n\n[Escape](../../../outside.md)']) {
    await assert.rejects(compileContent(fixture({ documents: [doc(lesson, body)] })), /missing|escapes/);
  }
});

test('headings reject duplicate anchors and missing explicit anchor targets', async () => {
  await assert.rejects(compileContent(fixture({ documents: [doc(lesson, '## Same\n\nText\n\n## Same\n\nText')] })), /duplicate/);
  await assert.rejects(compileContent(fixture({ documents: [doc({ ...lesson, anchors: { stable: 'Missing heading' } })] })), /missing heading/);
});

test('raw HTML is escaped; executable and protocol-relative links are rejected', async () => {
  const out = await compileContent(fixture({ documents: [doc(lesson, '## Body\n\n<script>alert(1)</script>\n\n<iframe src="https://example.com"></iframe>')] }));
  const html = JSON.parse([...out.emitted.values()][0]).html;
  assert.ok(!html.includes('<script>') && html.includes('&lt;script&gt;'));
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//example.com', 'file:///tmp/test', 'javascript%3Aalert(1)', 'https://example.com\\evil']) {
    assert.throws(() => validateURL(url), /Unsafe/);
  }
  await assert.rejects(compileContent(fixture({ documents: [doc(lesson, '## Body\n\n[x](javascript:alert(1))')] })), /Unsafe/);
  await assert.rejects(compileContent(fixture({ documents: [doc(lesson, '## Body\n\n[x](jav&#x61;script:alert(1))')] })), /Unsafe/);
});

test('assets are validated, fingerprinted and emitted; unsafe SVGs, missing files and empty alt text fail', async () => {
  const key = 'subjects/os/diagram.svg';
  const safeSVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>');
  const input = fixture({ documents: [doc(lesson, '## Body\n\n![A diagram](diagram.svg)')], assets: new Map([[key, safeSVG]]) });
  const out = await compileContent(input);
  assert.ok([...out.emitted.keys()].some(name => /^asset-[a-f0-9]+\.svg$/.test(name)));
  for (const body of ['## Body\n\n![](diagram.svg)', '## Body\n\n![Alt](missing.svg)', '## Body\n\n![Alt](https://example.com/image.svg)', '## Body\n\n![Alt](../../../../secret.svg)']) {
    await assert.rejects(compileContent({ ...input, documents: [doc(lesson, body)] }), /alt text|asset|image|escapes/);
  }
  await assert.rejects(compileContent({ ...input, assets: new Map([[key, Buffer.from('<svg><script>alert(1)</script></svg>')]]) }), /active/);
});

test('compatibility baselines are migration-only and require a live Markdown source', async () => {
  const current = compiled.catalog.questions.find(q => q.id === 'os-q001');
  assert.notEqual(current.answerHtml, actual.baselines['os-q001'].a);
  assert.equal(compiled.catalog.questions.filter(q => q.id === 'os-q001').length, 1);
  await assert.rejects(compileContent(fixture({ baselines: { missing: { id: 'missing', subjectId: 'os', order: 1, q: 'Missing?', a: 'Answer', d: 'e', freq: false } } })), /needs one published/);
});

test('old full datasets migrate against mixed content without false recovery for formatting changes', () => {
  const groups = toSubjectGroups(compiled.catalog);
  const legacy = groups.map(subject => ({ ...subject, questions: subject.questions.map(q => {
    const original = actual.baselines[q.id] || q;
    const content = { ...original };
    for (const key of ['id', 'subjectId', 'order', 'lessonId']) delete content[key];
    return { ...content, notes: `Note for ${q.id}`, status: 'comfortable' };
  }).filter(q => LEGACY_REFERENCE.some(original => original.topicId === subject.id && original.hash
    && (actual.baselines[subject.questions.find(item => item.q === q.q)?.id] || subject.questions.find(item => item.q === q.q)))) }));
  const raw = { 'cs-learning-data': JSON.stringify(legacy), 'dsa-templates': null, 'dsa-notes': null };
  const { personal, summary } = migrateLegacy(raw, groups, actual.templates, LEGACY_REFERENCE, compiled.catalog.migrationBaselines);
  assert.equal(summary.matched, 190);
  assert.equal(personal.customQuestions.length, 0);
  assert.equal(personal.recovery.length, 0);
  assert.equal(personal.questionState['os-q001'].notes, 'Note for os-q001');
  legacy[0].questions[0].a = 'A genuine changed answer';
  const changed = migrateLegacy({ ...raw, 'cs-learning-data': JSON.stringify(legacy) }, groups, [], LEGACY_REFERENCE, compiled.catalog.migrationBaselines).personal;
  assert.equal(changed.customQuestions.length, 0);
  assert.equal(changed.recovery.length, 1);
});

test('historical answer matching disambiguates repeated wording after Markdown serialization changes', () => {
  const groups = toSubjectGroups(compiled.catalog);
  const original = actual.baselines['os-q001'];
  groups[0].questions.push({ ...groups[0].questions[0], id: 'os-another-question', a: 'A different answer' });
  const raw = { 'cs-learning-data': JSON.stringify([{ id: 'os', questions: [{ ...original, id: undefined, notes: 'Keep on original' }] }]) };
  const { personal } = migrateLegacy(raw, groups, [], LEGACY_REFERENCE, compiled.catalog.migrationBaselines);
  assert.equal(personal.customQuestions.length, 0);
  assert.equal(personal.questionState['os-q001'].notes, 'Keep on original');
});

test('subject-scoped custom questions, notes, statuses, deletion markers and backup v1 survive mixed content', () => {
  const groups = toSubjectGroups(compiled.catalog);
  let p = updateQuestion(emptyPersonal(), 'os-q001', { notes: 'Keep note', status: 'mastered' });
  p.customQuestions.push({ id: 'custom-test', topicId: 'os', q: 'Custom?', a: 'Custom answer', d: 'e', freq: false });
  p = deleteQuestion(p, 'os-q003');
  const view = deriveTopics(groups, p)[0];
  assert.equal(view.id, 'os');
  assert.equal(view.questions.length, 30);
  assert.ok(!view.questions.some(q => q.id === 'os-q003'));
  assert.equal(view.questions.find(q => q.id === 'os-q001').notes, 'Keep note');
  assert.equal(view.questions.find(q => q.id === 'os-q001').status, 'mastered');
  assert.ok(view.questions.some(q => q.id === 'custom-test'));
  const entries = new Map([[PERSONAL_KEY, JSON.stringify(p)]]);
  const storage = { get length() { return entries.size; }, key: index => [...entries.keys()][index],
    getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) };
  const store = openPersonalStore(storage, groups, actual.templates, compiled.catalog.migrationBaselines);
  assert.deepEqual(store.personal, p);
  const backup = store.export(p);
  assert.equal(parseBackup(backup).personal.schemaVersion, 2);
  assert.deepEqual(store.restore(backup, p), p);
  const updated = structuredClone(compiled.catalog);
  updated.questions.reverse();
  updated.questions.find(q => q.id === 'os-q001').answerHtml = '<p>New published revision</p>';
  const after = deriveTopics(toSubjectGroups(updated), p)[0].questions.find(q => q.id === 'os-q001');
  assert.equal(after.notes, 'Keep note');
  assert.equal(after.a, '<p>New published revision</p>');
});

test('static output is deterministic and lessons are not bundled as HTML in the catalog', async () => {
  const second = await buildContent({ check: true });
  assert.deepEqual(second.catalog, compiled.catalog);
  assert.deepEqual([...second.emitted], [...compiled.emitted]);
  const lessonEntry = compiled.catalog.lessons[0];
  assert.equal(lessonEntry.html, undefined);
  assert.match(lessonEntry.payloadUrl, /^\/learning-content\/lesson-[a-f0-9]+\.json$/);
  const payload = JSON.parse(compiled.emitted.get(lessonEntry.payloadUrl.split('/').at(-1)));
  assert.ok(payload.html.includes('<table>') && payload.html.includes('<pre>'));
});

test('stable routes encode IDs/sections and reject malformed route encodings', () => {
  assert.deepEqual(parseContentRoute(contentHref('lesson', 'lesson-test', 'memory-model')),
    { kind: 'lesson', id: 'lesson-test', section: 'memory-model' });
  assert.equal(parseContentRoute('#/lesson/%broken'), null);
  assert.equal(parseContentRoute('#unknown'), null);
});
