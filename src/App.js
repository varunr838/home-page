import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProgressSection from './components/ProgressSection';
import QuestionList from './components/QuestionList';
import RightSidebar from './components/RightSidebar';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <div className="main-content">
          <Sidebar />
          
          <div className="content-area">
            <ProgressSection />
            <QuestionList />
          </div>

          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default App;