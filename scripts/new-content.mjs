import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { compileContent, loadContent, parseFrontmatter } from './content/compiler.mjs';
import { projectRoot } from './build-content.mjs';

export async function scaffoldContent({ root = projectRoot, kind, id, topicId, lessonId, title, prompt, difficulty = 'easy' }) {
  if (!['lesson', 'question'].includes(kind) || !/^[a-z][a-z0-9_-]{0,199}$/.test(id || '') || id.startsWith('custom-')) {
    throw new Error('Choose lesson/question and a permanent lowercase ID outside the custom- namespace.');
  }
  const input = await loadContent(root);
  const { catalog } = await compileContent({ ...input, includeDrafts: true });
  const parentLesson = lessonId ? catalog.lessons.find(item => item.id === lessonId) : null;
  if (lessonId && !parentLesson) throw new Error(`Unknown lesson ${lessonId}`);
  topicId ||= parentLesson?.topicId;
  const topic = catalog.topics.find(item => item.id === topicId);
  if (!topic) throw new Error(`Unknown topic ${topicId}. Choose an ID from content/topics.json.`);
  if (parentLesson && parentLesson.topicId !== topicId) throw new Error('The primary lesson and question must share a topic.');
  if (kind === 'lesson' && lessonId) throw new Error('--lesson is only for questions.');
  if (!(kind === 'lesson' ? title : prompt)?.trim()) throw new Error(kind === 'lesson' ? 'Provide --title.' : 'Provide --prompt.');
  const peers = kind === 'lesson' ? catalog.lessons.filter(item => item.topicId === topicId)
    : catalog.questions.filter(item => item.subjectId === topic.subjectId);
  const metadata = { id, kind, topicId, ...(kind === 'lesson' ? { title, summary: 'Describe what the reader will understand.' }
    : { ...(lessonId ? { lessonId } : {}), prompt, difficulty }), status: 'draft', revision: 1,
    order: Math.max(0, ...peers.map(item => item.order)) + (kind === 'lesson' ? 10 : 1) };
  const existing = input.documents.find(doc => parseFrontmatter(doc.source, doc.file).metadata.topicId === topicId);
  let directory = existing ? path.posix.dirname(existing.file) : `subjects/${topic.subjectId}/${topicId}`;
  if (['lessons', 'questions'].includes(path.posix.basename(directory))) directory = path.posix.dirname(directory);
  const file = `${directory}/${kind}s/${id}.md`;
  const body = kind === 'lesson' ? '## Start here\n\nExplain the idea in a way that fits this topic. Replace this draft text.\n'
    : '## Answer\n\nWrite a concise answer.\n\n### Supporting reasoning\n\nExplain why it holds and any qualifications.\n\n### Follow-up prompts\n\n- Add a useful follow-up.\n\n### What a good answer covers\n\n- Name the essential reasoning.\n';
  const source = `---\n${stringify(metadata)}---\n\n${body}`;
  // Catch duplicate IDs and invalid metadata/relationships before touching the filesystem.
  await compileContent({ ...input, documents: [...input.documents, { file, source }], includeDrafts: true });
  const destination = path.join(root, 'content', file);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, source, { flag: 'wx' });
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [kind, id, ...args] = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--topic', '--lesson', '--title', '--prompt', '--difficulty'].includes(args[i]) || args[i + 1] === undefined) {
      throw new Error('Use --topic, --lesson, --title, --prompt or --difficulty followed by a value.');
    }
    options[args[i].slice(2)] = args[i + 1];
  }
  const file = await scaffoldContent({ kind, id, topicId: options.topic, lessonId: options.lesson,
    title: options.title, prompt: options.prompt, difficulty: options.difficulty });
  console.log(`Created ${path.relative(projectRoot, file)} (draft). Preview with npm run dev:drafts.`);
}
