import React, { useState } from 'react';

const SimpleDSATemplateCard = ({ template, onStatusUpdate }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      'not_started': { bg: '#f5f5f5', text: '#666', label: 'Not Started' },
      'practicing': { bg: '#FAEEDA', text: '#854F0B', label: 'Practicing' },
      'mastered': { bg: '#EAF3DE', text: '#3B6D11', label: 'Mastered' }
    };
    return colors[status];
  };

  const statusColor = getStatusColor(template.status);

  return (
    <div className="simple-dsa-card">
      <div className="simple-card-header" onClick={() => setShowAnswer(!showAnswer)}>
        <div className="simple-card-question">
          <span style={{ fontWeight: '600', color: '#1a1a18' }}>{template.name}</span>
          <span style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.3rem', display: 'block' }}>
            {template.topic}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>
            {showAnswer ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {showAnswer && (
        <div className="simple-card-body">
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#333', lineHeight: '1.5' }}>
              {template.problemStatement}
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>
              Status:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['not_started', 'practicing', 'mastered'].map(status => {
                const isActive = template.status === status;
                const color = getStatusColor(status);
                return (
                  <button
                    key={status}
                    onClick={() => onStatusUpdate(template.id, status)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      border: isActive ? `2px solid ${color.text}` : '1px solid #ddd',
                      background: isActive ? color.bg : '#fff',
                      color: isActive ? color.text : '#999',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    {color.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            Attempts: <strong>{template.attempts}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDSATemplateCard;
