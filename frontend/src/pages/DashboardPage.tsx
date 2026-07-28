import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { MasterAIChat } from '../components/dashboard/MasterAIChat';
import { KnowledgeGraphVisualizer } from '../components/dashboard/KnowledgeGraphVisualizer';
import { SkillHeatmap } from '../components/dashboard/SkillHeatmap';
import { AgentDirectory } from '../components/dashboard/AgentDirectory';
import { LearningAnalytics } from '../components/dashboard/LearningAnalytics';

interface DashboardPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigateToLanding?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 flex font-sans transition-colors duration-200 overflow-hidden">
      
      {/* Left Sidebar Menu */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />

        {/* Content View */}
        <main className="flex-1 flex overflow-hidden">
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
