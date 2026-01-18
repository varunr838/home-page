// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProblemPage from './pages/ProblemsPage'; // Adjust path as needed
// import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the main dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Route for the specific problem solution */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;