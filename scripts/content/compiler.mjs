import { readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import Ajv from 'ajv';
import MarkdownIt from 'markdown-it';
import { parseDocument } from 'yaml';
import { contentHref, practiceHref } from '../../src/content/adapter.js';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 16);
const readJSON = async file => JSON.parse(await readFile(file, 'utf8'));
const difficultyNames = { e: 'easy', m: 'medium', h: 'hard' };
const contentFields = ['q', 'a', 'd', 'freq', 'cross', 'trap'];
const validId = id => typeof id === 'string' && /^[a-z][a-z0-9_-]{0,199}$/.test(id)
  && !id.startsWith('custom-') && !['constructor', 'prototype'].includes(id);
const curriculumPriorities = new Set(['Essential', 'Important', 'Advanced']);
const planningStatuses = new Set(['planned', 'in-progress', 'pending-planning']);
const inDirectory = (file, directory) => file === directory || file.startsWith(`${directory}${path.sep}`);
const slug = text => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export async function walk(directory, extension) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink(), `Symlinks are not allowed in content: ${file}`);
    if (entry.isDirectory()) files.push(...await walk(file, extension));
    else if (entry.name.endsWith(extension)) files.push(file);
  }
  return files.sort();
}

export function parseFrontmatter(source, file = 'document') {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(source);
  assert(match, `${file}: expected YAML frontmatter between --- delimiters`);
  const yaml = parseDocument(match[1], { uniqueKeys: true, schema: 'core' });
  assert(!yaml.errors.length && !yaml.warnings.length, `${file}: invalid YAML: ${[...yaml.errors, ...yaml.warnings].map(e => e.message).join('; ')}`);
  const metadata = yaml.toJS({ maxAliasCount: 0 });
  assert(match[2].trim(), `${file}: empty Markdown body`);
  return { metadata, body: match[2] };
}

export function validateURL(raw, image = false) {
  let decoded;
  try { decoded = decodeURIComponent(raw); } catch { throw new Error(`Invalid URL encoding: ${raw}`); }
  assert(![...decoded].some(c => c.codePointAt(0) <= 32 || c.codePointAt(0) === 127 || c === '\\')
    && !decoded.startsWith('//'), `Unsafe URL: ${raw}`);
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(decoded)?.[1].toLowerCase();
  assert(!scheme || (!image && ['http', 'https', 'mailto'].includes(scheme)), `Unsafe ${image ? 'image' : 'link'} URL: ${raw}`);
  if (scheme === 'http' || scheme === 'https') assert(new URL(decoded).hostname, `Invalid URL: ${raw}`);
  return decoded;
}

function markdownEngine() {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
  md.validateLink = url => { validateURL(url); return true; };
  const imageRenderer = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, index, options, env, renderer) => {
    const token = tokens[index];
    const src = md.utils.escapeHtml(token.attrGet('src'));
    const label = md.utils.escapeHtml(`Open full-size diagram: ${token.content}`);
    return `<a class="lesson-diagram" href="${src}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${imageRenderer(tokens, index, options, env, renderer)}<span>Open full-size diagram ↗</span></a>`;
  };
  return md;
}

function headings(tokens, metadata, file) {
  const sections = [];
  const anchors = metadata.anchors || {};
  const ids = new Set();
  const titles = new Set();
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type !== 'heading_open') continue;
    assert(token.tag !== 'h1', `${file}: use ## or deeper; the title is metadata`);
    const title = tokens[index + 1].content;
    const overrides = Object.entries(anchors).filter(([, value]) => value === title);
    assert(overrides.length <= 1, `${file}: multiple anchors for heading ${title}`);
    const id = overrides[0]?.[0] || slug(title);
    assert(id && !ids.has(id), `${file}: duplicate/empty heading anchor ${id}`);
    ids.add(id); titles.add(title);
    token.attrSet('id', metadata.kind === 'question' ? `question-${metadata.id}--${id}` : id);
    token.attrSet('data-section', id);
    token.attrSet('tabindex', '-1');
    sections.push({ id, title, level: Number(token.tag.slice(1)), line: token.map[0] });
  }
  for (const title of Object.values(anchors)) assert(titles.has(title), `${file}: anchor targets missing heading ${title}`);
  assert(sections.length, `${file}: add at least one heading`);
  if (metadata.kind === 'question') {
    assert(sections[0].title === 'Answer' && sections[0].level === 2
      && sections.filter(s => s.level === 2).length === 1 && tokens[0].type === 'heading_open',
    `${file}: questions start with ## Answer; use ### for optional subsections`);
  }
  return sections;
}

function plainText(tokens) {
  return tokens.flatMap(t => t.type === 'inline' ? t.children.filter(c => ['text', 'code_inline'].includes(c.type)).map(c => c.content)
    : ['fence', 'code_block'].includes(t.type) ? [t.content] : []).join(' ').replace(/\s+/g, ' ').trim();
}

// Pure compilation after filesystem inputs have been read: useful for validation tests.
export async function compileContent({ catalogs, documents, legacySubjects = [], templates = [], baselines = {}, assets = new Map(), schemas, includeDrafts = false }) {
  // Required fields are declared at the root and selected in conditional branches.
  const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false });
  const validateCatalog = ajv.compile(schemas.catalog);
  const validateDocument = ajv.compile(schemas.document);
  const validateBaselines = ajv.compile(schemas.compatibility);
  assert(validateCatalog(catalogs), `catalogs: ${ajv.errorsText(validateCatalog.errors)}`);
  assert(validateBaselines(baselines), `compatibility: ${ajv.errorsText(validateBaselines.errors)}`);
  const { subjects, topics, concepts } = catalogs;
  const allIds = new Set();
  const unique = (id, source) => {
    assert(!allIds.has(id), `${source}: duplicate ID ${id}`);
    allIds.add(id);
  };
  for (const item of [...subjects, ...topics, ...concepts]) unique(item.id, 'catalogs');
  const subjectMap = new Map(subjects.map(s => [s.id, s]));
  const topicMap = new Map(topics.map(t => [t.id, t]));
  const conceptIds = new Set(concepts.map(c => c.id));
  for (const topic of topics) assert(subjectMap.has(topic.subjectId), `Unknown subject ${topic.subjectId}`);
  const questions = [];
  const baselinePositions = new Set();
  for (const baseline of Object.values(baselines)) {
    const position = `${baseline.subjectId}:${baseline.order}`;
    assert(!baselinePositions.has(position), `Duplicate compatibility position ${position}`);
    baselinePositions.add(position);
  }
  for (const legacy of legacySubjects) {
    assert(subjectMap.has(legacy.id), `Unknown legacy subject ${legacy.id}`);
    assert(Array.isArray(legacy.questions), `Invalid legacy questions for ${legacy.id}`);
    const reserved = new Set(Object.values(baselines).filter(b => b.subjectId === legacy.id).map(b => b.order));
    let order = 0;
    legacy.questions.forEach(q => {
      assert(validId(q.id)
        && typeof q.q === 'string' && q.q.trim() && typeof q.a === 'string' && difficultyNames[q.d]
        && typeof q.freq === 'boolean'
        && (q.cross === undefined || (Array.isArray(q.cross) && q.cross.every(c => typeof c === 'string')))
        && (q.trap === undefined || typeof q.trap === 'string'), `Invalid legacy question ${q.id}`);
      unique(q.id, `legacy ${legacy.id}`);
      // Frozen placement restores old order after pilot entries leave the legacy array.
      do { order++; } while (reserved.has(order));
      questions.push({ id: q.id, subjectId: legacy.id, topicId: null, prompt: q.q, answerHtml: q.a,
        difficulty: difficultyNames[q.d], frequent: q.freq, followUps: q.cross, misconception: q.trap,
        order, status: 'published', sourceFormat: 'legacy-html', tags: [], conceptIds: [], relatedIds: [] });
    });
  }
  for (const template of templates) {
    assert(validId(template.id), `Invalid template ID ${template.id}`);
    unique(template.id, 'templates');
  }
  const md = markdownEngine();
  const parsed = documents.map(({ source, file }) => {
    const { metadata, body } = parseFrontmatter(source, file);
    assert(validateDocument(metadata), `${file}: ${ajv.errorsText(validateDocument.errors)}`);
    unique(metadata.id, file);
    assert(topicMap.has(metadata.topicId), `${file}: unknown topic ${metadata.topicId}`);
    assert(file.startsWith(`subjects/${topicMap.get(metadata.topicId).subjectId}/`), `${file}: document folder must match its topic's subject`);
    for (const id of metadata.conceptIds || []) assert(conceptIds.has(id), `${file}: unknown concept ${id}`);
    const tokens = md.parse(body, {});
    assert(tokens.some(t => t.type === 'paragraph_open' || t.type === 'table_open'
      || (['fence', 'code_block'].includes(t.type) && t.content.trim())), `${file}: add body content, not just headings`);
    return { ...metadata, file, tokens, sections: headings(tokens, metadata, file),
      subjectId: topicMap.get(metadata.topicId).subjectId, text: plainText(tokens) };
  });
  const byId = new Map(parsed.map(d => [d.id, d]));
  const byFile = new Map(parsed.map(d => [d.file, d]));
  for (const q of questions) byId.set(q.id, { ...q, kind: 'question', status: 'published' });
  const assertTarget = (doc, id, expectedKind) => {
    const target = byId.get(id);
    assert(target && (!expectedKind || target.kind === expectedKind), `${doc.file}: missing/wrong reference ${id}`);
    assert(doc.status !== 'published' || target.status === 'published', `${doc.file}: published content references draft ${id}`);
    assert(target.id !== doc.id, `${doc.file}: self reference ${id}`);
    return target;
  };
  for (const doc of parsed) {
    for (const id of doc.relatedIds || []) assertTarget(doc, id);
    for (const id of doc.prerequisiteIds || []) assertTarget(doc, id, 'lesson');
    if (doc.lessonId) {
      const lesson = assertTarget(doc, doc.lessonId, 'lesson');
      assert(lesson.topicId === doc.topicId, `${doc.file}: primary lesson must share its topic`);
    }
  }
  const visited = new Set();
  const visiting = new Set();
  function visit(doc) {
    assert(!visiting.has(doc.id), `${doc.file}: prerequisite cycle at ${doc.id}`);
    if (visited.has(doc.id)) return;
    visiting.add(doc.id);
    for (const id of doc.prerequisiteIds || []) visit(byId.get(id));
    visiting.delete(doc.id); visited.add(doc.id);
  }
  for (const doc of parsed) visit(doc);

  const emitted = new Map();
  const assetBase = includeDrafts ? '/__draft-content' : '/learning-content';
  const resolveLink = (raw, doc, image, section) => {
    const decoded = validateURL(raw, image);
    if (/^(https?:|mailto:)/i.test(decoded)) return raw;
    assert(!decoded.includes('?') && !decoded.startsWith('/') && decoded.split('#').length <= 2, `${doc.file}: use content-relative paths, not ${raw}`);
    const [local, fragment = ''] = decoded.split('#');
    const targetPath = path.posix.normalize(path.posix.join(path.posix.dirname(doc.file), local));
    assert(!targetPath.startsWith('../') && targetPath !== '..', `${doc.file}: path escapes content: ${raw}`);
    if (image || (local && !local.endsWith('.md'))) {
      assert(!fragment && assets.has(targetPath), `${doc.file}: missing/invalid asset ${raw}`);
      const asset = assets.get(targetPath);
      const ext = path.posix.extname(targetPath).toLowerCase();
      assert(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext), `${doc.file}: unsupported asset ${raw}`);
      if (ext === '.svg') {
        const svg = asset.toString('utf8');
        assert(!/<(?:script|style|foreignObject)\b|\bon\w+\s*=|<!\s*(?:DOCTYPE|ENTITY)|\b(?:href|src)\s*=\s*["'](?!#)|url\(\s*(?!["']?#)/i.test(svg), `${doc.file}: SVG contains active/external content`);
      }
      const assetName = `asset-${hash(asset)}${ext}`;
      if (doc.status === 'published' || includeDrafts) emitted.set(assetName, asset);
      return `${assetBase}/${assetName}`;
    }
    const target = local ? byFile.get(targetPath) : doc;
    assert(target, `${doc.file}: missing Markdown target ${raw}`);
    assert(doc.status !== 'published' || target.status === 'published', `${doc.file}: link to draft ${raw}`);
    assert(!fragment || target.sections.some(s => s.id === fragment), `${doc.file}: missing anchor ${raw}`);
    return doc.kind === 'lesson' && target.kind === 'question'
      ? practiceHref(target.id, contentHref('lesson', doc.id, section), fragment)
      : contentHref(target.kind, target.id, fragment);
  };
  const lessons = [];
  for (const doc of parsed) {
    let currentSection = '';
    for (const token of doc.tokens) {
      if (token.type === 'heading_open' && token.tag === 'h2') currentSection = token.attrGet('data-section');
      for (const child of token.children || []) {
      if (child.type === 'link_open') child.attrSet('href', resolveLink(child.attrGet('href'), doc, false, currentSection));
      if (child.type === 'image') {
        assert(child.content.trim(), `${doc.file}: image needs alt text`);
        child.attrSet('src', resolveLink(child.attrGet('src'), doc, true));
      }
      }
    }
    // Validation also runs for drafts, but they never enter the public catalog/assets.
    const html = md.renderer.render(doc.tokens, md.options, {});
    if (doc.status !== 'published' && !includeDrafts) continue;
    const common = { id: doc.id, subjectId: doc.subjectId, topicId: doc.topicId,
      order: doc.order, status: doc.status, revision: doc.revision, tags: doc.tags || [], conceptIds: doc.conceptIds || [], relatedIds: doc.relatedIds || [] };
    if (doc.kind === 'question') {
      // Remove just the Answer heading; the old card already labels/displays the answer.
      const firstHeadingEnd = doc.tokens.findIndex(t => t.type === 'heading_close');
      questions.push({ ...common, prompt: doc.prompt, difficulty: doc.difficulty, frequent: doc.frequent || false,
        answerHtml: md.renderer.render(doc.tokens.slice(firstHeadingEnd + 1), md.options, {}),
        lessonId: doc.lessonId, followUps: doc.followUps, misconception: doc.misconception, sourceFormat: 'markdown',
        sections: doc.sections.map(({ id, title, level }) => ({ id, title, level })) });
    } else {
      const payload = JSON.stringify({ id: doc.id, html });
      const name = `lesson-${hash(payload)}.json`;
      emitted.set(name, payload);
      lessons.push({ ...common, title: doc.title, summary: doc.summary,
        prerequisiteIds: doc.prerequisiteIds || [], sections: doc.sections.map(({ id, title, level }) => ({ id, title, level })),
        searchText: doc.text, payloadUrl: `${assetBase}/${name}` });
    }
  }
  const migrationBaselines = {};
  for (const [id, baseline] of Object.entries(baselines)) {
    assert(baseline.id === id && subjectMap.has(baseline.subjectId) && Number.isInteger(baseline.order), `Invalid compatibility baseline ${id}`);
    const current = questions.find(q => q.id === id);
    assert(current?.sourceFormat === 'markdown' && current.status === 'published' && current.subjectId === baseline.subjectId,
      `Compatibility baseline ${id} needs one published Markdown source in the same subject`);
    migrationBaselines[id] = Object.fromEntries(contentFields.filter(k => baseline[k] !== undefined).map(k => [k, baseline[k]]));
  }
  return { catalog: { schemaVersion: 1, draftPreview: includeDrafts, subjects, topics, concepts, questions,
    lessons: lessons.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)), migrationBaselines }, emitted };
}

export async function loadContent(root) {
  const directory = path.join(root, 'content');
  const catalogs = Object.fromEntries(await Promise.all(['subjects', 'topics', 'concepts'].map(async name => [name, await readJSON(path.join(directory, `${name}.json`))])));
  for (const topic of catalogs.topics) {
    assert(topic.priority === null || curriculumPriorities.has(topic.priority), `Topic ${topic.id}: invalid priority`);
    assert(typeof topic.description === 'string' && topic.description.trim(), `Topic ${topic.id}: missing description`);
    assert(Array.isArray(topic.scope) && topic.scope.length > 0 && topic.scope.every(item => typeof item === 'string' && item.trim()), `Topic ${topic.id}: invalid scope`);
    assert(planningStatuses.has(topic.planningStatus), `Topic ${topic.id}: invalid or missing planning status`);
  }
  const schemas = { catalog: await readJSON(path.join(directory, 'schemas/catalog.schema.json')),
    document: await readJSON(path.join(directory, 'schemas/document.schema.json')),
    compatibility: await readJSON(path.join(directory, 'schemas/compatibility.schema.json')) };
  const legacySubjects = [];
  for (const subject of catalogs.subjects) if (subject.legacyFile) {
    assert(/^[a-z][a-z0-9_-]*\.json$/.test(subject.legacyFile), `Invalid legacy filename ${subject.legacyFile}`);
    const legacy = await readJSON(path.join(root, 'src/data', subject.legacyFile));
    assert(legacy.id === subject.id, `Legacy subject mismatch ${subject.id}`);
    legacySubjects.push(legacy);
  }
  const templates = (await readJSON(path.join(root, 'src/data/dsa_templates.json'))).templates;
  const documents = [];
  const assets = new Map();
  const base = await realpath(directory);
  for (const file of await walk(path.join(directory, 'subjects'), '')) {
    assert(inDirectory(await realpath(file), base), `Content path escapes root: ${file}`);
    const relative = path.relative(directory, file).split(path.sep).join('/');
    if (file.endsWith('.md')) documents.push({ file: relative, source: await readFile(file, 'utf8') });
    else assets.set(relative, await readFile(file));
  }
  const baselines = {};
  for (const file of await walk(path.join(directory, 'compatibility'), '.json')) {
    for (const baseline of await readJSON(file)) {
      assert(!baselines[baseline.id], `Duplicate baseline ${baseline.id}`);
      baselines[baseline.id] = baseline;
    }
  }
  return { catalogs, schemas, documents, assets, legacySubjects, templates, baselines };
}
