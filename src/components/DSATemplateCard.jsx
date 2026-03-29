import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Eye, EyeOff, Clock, Zap } from 'lucide-react';

const DSATemplateCard = ({ template, index, isExpanded, onToggle, onStatusUpdate, onNotesUpdate }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [notes, setNotes] = useState(template.notes || '');
  const [copiedCode, setCopiedCode] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      'not_started': { label: 'Not Started', color: '#e0e0e0', textColor: '#666' },
      'practicing': { label: 'Practicing', color: '#FAEEDA', textColor: '#854F0B' },
      'mastered': { label: 'Mastered', color: '#EAF3DE', textColor: '#3B6D11' }
    };
    return badges[status];
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'easy': { label: 'Easy', color: '#EAF3DE', textColor: '#3B6D11' },
      'medium': { label: 'Medium', color: '#FAEEDA', textColor: '#854F0B' },
      'hard': { label: 'Hard', color: '#FCEBEB', textColor: '#A32D2D' }
    };
    return badges[difficulty];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(template.id, newStatus);
  };

  const handleNotesChange = (newNotes) => {
    setNotes(newNotes);
    onNotesUpdate(template.id, newNotes);
  };

  const statusBadge = getStatusBadge(template.status);
  const difficultyBadge = getDifficultyBadge(template.difficulty);

  return (
    <div className={`dsa-template-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="dsa-template-header" onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span className="dsa-template-number">{index}.</span>
          <div style={{ flex: 1 }}>
            <div className="dsa-template-name">{template.name}</div>
            <div className="dsa-template-meta">{template.topic} • {template.difficulty.toUpperCase()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span 
            className="dsa-badge" 
            style={{ background: statusBadge.color, color: statusBadge.textColor }}
          >
            {statusBadge.label}
          </span>
          <span 
            className="dsa-badge" 
            style={{ background: difficultyBadge.color, color: difficultyBadge.textColor }}
          >
            {difficultyBadge.label}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="dsa-template-body">
          {/* Time Limit */}
          <div className="dsa-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={16} style={{ color: '#ff6b6b' }} />
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Target Time: {template.timeLimit} minutes</span>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="dsa-section">
            <h4 className="dsa-section-title">📝 Problem Statement</h4>
            <p className="dsa-section-content">{template.problemStatement}</p>
          </div>

          {/* Constraints */}
          <div className="dsa-section">
            <h4 className="dsa-section-title">⚡ Constraints</h4>
            <p className="dsa-section-content">{template.constraints}</p>
          </div>

          {/* Input/Output Format */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="dsa-section">
              <h4 className="dsa-section-title">📥 Input Format</h4>
              <p className="dsa-section-content">{template.inputFormat}</p>
            </div>
            <div className="dsa-section">
              <h4 className="dsa-section-title">📤 Output Format</h4>
              <p className="dsa-section-content">{template.outputFormat}</p>
            </div>
          </div>

          {/* Code Skeleton */}
          <div className="dsa-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h4 className="dsa-section-title">💻 Code Skeleton</h4>
              <button
                className="code-copy-btn"
                onClick={() => copyToClipboard(template.skeleton)}
              >
                <Copy size={16} />
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="code-block">{template.skeleton}</pre>
          </div>

          {/* Solution */}
          <div className="dsa-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h4 className="dsa-section-title">✅ Solution</h4>
              <button
                className="solution-toggle-btn"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? (
                  <>
                    <EyeOff size={16} /> Hide Solution
                  </>
                ) : (
                  <>
                    <Eye size={16} /> View Solution
                  </>
                )}
              </button>
            </div>
            {showSolution && (
              <div>
                <button
                  className="code-copy-btn"
                  onClick={() => copyToClipboard(template.solution)}
                  style={{ marginBottom: '0.8rem' }}
                >
                  <Copy size={16} />
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
                <pre className="code-block">{template.solution}</pre>
              </div>
            )}
          </div>

          {/* Test Cases */}
          <div className="dsa-section">
            <h4 className="dsa-section-title">🧪 Test Cases</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {template.testCases.map((testCase, idx) => (
                <div key={idx} className="test-case">
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', background: '#f5f5f5', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                    <div><strong>Input:</strong> {testCase.input}</div>
                    <div><strong>Expected:</strong> {testCase.expected}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5' }}>
                    <strong>Explanation:</strong> {testCase.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="dsa-section">
            <h4 className="dsa-section-title">📊 Status</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {['not_started', 'practicing', 'mastered'].map(status => {
                const labels = {
                  'not_started': '⭕ Not Started',
                  'practicing': '⏱ Practicing',
                  'mastered': '✓ Mastered'
                };
                const isActive = template.status === status;
                return (
                  <button
                    key={status}
                    className={`status-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {labels[status]}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Attempts: <strong>{template.attempts}</strong>
            </div>
          </div>

          {/* Notes */}
          <div className="dsa-section">
            <h4 className="dsa-section-title">📝 Personal Notes</h4>
            <textarea
              className="dsa-notes-editor"
              placeholder="Add your notes, solutions approaches, or reminders..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DSATemplateCard;
