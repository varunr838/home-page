import React, { useState, useEffect } from 'react';
 import '../App.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProgressSection from './ProgressSection';
import QuestionList from './QuestionList';
import RightSidebar from './RightSidebar';
import { apiFetch } from '../utils/api';
const Dashboard = () => {
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
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) throw new Error("No authentication token found.");

      // Construct URL parameters dynamically
      const params = new URLSearchParams({
        page: 0,
        size: 10
      });

      if (searchQuery) params.append('query', searchQuery);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty.toLowerCase()); // assuming API expects lowercase
      if (selectedTopics.length > 0) params.append('tags', selectedTopics.join(','));

      const baseUrl = "https://dorie-lunulate-breezily.ngrok-free.dev/question/search";
      
      const response = await apiFetch(`${baseUrl}?${params.toString()}`);

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
    <div className="dashboard-wrapper">
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
    </div>
  );
};

export default Dashboard;