// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProblemPage from './pages/ProblemsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import VerifyOtpPage from './pages/VerifyOtpPage';
import LoadingPage from './pages/LoadingPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/auth-callback" element={<LoadingPage />} />

        {/* Protected Routes - Only accessible if logged in */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/problem/:problemId" 
          element={
            <ProtectedRoute>
              <ProblemPage />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all: Redirect any unknown path to home (which then checks auth) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;