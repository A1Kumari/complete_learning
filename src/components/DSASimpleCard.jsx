import React from 'react';

const DSASimpleCard = ({ template, index, onStatusUpdate }) => {
  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'easy': { label: 'Easy', color: '#EAF3DE', textColor: '#3B6D11' },
      'medium': { label: 'Medium', color: '#FAEEDA', textColor: '#854F0B' },
      'hard': { label: 'Hard', color: '#FCEBEB', textColor: '#A32D2D' }
    };
    return badges[difficulty];
  };

  const getStatusBadge = (status) => {
    const badges = {
      'not_started': { label: '⭕', color: '#e0e0e0', textColor: '#666' },
      'practicing': { label: '⏱', color: '#FAEEDA', textColor: '#854F0B' },
      'mastered': { label: '✓', color: '#EAF3DE', textColor: '#3B6D11' }
    };
    return badges[status];
  };

  const difficultyBadge = getDifficultyBadge(template.difficulty);
  const statusBadge = getStatusBadge(template.status);

  return (
    <div className="dsa-simple-card">
      <div className="simple-card-header">
        <div className="simple-card-number">{index}.</div>
        <div className="simple-card-content">
          <div className="simple-card-title">{template.name}</div>
          <div className="simple-card-example">{template.example}</div>
        </div>
        <div className="simple-card-badges">
          <span 
            className="simple-badge" 
            style={{ background: difficultyBadge.color, color: difficultyBadge.textColor }}
          >
            {difficultyBadge.label}
          </span>
        </div>
      </div>

      <div className="simple-card-footer">
        <div className="status-buttons">
          {['not_started', 'practicing', 'mastered'].map(status => {
            const labels = {
              'not_started': 'Not Started',
              'practicing': 'Practicing',
              'mastered': 'Mastered'
            };
            const isActive = template.status === status;
            return (
              <button
                key={status}
                className={`simple-status-btn ${isActive ? 'active' : ''}`}
                onClick={() => onStatusUpdate(template.id, status)}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>
        <div className="status-indicator" style={{ background: statusBadge.color, color: statusBadge.textColor }}>
          {statusBadge.label}
        </div>
      </div>
    </div>
  );
};

export default DSASimpleCard;
