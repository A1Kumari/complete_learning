const difficulties = { easy: 'e', medium: 'm', hard: 'h' };

export function lessonQuestions(catalog, lessonId) {
  return catalog.questions.filter(q => q.lessonId === lessonId)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function contentItem(catalog, id) {
  const lesson = catalog.lessons.find(item => item.id === id);
  if (lesson) return { ...lesson, kind: 'lesson', label: lesson.title };
  const question = catalog.questions.find(item => item.id === id);
  return question ? { ...question, kind: 'question', label: question.prompt } : null;
}

// The UI and personal v1 use SUBJECT buckets, despite their historical "topic" name.
// Never put granular IDs such as os-processes into personal.customQuestions.topicId.
export function toSubjectGroups(catalog) {
  return catalog.subjects.map(subject => ({
    id: subject.id, title: subject.title, icon: subject.icon,
    questions: catalog.questions.filter(q => q.subjectId === subject.id)
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .map(q => ({
        id: q.id, q: q.prompt, a: q.answerHtml, d: difficulties[q.difficulty], freq: q.frequent,
        ...(q.followUps?.length ? { cross: q.followUps } : {}),
        ...(q.misconception ? { trap: q.misconception } : {}),
        ...(q.lessonId ? { lessonId: q.lessonId } : {}),
      })),
  }));
}

export function contentHref(kind, id, section = '', { practice = false, returnTo = '' } = {}) {
  const query = new URLSearchParams();
  if (practice) query.set('practice', '1');
  if (validReturn(returnTo)) query.set('from', returnTo);
  return `#/${kind}/${encodeURIComponent(id)}${section ? `/${encodeURIComponent(section)}` : ''}${query.size ? `?${query}` : ''}`;
}

function validReturn(value) {
  return /^#\/(?:lesson\/[a-z][a-z0-9_-]*(?:\/[a-z][a-z0-9_-]*)?|subject\/[a-z][a-z0-9_-]*(?:\?topic=[a-z][a-z0-9_-]*)?)$/.test(value);
}

export const practiceHref = (id, returnTo, section = '') => contentHref('question', id, section, { practice: true, returnTo });

export function parseContentRoute(hash) {
  try {
    const [pathname, query = ''] = hash.split('?');
    const params = new URLSearchParams(query);
    const page = /^#\/(home|progress|notes|subject|practice)(?:\/([^/]+))?$/.exec(pathname);
    if (page) return page[1] === 'home'
      ? { kind: 'home' }
      : { kind: page[1], id: decodeURIComponent(page[2]), ...(page[1] === 'subject' && params.has('topic') ? { topicId: params.get('topic') } : {}) };
    const match = /^#\/(lesson|question)\/([^/]+)(?:\/([^/]+))?$/.exec(pathname);
    if (!match) return null;
    const returnTo = params.get('from');
    return { kind: match[1], id: decodeURIComponent(match[2]), section: match[3] ? decodeURIComponent(match[3]) : '',
      ...(match[1] === 'question' && params.get('practice') === '1' ? { practice: true } : {}),
       ...(validReturn(returnTo) ? { returnTo } : {}) };
  } catch { return null; }
}
