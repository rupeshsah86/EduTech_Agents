import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eduverse_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('eduverse_theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route 
            path="/" 
            element={
              <LandingPage 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                onNavigateToDashboard={() => {}} 
              />
            } 
          />

          {/* Auth Pages (Protected against authenticated users -> redirect to /dashboard) */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/signup" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SignupPage />
              </ProtectedRoute>
            } 
          />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Application Dashboard (Unauthenticated users -> redirect to /login) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAuth={true}>
                <DashboardPage 
                  darkMode={darkMode} 
                  setDarkMode={setDarkMode} 
                  onNavigateToLanding={() => {}} 
                />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
