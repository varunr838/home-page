import React, { useState, useEffect } from 'react';

const QuestionList = () => {
  // State management
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // 1. Retrieve the token. 
        // ideally stored in localStorage after login, or hardcoded for testing.
        const token = localStorage.getItem('authToken'); 

        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch("https://dorie-lunulate-breezily.ngrok-free.dev/question/get?page=0&size=10", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Standard auth header format
            'ngrok-skip-browser-warning': 'true', // Bypasses ngrok's interstitial warning page
          }
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error("Unauthorized: Invalid Token");
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        
        // Ensure data is an array before setting it
        // Adjust 'data.questions' if your API returns { success: true, questions: [...] }
        const questionArray = Array.isArray(data) ? data : (data.questions || []);
        
        setQuestions(questionArray);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="card-base" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="section-title">Loading Problems...</div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="card-base" style={{ borderColor: '#ef4444' }}>
        <h3 className="section-title" style={{ color: '#ef4444' }}>Error Loading Data</h3>
        <p style={{ color: '#f87171' }}>{error}</p>
      </div>
    );
  }

  // Success State
  return (
    <div className="card-base">
      <h3 className="section-title">DSA Problems</h3>
      <div className="question-list">
        {questions.length === 0 ? (
          <div style={{ color: '#94a3b8', textAlign: 'center' }}>No questions found.</div>
        ) : (
          questions.map((q, index) => (
            // Fallback to index if q.id is missing
            <div key={q.id || index} className={`question-item ${q.solved ? 'solved' : ''}`}>
              <span className="question-number">#{q.id || index + 1}</span>
              <div className="checkbox"></div>
              <div className="question-content">
                <span className="question-title">{q.title}</span>
                {/* Check if topic exists before rendering */}
                {q.topic && <span className="topic-tag">{q.topic}</span>}
                {/* Check if difficulty exists, default to 'easy' if missing */}
                {q.difficulty && (
                  <span className={`difficulty ${q.difficulty.toLowerCase()}`}>
                    {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
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