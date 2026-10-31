import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CONTENT } from '../data';
import { contentHref, practiceHref, lessonQuestions, contentItem } from '../content/adapter';

const wideScreen = () => window.matchMedia('(min-width: 769px)').matches;
const subscribeScreen = callback => {
  const media = window.matchMedia('(min-width: 769px)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

export default function LessonReader({ lesson, section = '', returnTo = '' }) {
  const [loaded, setLoaded] = useState(null);
  const [failure, setFailure] = useState(null);
  const article = useRef(null);
  const wide = useSyncExternalStore(subscribeScreen, wideScreen);
  const id = lesson?.id;
  const url = lesson?.payloadUrl;

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Lesson could not be loaded.'); return response.json(); })
      .then(payload => {
        if (payload.id !== id || typeof payload.html !== 'string') throw new Error('Invalid lesson payload.');
        if (!controller.signal.aborted) setLoaded(payload);
      })
      .catch(error => { if (!controller.signal.aborted) setFailure({ id, message: error.message }); });
    return () => controller.abort();
  }, [id, url]);

  useEffect(() => {
    if (loaded?.id !== id) return;
    const target = section ? [...article.current.querySelectorAll('[id]')].find(node => node.id === section) : null;
    const element = target || article.current;
    element.scrollIntoView({ block: 'start' });
    element.focus({ preventScroll: true });
  }, [id, loaded, section]);

  if (!lesson) return <section><a href="#/home">Back</a><p role="alert">Lesson not found.</p></section>;
  const questions = lessonQuestions(CONTENT, lesson.id);
  const prerequisites = lesson.prerequisiteIds.map(id => contentItem(CONTENT, id)).filter(Boolean);
  const related = lesson.relatedIds.filter(id => !questions.some(q => q.id === id))
    .map(id => contentItem(CONTENT, id)).filter(Boolean);
  const topic = CONTENT.topics.find(t => t.id === lesson.topicId);
  const subject = CONTENT.subjects.find(s => s.id === lesson.subjectId);
  const relatedHref = item => item.kind === 'question'
    ? practiceHref(item.id, contentHref('lesson', lesson.id, section || 'related-content'))
    : contentHref('lesson', item.id);

  return (
    <article className="lesson-reader" ref={article} tabIndex={-1}>
      <a href={returnTo || contentHref('subject', lesson.subjectId)} className="btn-action lesson-back">← Back</a>
      <p className="lesson-breadcrumb">{subject?.title} / {topic?.title}</p>
      {lesson.status === 'draft' && <span className="badge badge-freq">Draft — local preview</span>}
      <h2>{lesson.title}</h2>
      <p className="lesson-summary">{lesson.summary}</p>
      {prerequisites.length > 0 && <nav aria-label="Prerequisite lessons" className="lesson-context">
        <strong>Before this lesson</strong>
        <ul>{prerequisites.map(item => <li key={item.id}><a href={contentHref('lesson', item.id)}>{item.label}</a></li>)}</ul>
      </nav>}
      <details className="lesson-toc" key={wide ? 'wide' : 'mobile'} open={wide}>
        <summary>Contents</summary>
        <nav aria-label="Lesson sections" onClick={event => {
          if (!wide && event.target.closest('a')) event.currentTarget.closest('details').open = false;
        }}>
          {lesson.sections.filter(s => s.level === 2).map(s => (
            <a key={s.id} href={contentHref('lesson', lesson.id, s.id)}>{s.title}</a>
          ))}
          {questions.length > 0 && <a href={contentHref('lesson', lesson.id, 'interview-practice')}>Interview practice</a>}
        </nav>
      </details>
      {failure?.id === id ? <p role="alert">{failure.message} Reload to retry.</p>
        : loaded?.id === id ? <div className="lesson-body" dangerouslySetInnerHTML={{ __html: loaded.html }} />
          : <p role="status">Loading lesson…</p>}
      {questions.length > 0 && <section id="interview-practice" tabIndex={-1} className="lesson-practice">
        <h3>Interview practice</h3>
        <p>Try an answer aloud before revealing it. Reading an answer does not change your progress.</p>
        <ul>{questions.map(q => <li key={q.id}><a href={practiceHref(q.id, contentHref('lesson', lesson.id, 'interview-practice'))}>{q.prompt}</a></li>)}</ul>
      </section>}
      {related.length > 0 && <nav id="related-content" tabIndex={-1} aria-label="Related content" className="lesson-context">
        <strong>Related content</strong>
        <ul>{related.map(item => <li key={item.id}><a href={relatedHref(item)}>{item.label}</a></li>)}</ul>
      </nav>}
    </article>
  );
}
