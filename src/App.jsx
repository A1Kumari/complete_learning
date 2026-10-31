import React, { useState, useEffect, useMemo, useCallback, useRef, useSyncExternalStore } from 'react';
import { BookOpen, Edit3, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { D, TOPICS, DSA_TEMPLATES, CONTENT, MIGRATION_BASELINES } from './data';
import LessonReader from './components/LessonReader';
import { contentHref, parseContentRoute } from './content/adapter';
import DSATemplatesList from './components/DSATemplatesList';
import DSAQATable from './components/DSAQATable';
import { openPersonalStore, deriveTopics, deriveTemplates, updateQuestion, deleteQuestion, updateTemplateStatus, updateTemplateNote, parseBackup } from './personalData';
import LearningShell from './components/LearningShell';
import { localDay, shouldTrackStudy } from './studyProgress';
import ProgressPage from './components/ProgressPage';
import { DashboardPage, SubjectPage, UpcomingPractice, NotesPage } from './components/LearningPages';
import './App.css';

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started', dot: 'dot-not-started', opt: 'opt-not-started' },
  { value: 'learning', label: 'Learning', dot: 'dot-learning', opt: 'opt-learning' },
  { value: 'comfortable', label: 'Comfortable', dot: 'dot-comfortable', opt: 'opt-comfortable' },
  { value: 'mastered', label: 'Mastered', dot: 'dot-mastered', opt: 'opt-mastered' },
  { value: 'revisit', label: 'Revisit', dot: 'dot-revisit', opt: 'opt-revisit' },
];

const subscribeHash = callback => {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
};
const getHash = () => window.location.hash;

const App = () => {
  const hash = useSyncExternalStore(subscribeHash, getHash);
  const route = useMemo(() => parseContentRoute(hash) || { kind: 'home' }, [hash]);
  const lesson = route?.kind === 'lesson' ? CONTENT.lessons.find(l => l.id === route.id) : null;
  const routedQuestion = route?.kind === 'question' ? CONTENT.questions.find(q => q.id === route.id) : null;
  const isLesson = route?.kind === 'lesson';
  const [selectedTopic, setActiveTopic] = useState(() => lesson?.subjectId || routedQuestion?.subjectId || 'os');
  const activeTopic = lesson?.subjectId || routedQuestion?.subjectId || (route?.kind === 'practice' ? route.id : null) || selectedTopic;
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const routedAnswerVisible = route?.kind === 'question' && (!route.practice || expandedQuestions.has(route.id));
  const returnLesson = route?.returnTo ? CONTENT.lessons.find(item => item.id === parseContentRoute(route.returnTo)?.id) : null;
  const [activeQuestionKey, setActiveQuestionKey] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    q: '', a: '', d: 'e', freq: false, notes: '', trap: '', cross: '', status: 'not-started'
  });

  const [store] = useState(() => {
    // Access to localStorage itself may throw (e.g. restricted browser contexts).
    const storage = {
      getItem: key => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value),
      key: index => window.localStorage.key(index),
      get length() { return window.localStorage.length; },
    };
    return openPersonalStore(storage, D, DSA_TEMPLATES.templates, MIGRATION_BASELINES);
  });
  const [personal, setPersonal] = useState(store.personal);
  const latestPersonal = useRef(store.personal);
  const [storageError, setStorageError] = useState(store.error);
  const [backupMessage, setBackupMessage] = useState('');
  const [migrationSummary, setMigrationSummary] = useState(store.summary);
  const data = useMemo(() => deriveTopics(D, personal), [personal]);
  const dsaTemplatesWithNotes = useMemo(() => deriveTemplates(DSA_TEMPLATES.templates, personal), [personal]);
  const savedNotes = useMemo(() => [
    ...data.flatMap(topic => topic.questions.filter(question => question.notes?.trim()).map(question => ({
      id: `question:${question.id}`, kind: 'question', title: question.q, subject: topic.title, body: question.notes, sourceId: question.id,
    }))),
    ...dsaTemplatesWithNotes.filter(template => template.notes?.trim()).map(template => ({
      id: `template:${template.id}`, kind: 'template', title: template.name, subject: 'DSA', body: template.notes, sourceId: template.id,
    })),
  ], [data, dsaTemplatesWithNotes]);

  // Commit migration after mount, with cancellation for Strict Mode's trial effect.
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled || store.error) return;
      try { store.save(store.personal); }
      catch (error) { setStorageError(`Not saved: ${error.message}`); }
    });
    return () => { cancelled = true; };
  }, [store]);

  useEffect(() => {
    const resetView = () => {
      setSearchQuery(''); setShowNotes(false); setActiveQuestionKey(null);
      setExpandedQuestions(new Set());
      const next = parseContentRoute(window.location.hash);
      const target = next?.kind === 'lesson' ? CONTENT.lessons.find(item => item.id === next.id)
        : next?.kind === 'question' ? CONTENT.questions.find(item => item.id === next.id) : null;
      if (target) setActiveTopic(target.subjectId);
    };
    return subscribeHash(resetView);
  }, []);

  useEffect(() => {
    if (route?.kind !== 'question') return;
    const card = document.getElementById(`question-${route.id}`);
    if (!card) return;
    const section = routedAnswerVisible && route.section
      ? [...card.querySelectorAll('[data-section]')].find(node => node.dataset.section === route.section) : null;
    const target = section || card;
    target.scrollIntoView({ block: 'start' });
    target.focus({ preventScroll: true });
  }, [route, routedAnswerVisible]);

  const commit = useCallback(next => {
    // Keep unsaved edits in memory and exportable even if storage is full.
    setPersonal(next);
    latestPersonal.current = next;
    try { store.save(next); setStorageError(''); }
    catch (error) { setStorageError(`Not saved: ${error.message}`); }
  }, [store]);

  useEffect(() => {
    if (!shouldTrackStudy(import.meta.env.PROD, window.location.hostname) || !['lesson', 'practice', 'question'].includes(route.kind)) return;
    let activeUntil = Date.now() + 60000;
    let previous = Date.now();
    const activity = () => { activeUntil = Date.now() + 60000; };
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, activity, { passive: true }));
    const timer = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.min(10, Math.floor((now - previous) / 1000));
      previous = now;
      if (document.visibilityState !== 'visible' || now > activeUntil || elapsed <= 0) return;
      const current = latestPersonal.current;
      const day = localDay();
      commit({ ...current, studyDays: { ...current.studyDays, [day]: (current.studyDays[day] || 0) + elapsed } });
    }, 5000);
    return () => { clearInterval(timer); events.forEach(event => window.removeEventListener(event, activity)); };
  }, [route.kind, commit]);

  const toggleLessonCompletion = () => {
    if (!lesson) return;
    const current = latestPersonal.current;
    const completed = current.completedLessonIds.includes(lesson.id);
    commit({ ...current, completedLessonIds: completed ? current.completedLessonIds.filter(id => id !== lesson.id) : [...current.completedLessonIds, lesson.id],
      studyDays: shouldTrackStudy(import.meta.env.PROD, window.location.hostname)
        ? { ...current.studyDays, [localDay()]: current.studyDays[localDay()] || 1 }
        : current.studyDays });
  };

  const exportBackup = () => {
    try {
      const url = URL.createObjectURL(new Blob([store.export(personal)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `cs-learning-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setBackupMessage('Backup exported.');
    } catch (error) { setBackupMessage(`Export failed: ${error.message}`); }
  };

  const importBackup = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const backup = parseBackup(text);
      if (!window.confirm(`Restore backup with ${backup.personal.customQuestions.length} custom questions? This replaces current personal data. A copy of current saved data will be retained.`)) return;
      // Include in-memory edits in the pre-restore archive, even after a failed save.
      const next = store.restore(text, latestPersonal.current);
      setPersonal(next);
      latestPersonal.current = next;
      setMigrationSummary(null);
      setActiveQuestionKey(null);
      setExpandedQuestions(new Set());
      setStorageError('');
      setBackupMessage('Backup restored. Previous saved data is retained in backup archives.');
    } catch (error) { setBackupMessage(`Restore failed: ${error.message}`); }
  };

  const toggleQuestion = (key) => {
    if (route?.kind === 'question' && route.id === key && !route.practice) {
      setExpandedQuestions(prev => { const next = new Set(prev); next.delete(key); return next; });
      window.location.hash = '';
      return;
    }
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const updateNote = (id, text) => commit(updateQuestion(personal, id, { notes: text }));
  const updateStatus = (id, status) => commit(updateQuestion(personal, id, { status }));

  const handleAddQuestion = () => {
    if (!newQuestion.q.trim() || !newQuestion.a.trim()) return;

    const questionToAdd = {
      id: `custom-${crypto.randomUUID()}`,
      topicId: activeTopic,
      q: newQuestion.q.trim(),
      a: newQuestion.a.trim(),
      d: newQuestion.d,
      freq: newQuestion.freq,
      trap: newQuestion.trap.trim() || undefined,
      cross: newQuestion.cross.trim()
        ? newQuestion.cross.split('\n').filter(c => c.trim())
        : undefined
    };

    commit(updateQuestion({ ...personal, customQuestions: [...personal.customQuestions, questionToAdd] }, questionToAdd.id,
      { notes: newQuestion.notes.trim(), status: newQuestion.status || 'not-started' }));

    setNewQuestion({ q: '', a: '', d: 'e', freq: false, notes: '', trap: '', cross: '', status: 'not-started' });
    setShowAddModal(false);
  };

  const handleDeleteQuestion = (id) => {
    if (!window.confirm('Delete this question?')) return;
    commit(deleteQuestion(personal, id));
    setActiveQuestionKey(null);
  };

  const filteredQuestions = useMemo(() => {
    const topic = data.find(t => t.id === activeTopic);
    if (!topic) return [];

    return topic.questions
      .map(q => ({
        ...q,
        topicId: topic.id,
        key: q.id
      }))
      .filter(q =>
        !searchQuery ||
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [data, activeTopic, searchQuery]);

  const activeQuestion = useMemo(() => {
    if (!activeQuestionKey) return null;
    return filteredQuestions.find(q => q.key === activeQuestionKey) || null;
  }, [activeQuestionKey, filteredQuestions]);

  // Progress stats for current topic
  const progressStats = useMemo(() => {
    const total = filteredQuestions.length;
    if (total === 0) return null;

    const counts = { 'not-started': 0, learning: 0, comfortable: 0, mastered: 0, revisit: 0 };
    filteredQuestions.forEach(q => {
      const s = q.status || 'not-started';
      counts[s] = (counts[s] || 0) + 1;
    });

    return { total, counts };
  }, [filteredQuestions]);

  const updateDsaTemplateStatus = (templateId, newStatus) => {
    commit(updateTemplateStatus(personal, templateId, newStatus));
  };

  const updateSavedNote = (note, text) => commit(note.kind === 'question'
    ? updateQuestion(personal, note.sourceId, { notes: text })
    : updateTemplateNote(personal, note.sourceId, text));

  const activeSubject = CONTENT.subjects.find(subject => subject.id === activeTopic) || CONTENT.subjects[0];
  const backupActions = <>
    <button className="header-icon-action" onClick={exportBackup} title="Export backup">Export</button>
    <label className="header-icon-action backup-import">Import<input type="file" accept=".json,application/json" onChange={importBackup} /></label>
  </>;

  return (
    <LearningShell subjects={CONTENT.subjects} activeSubject={activeSubject?.id} searchQuery={searchQuery} onSearch={setSearchQuery} legacyActions={backupActions}>
      {route?.kind === 'home' ? <DashboardPage subjects={CONTENT.subjects} data={data} content={CONTENT} />
        : route?.kind === 'progress' ? <ProgressPage subjects={CONTENT.subjects} data={data} content={CONTENT} personal={personal} />
        : route?.kind === 'notes' ? <NotesPage notes={savedNotes} onUpdate={updateSavedNote} />
        : route?.kind === 'subject' ? <SubjectPage subject={CONTENT.subjects.find(subject => subject.id === route.id) || CONTENT.subjects[0]} data={data} content={CONTENT} />
        : route?.kind === 'lesson' ? <div className="lesson-page-frame">{lesson && <button className="secondary-button" onClick={toggleLessonCompletion}>{personal.completedLessonIds.includes(lesson.id) ? '✓ Completed — mark incomplete' : 'Mark lesson complete'}</button>}<LessonReader key={lesson?.id || 'missing'} lesson={lesson} section={route.section} /></div>
        : route?.kind === 'practice' && filteredQuestions.length === 0 ? <UpcomingPractice subject={CONTENT.subjects.find(subject => subject.id === route.id)} />
        : <div className="legacy-workspace">
      <div className={`app-container ${showNotes ? 'notes-open' : ''}`}>
      <div className="main-content">
        <a className="question-back" href={contentHref('subject', activeSubject.id)}>← Back to sections</a>
        <header>
          {CONTENT.draftPreview && <p className="preview-banner" role="status">Local draft preview — unpublished content. Production builds exclude drafts.</p>}

          {storageError && <div className="info-box trap-box" role="alert">
            {storageError} Edits remain available to export in this tab.
            <button className="btn-action" onClick={() => commit(personal)}>Retry Save</button>
          </div>}
          {backupMessage && <p role="status">{backupMessage}</p>}
          {personal.recovery.length > 0 && (
            <details className="info-box cross-ref">
              <summary>Migration / recovery summary: {personal.recovery.length} records need review</summary>
              <p>All published questions are available unless deleted after migration. Unambiguous matches use the latest published content; original differing records are retained in backups.</p>
              {migrationSummary && <p>{migrationSummary.matched} matched entries; {migrationSummary.custom} recovered custom questions.</p>}
              <ul>{personal.recovery.map((item, index) => <li key={index}>{item.source}: {item.reason}</li>)}</ul>
              <p>Export Backup includes the complete recovery records and retained originals.</p>
            </details>
          )}

          {!isLesson && <div className="question-toolbar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="question-toolbar-actions">
              <span className="question-count">{filteredQuestions.length} Questions</span>
              {activeTopic !== 'dsa' && (
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                  <Plus size={16} /> Add
                </button>
              )}
            </div>
          </div>}
        </header>

        {/* Progress Bar */}
        {activeTopic !== 'dsa' && !isLesson && progressStats && (
          <div className="progress-bar-container">
            <span className="progress-bar-label">Progress</span>
            <div className="progress-bar">
              {progressStats.counts.mastered > 0 && (
                <div className="progress-segment progress-mastered"
                  style={{ width: `${(progressStats.counts.mastered / progressStats.total) * 100}%` }} />
              )}
              {progressStats.counts.comfortable > 0 && (
                <div className="progress-segment progress-comfortable"
                  style={{ width: `${(progressStats.counts.comfortable / progressStats.total) * 100}%` }} />
              )}
              {progressStats.counts.learning > 0 && (
                <div className="progress-segment progress-learning"
                  style={{ width: `${(progressStats.counts.learning / progressStats.total) * 100}%` }} />
              )}
              {progressStats.counts.revisit > 0 && (
                <div className="progress-segment progress-revisit"
                  style={{ width: `${(progressStats.counts.revisit / progressStats.total) * 100}%` }} />
              )}
            </div>
            <div className="progress-stats">
              <span className="progress-stat">
                <span className="status-dot dot-mastered"></span> {progressStats.counts.mastered}
              </span>
              <span className="progress-stat">
                <span className="status-dot dot-comfortable"></span> {progressStats.counts.comfortable}
              </span>
              <span className="progress-stat">
                <span className="status-dot dot-learning"></span> {progressStats.counts.learning}
              </span>
              <span className="progress-stat">
                <span className="status-dot dot-revisit"></span> {progressStats.counts.revisit}
              </span>
            </div>
          </div>
        )}

        <div className="question-list">
          {returnLesson && <a className="btn-action practice-return" href={route.returnTo}>← Return to {returnLesson.title}</a>}
          {isLesson ? <LessonReader key={lesson?.id || 'missing'} lesson={lesson} section={route.section} /> : <>
           {route?.kind === 'question' && !filteredQuestions.some(q => q.id === route.id) && <p role="status">
            {routedQuestion ? 'This question is hidden by your personal deletion marker.' : 'Question not found.'} <a href="#">Back to questions</a>
          </p>}
          {activeTopic === 'dsa' ? (
            <div>
              <DSAQATable questions={filteredQuestions} />
              <div style={{ marginTop: '3rem' }}>
                <h3 className="section-title">Practice Templates</h3>
                <DSATemplatesList
                  templates={dsaTemplatesWithNotes}
                  onStatusUpdate={updateDsaTemplateStatus}
                />
              </div>
            </div>
          ) : (
            <>
              {filteredQuestions.map((q, displayIndex) => {
                const isPractice = route?.kind === 'question' && route.id === q.id && route.practice;
                const isExpanded = expandedQuestions.has(q.key) || (route?.kind === 'question' && route.id === q.id && !route.practice);
                const isActive = activeQuestionKey === q.key || (route?.kind === 'question' && route.id === q.id);
                const currentStatus = q.status || 'not-started';
                const statusInfo = STATUS_OPTIONS.find(s => s.value === currentStatus);

                return (
                  <div key={q.key} id={`question-${q.id}`} tabIndex={-1} className={`question-card ${isActive ? 'active' : ''}`}>
                    <div
                      className="question-header"
                      onClick={() => toggleQuestion(q.key)}
                    >
                      <div className="question-title-row">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span className="question-text">
                          {displayIndex + 1}. {q.q}
                        </span>
                       </div>
                       {CONTENT.questions.find(item => item.id === q.id)?.status === 'draft' && <span className="badge badge-freq">Draft</span>}
                      <div className="badges">
                        {/* Status badge in header */}
                        {currentStatus !== 'not-started' && (
                          <span className={`badge badge-status status-${currentStatus}`}>
                            <span className={`status-dot ${statusInfo?.dot}`}></span>
                            {statusInfo?.label}
                          </span>
                        )}
                        {q.freq && <span className="badge badge-freq">Frequent</span>}
                        {q.d === 'e' && <span className="badge badge-easy">Easy</span>}
                        {q.d === 'm' && <span className="badge badge-med">Medium</span>}
                        {q.d === 'h' && <span className="badge badge-hard">Hard</span>}
                      </div>
                    </div>

                    {isPractice && <div className="practice-prompt">
                      <p>Explain your answer aloud or on paper, then compare it with the answer and criteria.</p>
                      <button className="btn-action btn-reveal" aria-expanded={isExpanded}
                        aria-controls={`question-${q.id}--answer`} onClick={() => toggleQuestion(q.id)}>
                        {isExpanded ? 'Hide answer' : 'Reveal answer'}
                      </button>
                    </div>}

                    {isExpanded && (
                      <div className="question-body">
                        <div
                          className="answer-text"
                          id={`question-${q.id}--answer`}
                          data-section="answer"
                          tabIndex={-1}
                          dangerouslySetInnerHTML={{ __html: q.a }}
                        />

                        {q.cross && q.cross.length > 0 && (
                          <div className="info-box cross-ref">
                            <strong>Cross-Reference</strong>
                            <ul>
                              {q.cross.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                          </div>
                        )}

                        {q.trap && (
                          <div className="info-box trap-box">
                            <strong>Trap</strong>
                            <p>{q.trap}</p>
                          </div>
                        )}

                        {/* Status Selector */}
                        <div className="status-selector">
                          <span className="status-selector-label">Comfort Level</span>
                          {STATUS_OPTIONS.map(option => (
                            <button
                              key={option.value}
                              className={`status-option ${currentStatus === option.value ? `selected ${option.opt}` : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(q.id, option.value);
                              }}
                            >
                              <span className={`status-dot ${option.dot}`}></span>
                              {option.label}
                            </button>
                          ))}
                        </div>

                        <div className="question-actions">
                          {q.lessonId && <a className="btn-action" href={contentHref('lesson', q.lessonId)}>Read lesson</a>}
                          <button
                            className="btn-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveQuestionKey(q.key);
                              setShowNotes(true);
                            }}
                          >
                            <Edit3 size={14} />
                            {q.notes ? 'Edit Notes' : 'Add Notes'}
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(q.id);
                            }}
                          >
                            <X size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredQuestions.length === 0 && (
                <div className="empty-state">
                  <p>No questions found. Try a different search or add new ones!</p>
                </div>
              )}
            </>
          )}</>}
        </div>
      </div>

      {/* Notes Panel */}
      {activeTopic !== 'dsa' && !isLesson && showNotes && (
        <div className="notes-panel show-on-mobile">
          <div className="notes-header">
            <span>{activeQuestion ? 'Note Taking' : 'Notes'}</span>
            <button className="btn-close-notes" onClick={() => { setShowNotes(false); setActiveQuestionKey(null); }}>
              <X size={18} />
            </button>
          </div>
          <div className="notes-content">
            {activeQuestion ? (
              <div>
                <div className="notes-question-info">
                  <span className="badge badge-freq">{activeQuestion.topicId.toUpperCase()}</span>
                  <h3>{activeQuestion.q}</h3>
                </div>
                <textarea
                  className="note-editor"
                  placeholder="Write your notes here..."
                  value={activeQuestion.notes || ''}
                  onChange={(e) =>
                    updateNote(activeQuestion.id, e.target.value)
                  }
                />
                <p className="notes-save-hint">
                  {storageError ? 'Notes are not saved. Export a backup or retry saving.' : 'Notes are automatically saved.'}
                </p>
              </div>
            ) : (
              <div className="empty-notes">
                <BookOpen size={48} strokeWidth={1} />
                <p>Select a question to view or add notes.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Question to {TOPICS.find(t => t.id === activeTopic)?.title}</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
                            <label>
                Question *
                <textarea
                  value={newQuestion.q}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, q: e.target.value }))}
                  placeholder="Enter your question..."
                  rows={2}
                />
              </label>

              <label>
                Answer * (HTML supported)
                <textarea
                  value={newQuestion.a}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, a: e.target.value }))}
                  placeholder="Enter the answer... HTML tags like <b>, <ul>, <li> work"
                  rows={5}
                />
              </label>

              <div className="modal-row">
                <label>
                  Difficulty
                  <select
                    value={newQuestion.d}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, d: e.target.value }))}
                  >
                    <option value="e">Easy</option>
                    <option value="m">Medium</option>
                    <option value="h">Hard</option>
                  </select>
                </label>

                <label>
                  Status
                  <select
                    value={newQuestion.status}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newQuestion.freq}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, freq: e.target.checked }))}
                />
                Frequently Asked
              </label>

              <label>
                Trap (optional)
                <input
                  type="text"
                  value={newQuestion.trap}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, trap: e.target.value }))}
                  placeholder="Common misconception..."
                />
              </label>

              <label>
                Cross-references (one per line, optional)
                <textarea
                  value={newQuestion.cross}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, cross: e.target.value }))}
                  placeholder={"Related to: Process Scheduling\nSee also: Thread vs Process"}
                  rows={2}
                />
              </label>

              <label>
                Notes (optional)
                <textarea
                  value={newQuestion.notes}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Your personal notes..."
                  rows={2}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleAddQuestion}
                disabled={!newQuestion.q.trim() || !newQuestion.a.trim()}
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
        </div>}
    </LearningShell>
  );
};

export default App;
