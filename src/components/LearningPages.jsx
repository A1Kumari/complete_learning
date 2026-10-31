import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock3, FileText, Layers3, Pencil, Search, Target } from 'lucide-react';
import { useState } from 'react';
import { contentHref } from '../content/adapter';
import SubjectNotebook from './SubjectNotebook';

const palette = { blue: 'blue', violet: 'violet', green: 'green', orange: 'orange', rose: 'rose', teal: 'teal' };

function StatRing({ percent = 0, label = 'No progress yet' }) {
  return <div className="stat-ring-wrap"><div className="stat-ring" style={{ '--progress': `${percent * 3.6}deg` }}><span>{percent}%</span></div><div><strong>{label}</strong><small>Based on marked interview questions</small></div></div>;
}

export function SubjectCard({ subject, questionCount, lessonCount }) {
  return <a className={`subject-card accent-${palette[subject.accent] || 'blue'}`} href={contentHref('subject', subject.id)}>
    <span className="subject-icon">{subject.icon}</span><div className="subject-card-copy"><h3>{subject.shortTitle || subject.title}</h3><p>{subject.description}</p></div>
    <div className="subject-card-foot"><span>{questionCount} interview questions{lessonCount ? ` · ${lessonCount} lesson${lessonCount === 1 ? '' : 's'}` : ''}</span><span className="card-arrow"><ArrowRight size={17} /></span></div>
  </a>;
}

export function LearningArchitecture({ subjects }) {
  const groups = ['Core CS', 'Development'];
  return <section className="architecture-panel"><div className="section-heading architecture-heading"><div><span className="eyebrow">LEARNING ARCHITECTURE</span><h2>Your path from foundations to engineering</h2><p>A focused map of the subjects in this workspace.</p></div></div><div className="architecture-root">LEARNING</div><div className="architecture-groups">{groups.map(group => <div className="architecture-group" key={group}><div className="architecture-branch"><span>{group}</span></div><div className="architecture-nodes">{subjects.filter(subject => subject.category === group).sort((a, b) => a.architectureOrder - b.architectureOrder).map(subject => <a className="architecture-node" href={contentHref('subject', subject.id)} key={subject.id}><span>{subject.icon}</span>{subject.shortTitle || subject.title}</a>)}</div></div>)}</div></section>;
}

function ProgressSummary({ data }) {
  const questions = data.flatMap(topic => topic.questions);
  const marked = questions.filter(question => question.status && question.status !== 'not-started');
  const mastered = questions.filter(question => question.status === 'mastered').length;
  const percent = questions.length ? Math.round((mastered / questions.length) * 100) : 0;
  return <section className="progress-panel"><div className="section-heading"><div><span className="eyebrow">YOUR LEARNING</span><h2>Progress that reflects your work</h2></div><a className="panel-link" href="#/progress">View details <ArrowRight size={14} /></a></div><StatRing percent={percent} label={marked.length ? `${marked.length} questions reviewed` : 'Ready when you are'} /><div className="progress-detail"><span><i className="legend-dot mastered" />Mastered <b>{mastered}</b></span><span><i className="legend-dot marked" />Marked <b>{marked.length - mastered}</b></span><span><i className="legend-dot empty" />Not started <b>{questions.length - marked.length}</b></span></div></section>;
}

export function DashboardPage({ subjects, data, content }) {
  const questionCounts = Object.fromEntries(data.map(topic => [topic.id, topic.questions.length]));
  const lessonCounts = Object.fromEntries(subjects.map(subject => [subject.id, content.lessons.filter(lesson => lesson.subjectId === subject.id).length]));
  const firstLesson = content.lessons[0];
  return <div className="page dashboard-page">
    <section className="welcome-hero"><div><span className="eyebrow">YOUR LEARNING PATH</span><h1>Build understanding<br /><em>one concept at a time.</em></h1><p>Explore computer science fundamentals and practical development topics through focused lessons and interview practice.</p><a className="primary-button" href={firstLesson ? contentHref('lesson', firstLesson.id) : contentHref('subject', subjects[0]?.id)}>Start with a lesson <ArrowRight size={17} /></a></div><div className="hero-illustration"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-stack"><BookOpen size={42} /><span>LEARN<br />DEEPER</span></div></div></section>
    <LearningArchitecture subjects={subjects} /><div className="dashboard-grid"><div><div className="section-heading"><div><span className="eyebrow">CURRICULUM</span><h2>Explore the curriculum</h2><p>Real content from your learning library, organized by subject.</p></div><span className="content-count">{subjects.length} subjects</span></div><div className="subject-grid">{subjects.map(subject => <SubjectCard key={subject.id} subject={subject} questionCount={questionCounts[subject.id] || 0} lessonCount={lessonCounts[subject.id] || 0} />)}</div></div><ProgressSummary data={data} /></div>
    <section className="continue-panel"><div className="section-heading"><div><span className="eyebrow">CONTINUE LEARNING</span><h2>Pick up where you left off</h2></div></div>{firstLesson ? <a className="continue-card" href={contentHref('lesson', firstLesson.id)}><span className="continue-icon"><BookOpen size={21} /></span><div><small>{subjects.find(s => s.id === firstLesson.subjectId)?.title} · lesson</small><h3>{firstLesson.title}</h3><p>{firstLesson.summary}</p></div><span className="card-arrow"><ArrowRight size={17} /></span></a> : <div className="empty-inline"><FileText size={20} /> Lessons will appear here as Markdown content is added.</div>}</section>
  </div>;
}

export function SubjectPage(props) {
  const { subject, content, topicId } = props;
  const [localSelectedTopicId, setLocalSelectedTopicId] = useState(null);
  const selectedTopicId = topicId || localSelectedTopicId;
  const selectedTopic = content.topics.find(topic => topic.id === selectedTopicId && topic.subjectId === subject.id);
  const openTopic = event => {
    const card = event.target.closest('.topic-card');
    if (!card) return;
    const topic = content.topics.find(item => item.subjectId === subject.id && item.title === card.querySelector('h3')?.textContent);
    if (topic) {
      setLocalSelectedTopicId(topic.id);
      window.location.hash = `${contentHref('subject', subject.id)}?topic=${encodeURIComponent(topic.id)}`;
    }
  };
  const prepareCards = node => {
    node?.querySelectorAll('.topic-card').forEach(card => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', `Open ${card.querySelector('h3')?.textContent}`);
    });
  };
  const topicLessons = selectedTopic ? content.lessons.filter(lesson => lesson.topicId === selectedTopic.id).sort((a, b) => a.order - b.order) : [];
  const topicQuestions = selectedTopic ? content.questions.filter(question => question.topicId === selectedTopic.id) : [];
  return <>
    <div ref={prepareCards} onClick={openTopic} onKeyDown={event => {
      if (event.target.matches('.topic-card') && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openTopic(event);
      }
     }}>{subject.id === 'ai-engineering' && <CurriculumRoadmap topics={content.topics.filter(topic => topic.subjectId === subject.id)} />}<SubjectOverview {...props} /></div>
     <SubjectNotebook subject={subject} />
     {selectedTopic && <dialog open ref={node => { if (node && !node.dataset.focused) { node.dataset.focused = 'true'; node.querySelector('button')?.focus(); } }} className="topic-content-dialog" aria-modal="true" aria-labelledby="topic-content-title" onCancel={() => {
       setLocalSelectedTopicId(null);
       window.location.hash = contentHref('subject', subject.id);
     }} onKeyDown={event => {
      if (event.key === 'Escape') {
        setLocalSelectedTopicId(null);
        window.location.hash = contentHref('subject', subject.id);
      }
      if (event.key === 'Tab') {
        const controls = [...event.currentTarget.querySelectorAll('button, a[href]')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
      <button className="secondary-button" onClick={() => {
        setLocalSelectedTopicId(null);
        window.location.hash = contentHref('subject', subject.id);
        document.querySelector(`[aria-label="Open ${selectedTopic.title}"]`)?.focus();
      }}>Close</button>
      <h2 id="topic-content-title">{selectedTopic.title}</h2>
      <p>{selectedTopic.description}</p>
      {topicLessons.length > 0 && <><h3>Lessons</h3><div className="topic-content-links">{topicLessons.map(lesson => <a key={lesson.id} href={contentHref('lesson', lesson.id, '', { returnTo: `${contentHref('subject', subject.id)}?topic=${encodeURIComponent(selectedTopic.id)}` })}><BookOpen size={18} /><span><strong>{lesson.title}</strong><small>{lesson.summary}</small></span><ChevronRight size={18} /></a>)}</div></>}
      {topicQuestions.length > 0 && <><h3>Interview questions ({topicQuestions.length})</h3><div className="topic-content-links">{topicQuestions.map(question => <a key={question.id} href={contentHref('question', question.id, '', { returnTo: `${contentHref('subject', subject.id)}?topic=${encodeURIComponent(selectedTopic.id)}` })}><Target size={18} /><span>{question.prompt}</span><ChevronRight size={18} /></a>)}</div></>}
      {!topicLessons.length && !topicQuestions.length && <p>Planned topic — lessons and interview questions will appear here when published.</p>}
    </dialog>}
  </>;
}

function CurriculumRoadmap({ topics }) {
  const phases = [...new Map(topics.filter(topic => topic.phase).map(topic => [topic.phase, topic.phaseTitle])).entries()];
  const byId = Object.fromEntries(topics.map(topic => [topic.id, topic]));
  return <section className="curriculum-roadmap" aria-labelledby="ai-roadmap-title">
    <div className="section-heading roadmap-heading"><div><span className="eyebrow">LEARNING ROADMAP</span><h2 id="ai-roadmap-title">Eight phases, one progression</h2><p>Follow the recommended path, or use prerequisites to enter an advanced phase safely.</p></div></div>
    <div className="roadmap-phases">{phases.map(([phase, title]) => {
      const phaseTopics = topics.filter(topic => topic.phase === phase).sort((a, b) => a.order - b.order);
      const milestone = phaseTopics.find(topic => topic.milestone)?.milestone;
      return <section className="roadmap-phase" key={phase}><div className="roadmap-phase-heading"><span className="phase-number">{String(phase).padStart(2, '0')}</span><div><h3>{title}</h3><span>{phaseTopics.length} topics</span></div></div><div className="roadmap-topic-list">{phaseTopics.map(topic => <div className="roadmap-topic" key={topic.id}><strong>{topic.title}</strong>{topic.prerequisiteIds?.length > 0 && <small>After: {topic.prerequisiteIds.map(id => byId[id]?.title || id).join(', ')}</small>}</div>)}</div>{milestone && <p className="roadmap-milestone"><strong>Build checkpoint:</strong> {milestone}</p>}</section>;
    })}</div>
  </section>;
}

function SubjectOverview({ subject, data, content }) {
  const subjectTopics = content.topics.filter(topic => topic.subjectId === subject.id).sort((a, b) => a.order - b.order);
  const questions = data.find(topic => topic.id === subject.id)?.questions || [];
  const lessons = content.lessons.filter(lesson => lesson.subjectId === subject.id).sort((a, b) => a.order - b.order);
  const mastered = questions.filter(question => question.status === 'mastered').length;
  return <div className="page subject-page"><div className="breadcrumbs"><a href="#/home">Home</a><ChevronRight size={14} /><span>{subject.category}</span><ChevronRight size={14} /><strong>{subject.title}</strong></div><section className={`subject-hero accent-${palette[subject.accent] || 'blue'}`}><div><span className="eyebrow">{subject.category.toUpperCase()} SUBJECT</span><h1>{subject.title}</h1><p>{subject.description}</p><div className="hero-meta"><span><Layers3 size={16} />{subjectTopics.length} topic{subjectTopics.length === 1 ? '' : 's'}</span><span><Target size={16} />{questions.length} interview questions</span></div></div><StatRing percent={questions.length ? Math.round((mastered / questions.length) * 100) : 0} label={mastered ? `${mastered} mastered` : 'Not started'} /></section><div className="section-heading subject-heading"><div><span className="eyebrow">CURRICULUM OUTLINE</span><h2>Topics and lessons</h2><p>Planned topics are shown separately from published learning material.</p></div></div><div className="topic-grid">{subjectTopics.map(topic => { const topicLessons = lessons.filter(lesson => lesson.topicId === topic.id); const topicQuestions = content.questions.filter(question => question.topicId === topic.id); const published = topicLessons.length + topicQuestions.length > 0; const priorityLabel = topic.priority || 'Priority pending'; return <article className={`topic-card ${published ? 'has-content' : ''}`} key={topic.id}><div className="topic-card-top">{topic.group && <span className="topic-group">{topic.group}</span>}<span className={`priority-badge ${topic.priority ? `priority-${topic.priority.toLowerCase()}` : 'priority-pending'}`}>{priorityLabel}</span><span className={published ? 'topic-status published' : 'topic-status'}>{published ? <><CheckCircle2 size={13} />Content available</> : 'Planned'}</span></div><h3>{topic.title}</h3><p>{topic.description}</p><div className="topic-scope">{topic.scope.map(item => <span key={item}>{item}</span>)}</div><div className="topic-card-foot"><span>{topicLessons.length} lesson{topicLessons.length === 1 ? '' : 's'} · {topicQuestions.length} question{topicQuestions.length === 1 ? '' : 's'}</span></div></article>; })}</div>{lessons.length > 0 && <><div className="section-heading"><div><span className="eyebrow">PUBLISHED LESSONS</span><h2>Read and go deeper</h2></div></div><div className="lesson-cards">{lessons.map((lesson, index) => <a className="lesson-card" key={lesson.id} href={contentHref('lesson', lesson.id)}><span className="lesson-number">{String(index + 1).padStart(2, '0')}</span><div><span className="card-kicker">{subjectTopics.find(topic => topic.id === lesson.topicId)?.title || 'Lesson'}</span><h3>{lesson.title}</h3><p>{lesson.summary}</p><div className="lesson-meta"><span><Clock3 size={14} />Read at your pace</span><span>{lesson.sections.filter(section => section.level === 2).length} sections</span></div></div><ChevronRight className="lesson-chevron" size={20} /></a>)}</div></>}<section className="subject-practice"><div><span className="eyebrow">INTERVIEW PRACTICE</span><h2>Use questions to test your understanding</h2><p>Reveal answers only when you are ready. Your statuses and notes remain attached to each question.</p></div><a className="secondary-button" href={contentHref('practice', subject.id)}>Practice {subject.shortTitle || subject.title}<ArrowRight size={16} /></a></section></div>;
}

export function UpcomingPractice({ subject }) {
  return <div className="page upcoming-page"><div className="upcoming-card"><span className="upcoming-mark"><Target size={25} /></span><span className="eyebrow">INTERVIEW PRACTICE</span><h1>{subject?.title || 'This subject'} practice is coming soon</h1><p>The curriculum outline is ready. Interview questions and answers will be added here as the subject content is developed.</p><a className="secondary-button" href={contentHref('subject', subject?.id)}>Back to {subject?.shortTitle || subject?.title || 'subject'} overview <ArrowRight size={16} /></a></div></div>;
}

export function ProgressPage({ subjects, data, content }) {
  const groups = Object.fromEntries(data.map(topic => [topic.id, topic.questions]));
  const allQuestions = data.flatMap(topic => topic.questions);
  const mastered = allQuestions.filter(question => question.status === 'mastered').length;
  const marked = allQuestions.filter(question => question.status && question.status !== 'not-started').length;
  return <div className="page progress-page"><div className="page-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>My Progress</h1><p>Track your saved question progress across every subject.</p></div></div><div className="progress-overview"><div className="progress-stat-card"><span className="stat-card-icon blue"><BookOpen size={19} /></span><div><small>Published lessons</small><strong>{content.lessons.length}</strong><span>available to read</span></div></div><div className="progress-stat-card"><span className="stat-card-icon violet"><CheckCircle2 size={19} /></span><div><small>Questions reviewed</small><strong>{marked} / {allQuestions.length}</strong><span>{allQuestions.length ? Math.round((marked / allQuestions.length) * 100) : 0}% of question bank</span></div></div><div className="progress-stat-card"><span className="stat-card-icon orange"><Target size={19} /></span><div><small>Mastered</small><strong>{mastered}</strong><span>saved as mastered</span></div></div></div><div className="section-heading progress-section-heading"><div><span className="eyebrow">SUBJECT BREAKDOWN</span><h2>Progress by subject</h2><p>Only your saved comfort statuses contribute to these bars.</p></div></div><div className="progress-subject-list">{subjects.map(subject => { const questions = groups[subject.id] || []; const subjectMastered = questions.filter(question => question.status === 'mastered').length; const subjectMarked = questions.filter(question => question.status && question.status !== 'not-started').length; const percent = questions.length ? Math.round((subjectMastered / questions.length) * 100) : 0; const lessons = content.lessons.filter(lesson => lesson.subjectId === subject.id).length; return <a className="progress-subject-row" href={contentHref('subject', subject.id)} key={subject.id}><span className={`progress-subject-icon accent-${palette[subject.accent] || 'blue'}`}>{subject.icon}</span><span className="progress-subject-name"><strong>{subject.title}</strong><small>{lessons} published lesson{lessons === 1 ? '' : 's'} · {subjectMarked} / {questions.length} questions reviewed</small></span><span className="progress-track"><i style={{ width: `${percent}%` }} /></span><b className="progress-percent">{percent}%</b><ChevronRight size={17} /></a>; })}</div></div>;
}

export function NotesPage({ notes, onUpdate }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(notes[0]?.id || null);
  const visible = notes.filter(note => `${note.title} ${note.subject}`.toLowerCase().includes(query.toLowerCase()));
  const selected = visible.find(note => note.id === selectedId) || visible[0] || null;
  return <div className="page notes-page"><div className="page-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>My Notes</h1><p>Review and edit notes attached to your learning content.</p></div></div><div className="notes-toolbar"><span className="notes-count">{notes.length} saved note{notes.length === 1 ? '' : 's'}</span><label><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search notes..." /></label></div><div className="notes-layout"><div className="notes-list">{visible.length ? visible.map(note => <button className={`note-list-item ${selected?.id === note.id ? 'active' : ''}`} key={note.id} onClick={() => setSelectedId(note.id)}><strong>{note.title}</strong><small>{note.subject}</small><span>{note.body.slice(0, 70)}{note.body.length > 70 ? '...' : ''}</span></button>) : <div className="notes-empty">No saved notes match this search.</div>}</div><section className="note-detail">{selected ? <><div className="note-detail-heading"><div><span className="note-kind">{selected.kind === 'question' ? 'Interview question' : 'Practice template'}</span><h2>{selected.title}</h2><small>{selected.subject}</small></div><Pencil size={17} /></div><textarea value={selected.body} onChange={event => onUpdate(selected, event.target.value)} aria-label={`Edit note for ${selected.title}`} /><p className="note-save-hint">Notes save automatically to your existing personal learning data.</p></> : <div className="notes-empty large">Select a saved note to edit it.</div>}</section></div></div>;
}
