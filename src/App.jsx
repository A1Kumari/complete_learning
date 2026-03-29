import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, BookOpen, Edit3, Trash2 } from 'lucide-react';
import { D, TOPICS, DSA_TEMPLATES } from './data';
import DSATemplatesList from './components/DSATemplatesList';
import DSAQATable from './components/DSAQATable';
import './App.css';

const App = () => {
  const [activeTopic, setActiveTopic] = useState('os');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [notes, setNotes] = useState(() => {
    const jsonNotes = {};
    D.forEach(topic => {
      topic.questions?.forEach(q => {
        const qId = `${topic.id}-${q.q.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
        if (q.notes) jsonNotes[qId] = q.notes;
      });
    });

    const saved = localStorage.getItem('cs-learning-notes');
    const localNotes = saved ? JSON.parse(saved) : {};
    return { ...jsonNotes, ...localNotes };
  });

  // DSA Templates state
  const [dsaTemplates, setDsaTemplates] = useState(() => {
    const saved = localStorage.getItem('dsa-templates');
    if (saved) {
      return JSON.parse(saved);
    }
    return DSA_TEMPLATES.templates;
  });

  const [dsaNotes, setDsaNotes] = useState(() => {
    const saved = localStorage.getItem('dsa-notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('cs-learning-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('dsa-templates', JSON.stringify(dsaTemplates));
  }, [dsaTemplates]);

  useEffect(() => {
    localStorage.setItem('dsa-notes', JSON.stringify(dsaNotes));
  }, [dsaNotes]);

  const toggleQuestion = (qId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(qId)) {
      newExpanded.delete(qId);
    } else {
      newExpanded.add(qId);
    }
    setExpandedQuestions(newExpanded);
  };

  const updateNote = (qId, text) => {
    setNotes(prev => ({
      ...prev,
      [qId]: text
    }));
  };

  const updateDsaTemplateStatus = (templateId, newStatus) => {
    setDsaTemplates(prev =>
      prev.map(t =>
        t.id === templateId
          ? { ...t, status: newStatus, attempts: t.attempts + 1 }
          : t
      )
    );
  };

  const updateDsaTemplateNotes = (templateId, newNotes) => {
    setDsaNotes(prev => ({
      ...prev,
      [templateId]: newNotes
    }));
  };

  const filteredQuestions = useMemo(() => {
    let allQs = [];
    D.forEach(topic => {
      const qsWithTopic = topic.questions.map(q => ({
        ...q,
        topicId: topic.id,
        topicTitle: topic.title,
        id: `${topic.id}-${q.q.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`
      }));
      allQs = [...allQs, ...qsWithTopic];
    });

    return allQs.filter(q => {
      const matchesTopic = activeTopic === 'all' || q.topicId === activeTopic;
      const matchesSearch = q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           q.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [activeTopic, searchQuery]);

  // Merge DSA templates with saved notes
  const dsaTemplatesWithNotes = useMemo(() => {
    return dsaTemplates.map(t => ({
      ...t,
      notes: dsaNotes[t.id] || ''
    }));
  }, [dsaTemplates, dsaNotes]);

  // Get DSA questions specifically for the table
  const dsaQuestions = useMemo(() => {
    const dsaTopic = D.find(t => t.id === 'dsa');
    return dsaTopic?.questions || [];
  }, []);

  return (
    <div className="app-container">
      <div className="main-content">
        <header>
          <div className="header-top">
            <h1>CS Fundamentals</h1>
            <div className="stats" style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
              <span>{filteredQuestions.length} Questions found</span>
            </div>
          </div>
          
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search questions, topics, or answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>

        <div className="tabs">
          {TOPICS.map(topic => (
            <button 
              key={topic.id}
              className={`tab ${activeTopic === topic.id ? 'active' : ''}`}
              onClick={() => setActiveTopic(topic.id)}
            >
              {topic.icon} {topic.title}
            </button>
          ))}
        </div>

        <div className="question-list">
          {activeTopic === 'dsa' ? (
            <div>
              <DSAQATable questions={dsaQuestions} />
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>Practice Templates</h3>
                <DSATemplatesList 
                  templates={dsaTemplatesWithNotes}
                  onStatusUpdate={updateDsaTemplateStatus}
                />
              </div>
            </div>
          ) : (
            <>
              {filteredQuestions.map((q, index) => (
            <div key={q.id} className={`question-card ${activeQuestion?.id === q.id ? 'active' : ''}`}>
              <div 
                className="question-header" 
                onClick={() => {
                  toggleQuestion(q.id);
                  setActiveQuestion(q);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span className="question-text">{index + 1}. {q.q}</span>
                </div>
                <div className="badges">
                  {q.freq && <span className="badge badge-freq">Frequent</span>}
                  {q.d === 'e' && <span className="badge badge-easy">Easy</span>}
                  {q.d === 'm' && <span className="badge badge-med">Medium</span>}
                  {q.d === 'h' && <span className="badge badge-hard">Hard</span>}
                </div>
              </div>

              {expandedQuestions.has(q.id) && (
                <div className="question-body">
                  <div 
                    className="answer-text"
                    dangerouslySetInnerHTML={{ __html: q.a }}
                  />
                  
                  {q.cross && q.cross.length > 0 && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#EEEDFE', borderRadius: '8px', borderLeft: '4px solid #7F77DD' }}>
                      <strong style={{ fontSize: '0.8rem', color: '#534AB7', textTransform: 'uppercase' }}>Cross-Reference</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                        {q.cross.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                  {q.trap && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#FCEBEB', borderRadius: '8px', borderLeft: '4px solid #E24B4A' }}>
                      <strong style={{ fontSize: '0.8rem', color: '#A32D2D', textTransform: 'uppercase' }}>Trap</strong>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{q.trap}</p>
                    </div>
                  )}

                  <button 
                    onClick={() => setActiveQuestion(q)}
                    style={{ 
                      marginTop: '1rem', 
                      padding: '0.4rem 0.8rem', 
                      background: 'none', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Edit3 size={14} /> {notes[q.id] ? 'Edit Notes' : 'Add Notes'}
                  </button>
                </div>
              )}
            </div>
          ))}
            </>
          )}
        </div>
      </div>

      {activeTopic !== 'dsa' && (
      <div className="notes-panel">
        <div className="notes-header">
          {activeQuestion ? 'Note Taking' : 'System Notes'}
        </div>
        <div className="notes-content">
          {activeQuestion ? (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <span className="badge badge-freq" style={{ margin: 0 }}>{activeQuestion.topicId.toUpperCase()}</span>
                <h3 style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{activeQuestion.q}</h3>
              </div>
              <textarea
                className="note-editor"
                placeholder="Write your notes for this question here..."
                value={notes[activeQuestion.id] || ''}
                onChange={(e) => updateNote(activeQuestion.id, e.target.value)}
              />
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
                Notes are automatically saved to your local storage.
              </p>
            </div>
          ) : (
            <div className="empty-notes">
              <BookOpen size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Select a question to view or add notes.</p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default App;
