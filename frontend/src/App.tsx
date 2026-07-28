import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage 
          onNavigateToDashboard={() => setCurrentPage('dashboard')} 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      ) : (
        <DashboardPage 
          onNavigateToLanding={() => setCurrentPage('landing')} 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
    </>
  );
};

export default App;
