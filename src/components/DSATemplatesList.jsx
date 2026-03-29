import React, { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import SimpleDSATemplateCard from './SimpleDSATemplateCard';

const DSATemplatesList = ({ templates, onStatusUpdate }) => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique topics
  const topics = useMemo(() => {
    const uniqueTopics = ['all'];
    templates.forEach(t => {
      if (!uniqueTopics.includes(t.topic)) {
        uniqueTopics.push(t.topic);
      }
    });
    return uniqueTopics;
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesTopic = selectedTopic === 'all' || t.topic === selectedTopic;
      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesStatus && matchesSearch;
    });
  }, [templates, selectedTopic, selectedStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: templates.length,
      notStarted: templates.filter(t => t.status === 'not_started').length,
      practicing: templates.filter(t => t.status === 'practicing').length,
      mastered: templates.filter(t => t.status === 'mastered').length
    };
  }, [templates]);

  return (
    <div className="dsa-templates-list-only">
      <div className="dsa-list-filters">
        <div className="filter-group">
          <span className="filter-label">Topic:</span>
          <div className="filter-buttons">
            {topics.map(topic => (
              <button
                key={topic}
                className={`filter-btn ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic === 'all' ? 'All' : topic}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <div className="filter-buttons">
            {['all', 'not_started', 'practicing', 'mastered'].map(status => {
              const labels = {
                'all': 'All',
                'not_started': 'Not Started',
                'practicing': 'Practicing',
                'mastered': 'Mastered'
              };
              return (
                <button
                  key={status}
                  className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dsa-templates-list">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <SimpleDSATemplateCard
              key={template.id}
              template={template}
              onStatusUpdate={onStatusUpdate}
            />
          ))
        ) : (
          <div className="empty-templates">
            <BookOpen size={48} strokeWidth={1} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>No templates found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DSATemplatesList;
