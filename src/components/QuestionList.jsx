import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionList = ({ questions, setQuestions, loading, error }) => { 
  const navigate = useNavigate();

  // Handle clicking the checkbox (Marks as solved/unsolved)
  const handleToggleSolved = async (e, questionId, currentStatus) => {
    e.stopPropagation(); // Prevents the row click event from firing
    
    // 1. Optimistic Update
    const originalQuestions = [...questions];
    const updatedQuestions = questions.map(q => 
      (q.id === questionId) ? { ...q, solved: !currentStatus } : q
    );
    setQuestions(updatedQuestions);

    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) throw new Error("No token");

      // 2. Send PUT Request
      const response = await fetch(
        `https://dorie-lunulate-breezily.ngrok-free.dev/user/update-progress?questionId=${questionId}`, 
        {
          method: 'PUT',
          credentials:'include',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update");
      }

    } catch (err) {
      console.error("Failed to update status:", err);
      // 3. Revert on Error
      setQuestions(originalQuestions);
      alert("Failed to save progress. Please try again.");
    }
  };

  // Handle clicking the row (Navigates to solution page)
  const handleRowClick = (questionId) => {
    navigate(`/problem/${questionId}`);
  };

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
          <div style={{ color: '#94a3b8', textAlign: 'center' }}>No questions found.</div>
        ) : (
          questions.map((q, index) => (
            <div 
              key={q.id || index} 
              className={`question-item ${q.solved ? 'solved' : ''}`}
              onClick={() => handleRowClick(q.id)}
              style={{ cursor: 'pointer' }}
            >
              <span className="question-number">#{q.id || index + 1}</span>
              
              <div 
                className="checkbox" 
                onClick={(e) => handleToggleSolved(e, q.id, q.solved)}
                // Cursor pointer is inherited, but explicit prevents confusion
                style={{ cursor: 'pointer' }} 
              ></div>

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