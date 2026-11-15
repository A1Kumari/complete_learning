import React, { useState } from 'react';

const DSAQATable = ({ questions, onEdit, initialQuestionId }) => {
  const [expandedRow, setExpandedRow] = useState(initialQuestionId || null);

  if (!questions || questions.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No questions available</div>;
  }

  return (
    <div className="dsa-qa-container">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>DSA Q&A - Topic Wise</h3>
      <div className="dsa-qa-table">
        <div className="table-header">
          <div className="table-cell header-cell" style={{ flex: '0.5' }}>#</div>
          <div className="table-cell header-cell" style={{ flex: '3' }}>Question</div>
          <div className="table-cell header-cell" style={{ flex: '1' }}>Difficulty</div>
          <div className="table-cell header-cell" style={{ flex: '0.5' }}>Freq</div>
        </div>

        {questions.map((q, idx) => {
          const qId = q.id;
          const isExpanded = expandedRow === qId;
          return (
            <div key={qId} id={`question-${qId}`} tabIndex={-1}>
              <div 
                className="table-row"
                onClick={() => setExpandedRow(isExpanded ? null : qId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="table-cell" style={{ flex: '0.5' }}>{idx + 1}</div>
                <div className="table-cell" style={{ flex: '3', fontWeight: '500' }}>{q.q}</div>
                <div className="table-cell" style={{ flex: '1' }}>
                  <span 
                    className={`difficulty-badge difficulty-${q.d}`}
                  >
                    {q.d === 'e' ? 'Easy' : q.d === 'm' ? 'Medium' : 'Hard'}
                  </span>
                </div>
                <div className="table-cell" style={{ flex: '0.5', textAlign: 'center' }}>
                  {q.freq ? '⭐' : '-'}
                </div>
              </div>

              {isExpanded && (
                <div className="table-expanded">
                  <div className="answer-section">
                    <h4>Answer</h4>
                    <div 
                      className="answer-content"
                      dangerouslySetInnerHTML={{ __html: q.a }}
                    />
                    <button className="btn-action" onClick={() => onEdit(q)}>Edit question &amp; answer</button>

                    {q.cross && q.cross.length > 0 && (
                      <div className="cross-ref-section">
                        <h5>Cross-References</h5>
                        <ul>
                          {q.cross.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.trap && (
                      <div className="trap-section">
                        <h5>⚠️ Common Trap</h5>
                        <p>{q.trap}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DSAQATable;
