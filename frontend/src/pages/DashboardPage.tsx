import React, { useState } from 'react';
import { Navbar } from '../components/dashboard/Navbar';
import { Sidebar } from '../components/dashboard/Sidebar';
import { MasterAIChat } from '../components/dashboard/MasterAIChat';
import { KnowledgeGraphVisualizer } from '../components/dashboard/KnowledgeGraphVisualizer';
import { SkillHeatmap } from '../components/dashboard/SkillHeatmap';
import { AgentDirectory } from '../components/dashboard/AgentDirectory';
import { LearningAnalytics } from '../components/dashboard/LearningAnalytics';

interface DashboardPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigateToLanding: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ darkMode, setDarkMode, onNavigateToLanding }) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        activeAgentCount={9} 
        onNavigateToLanding={onNavigateToLanding}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Canvas View */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'chat' && <MasterAIChat />}
          {activeTab === 'knowledge' && <KnowledgeGraphVisualizer />}
          {activeTab === 'heatmap' && <SkillHeatmap />}
          {activeTab === 'agents' && <AgentDirectory />}
          {activeTab === 'analytics' && <LearningAnalytics />}
        </main>
      </div>
    </div>
  );
};
