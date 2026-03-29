import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Edit3, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { D, TOPICS, DSA_TEMPLATES } from './data';
import DSATemplatesList from './components/DSATemplatesList';
import DSAQATable from './components/DSAQATable';
import './App.css';

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started', dot: 'dot-not-started', opt: 'opt-not-started' },
  { value: 'learning', label: 'Learning', dot: 'dot-learning', opt: 'opt-learning' },
  { value: 'comfortable', label: 'Comfortable', dot: 'dot-comfortable', opt: 'opt-comfortable' },
  { value: 'mastered', label: 'Mastered', dot: 'dot-mastered', opt: 'opt-mastered' },
  { value: 'revisit', label: 'Revisit', dot: 'dot-revisit', opt: 'opt-revisit' },
];

const App = () => {
  const [activeTopic, setActiveTopic] = useState('os');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [activeQuestionKey, setActiveQuestionKey] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    q: '', a: '', d: 'e', freq: false, notes: '', trap: '', cross: '', status: 'not-started'
  });

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('cs-learning-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure every question has a status field
      return parsed.map(topic => ({
        ...topic,
        questions: topic.questions.map(q => ({
          status: 'not-started',
          notes: '',
          ...q
        }))
      }));
    }
    return D.map(topic => ({
      ...topic,
      questions: topic.questions.map(q => ({
        status: 'not-started',
        notes: '',
        ...q
      }))
    }));
  });

  const [dsaTemplates, setDsaTemplates] = useState(() => {
    const saved = localStorage.getItem('dsa-templates');
    return saved ? JSON.parse(saved) : DSA_TEMPLATES.templates;
  });

  const [dsaNotes, setDsaNotes] = useState(() => {
    const saved = localStorage.getItem('dsa-notes');
    return saved ? JSON.parse(saved) : {};
  });

  // Save effects
  useEffect(() => {
    localStorage.setItem('cs-learning-data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('dsa-templates', JSON.stringify(dsaTemplates));
  }, [dsaTemplates]);

  useEffect(() => {
    localStorage.setItem('dsa-notes', JSON.stringify(dsaNotes));
  }, [dsaNotes]);

  const getQuestionKey = (topicId, index) => `${topicId}-${index}`;

  const toggleQuestion = (key) => {
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

  const updateNote = useCallback((topicId, questionIndex, text) => {
    setData(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? {
              ...topic,
              questions: topic.questions.map((q, i) =>
                i === questionIndex ? { ...q, notes: text } : q
              )
            }
          : topic
      )
    );
  }, []);

  const updateStatus = useCallback((topicId, questionIndex, newStatus) => {
    setData(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? {
              ...topic,
              questions: topic.questions.map((q, i) =>
                i === questionIndex ? { ...q, status: newStatus } : q
              )
            }
          : topic
      )
    );
  }, []);

  const handleAddQuestion = () => {
    if (!newQuestion.q.trim() || !newQuestion.a.trim()) return;

    const questionToAdd = {
      q: newQuestion.q.trim(),
      a: newQuestion.a.trim(),
      d: newQuestion.d,
      freq: newQuestion.freq,
      notes: newQuestion.notes.trim(),
      status: newQuestion.status || 'not-started',
      trap: newQuestion.trap.trim() || undefined,
      cross: newQuestion.cross.trim()
        ? newQuestion.cross.split('\n').filter(c => c.trim())
        : undefined
    };

    setData(prev =>
      prev.map(topic =>
        topic.id === activeTopic
          ? { ...topic, questions: [...topic.questions, questionToAdd] }
          : topic
      )
    );

    setNewQuestion({ q: '', a: '', d: 'e', freq: false, notes: '', trap: '', cross: '', status: 'not-started' });
    setShowAddModal(false);
  };

  const handleDeleteQuestion = (topicId, questionIndex) => {
    if (!window.confirm('Delete this question?')) return;
    setData(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? { ...topic, questions: topic.questions.filter((_, i) => i !== questionIndex) }
          : topic
      )
    );
    setActiveQuestionKey(null);
  };

  const filteredQuestions = useMemo(() => {
    const topic = data.find(t => t.id === activeTopic);
    if (!topic) return [];

    return topic.questions
      .map((q, index) => ({
        ...q,
        topicId: topic.id,
        index,
        key: getQuestionKey(topic.id, index)
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
    setDsaTemplates(prev =>
      prev.map(t =>
        t.id === templateId
          ? { ...t, status: newStatus, attempts: t.attempts + 1 }
          : t
      )
    );
  };

  const dsaTemplatesWithNotes = useMemo(() => {
    return dsaTemplates.map(t => ({
      ...t,
      notes: dsaNotes[t.id] || ''
    }));
  }, [dsaTemplates, dsaNotes]);

  const dsaQuestions = useMemo(() => {
    const dsaTopic = data.find(t => t.id === 'dsa');
    return dsaTopic?.questions || [];
  }, [data]);

  return (
    <div className="app-container">
      <div className={`main-content ${showNotes ? 'hide-on-mobile' : ''}`}>
        <header>
          <div className="header-top">
            <h1>CS Fundamentals</h1>
            <div className="header-actions">
              <span className="question-count">{filteredQuestions.length} Questions</span>
              {activeTopic !== 'dsa' && (
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                  <Plus size={16} /> Add
                </button>
              )}
            </div>
          </div>

          <input
            type="text"
            className="search-bar"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>

        <div className="tabs">
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              className={`tab ${activeTopic === topic.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTopic(topic.id);
                setActiveQuestionKey(null);
                setExpandedQuestions(new Set());
              }}
            >
              {topic.icon} <span className="tab-label">{topic.title}</span>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        {activeTopic !== 'dsa' && progressStats && (
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
          {activeTopic === 'dsa' ? (
            <div>
              <DSAQATable questions={dsaQuestions} />
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
                const isExpanded = expandedQuestions.has(q.key);
                const isActive = activeQuestionKey === q.key;
                const currentStatus = q.status || 'not-started';
                const statusInfo = STATUS_OPTIONS.find(s => s.value === currentStatus);

                return (
                  <div key={q.key} className={`question-card ${isActive ? 'active' : ''}`}>
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

                    {isExpanded && (
                      <div className="question-body">
                        <div
                          className="answer-text"
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
                                updateStatus(q.topicId, q.index, option.value);
                              }}
                            >
                              <span className={`status-dot ${option.dot}`}></span>
                              {option.label}
                            </button>
                          ))}
                        </div>

                        <div className="question-actions">
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
                              handleDeleteQuestion(q.topicId, q.index);
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
          )}
        </div>
      </div>

      {/* Notes Panel */}
      {activeTopic !== 'dsa' && (
        <div className={`notes-panel ${showNotes ? 'show-on-mobile' : ''}`}>
          <div className="notes-header">
            <span>{activeQuestion ? 'Note Taking' : 'Notes'}</span>
            <button className="btn-close-notes" onClick={() => setShowNotes(false)}>
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
                    updateNote(activeQuestion.topicId, activeQuestion.index, e.target.value)
                  }
                />
                <p className="notes-save-hint">
                  Notes are automatically saved.
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
  );
};

export default App;