import React from 'react';

const QuestionList = ({ questions, loading, error }) => {
  
  if (loading) {
    return (
      <div className="card-base" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="section-title">Loading Problems...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-base" style={{ borderColor: '#ef4444' }}>
        <h3 className="section-title" style={{ color: '#ef4444' }}>Error</h3>
        <p style={{ color: '#f87171' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="card-base">
      <h3 className="section-title">DSA Problems</h3>
      <div className="question-list">
        {questions.length === 0 ? (
          <div style={{ color: '#94a3b8', textAlign: 'center' }}>No questions found matching your criteria.</div>
        ) : (
          questions.map((q, index) => (
            <div key={q.id || index} className={`question-item ${q.solved ? 'solved' : ''}`}>
              <span className="question-number">#{q.id || index + 1}</span>
              <div className="checkbox"></div>
              <div className="question-content">
                <span className="question-title">{q.title}</span>
                
                {q.topic && q.topic.map((t) => (
                  <span key={t.id} className="topic-tag">
                    {t.name}
                  </span>
                ))}
                
                {q.difficulty && (
                  <span className={`difficulty ${q.difficulty.toLowerCase()}`}>
                    {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;