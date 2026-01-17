import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProgressSection from './components/ProgressSection';
import QuestionList from './components/QuestionList';
import RightSidebar from './components/RightSidebar';

const App = () => {
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopics, setSelectedTopics] = useState([]);
  
  // State for fetched questions
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch questions based on current filters
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("No authentication token found.");

      // Construct URL parameters dynamically
      const params = new URLSearchParams({
        page: 0,
        size: 10
      });

      if (searchQuery) params.append('query', searchQuery);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty.toLowerCase()); // assuming API expects lowercase
      if (selectedTopics.length > 0) params.append('tags', selectedTopics.join(','));

      // Decide which endpoint to hit
      // If no filters are active, you might want to hit the default /get endpoint, 
      // but if your /search endpoint handles empty params, just use that.
      const baseUrl = "https://dorie-lunulate-breezily.ngrok-free.dev/question/search";
      
      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      // Handle the nested structure: data.content
      setQuestions(data.content || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the fetch when typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQuestions();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedDifficulty, selectedTopics]);

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <div className="main-content">
          <Sidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
          
          <div className="content-area">
            <ProgressSection />
            {/* Pass the fetched data down to QuestionList */}
            <QuestionList 
              questions={questions}
              setQuestions={setQuestions} 
              loading={loading} 
              error={error} 
            />
          </div>

          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default App;