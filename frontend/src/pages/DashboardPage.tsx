import React, { useState } from 'react';
import { Navbar } from '../components/dashboard/Navbar';
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
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Fixed Top Navbar Header with Integrated Top Navigation Tabs & Working Notifications */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateToLanding={onNavigateToLanding}
      />

      {/* Main Content Area with Smooth Native Scrolling */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === 'chat' && <MasterAIChat />}
        {activeTab === 'knowledge' && <KnowledgeGraphVisualizer />}
        {activeTab === 'heatmap' && <SkillHeatmap />}
        {activeTab === 'agents' && <AgentDirectory />}
        {activeTab === 'analytics' && <LearningAnalytics />}
      </main>
    </div>
  );
};
