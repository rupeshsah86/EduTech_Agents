import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { MasterAIChat } from '../components/dashboard/MasterAIChat';
import { KnowledgeGraphVisualizer } from '../components/dashboard/KnowledgeGraphVisualizer';
import { SkillHeatmap } from '../components/dashboard/SkillHeatmap';
import { AgentDirectory } from '../components/dashboard/AgentDirectory';
import { LearningAnalytics } from '../components/dashboard/LearningAnalytics';
import { OrchestrationPanel } from '../components/dashboard/OrchestrationPanel';
import { SettingsModal } from '../components/dashboard/SettingsModal';
import { CodeMentorSandbox } from '../components/dashboard/CodeMentorSandbox';
import { PDFTutorUploader } from '../components/dashboard/PDFTutorUploader';
import { CareerPathResumeScanner } from '../components/dashboard/CareerPathResumeScanner';
import { VoiceAssistantWidget } from '../components/dashboard/VoiceAssistantWidget';
import { SignAIPage } from './SignAIPage';
import { ArrowLeft, Bot } from 'lucide-react';

interface DashboardPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigateToLanding?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const agentNamesMap: Record<string, string> = {
    agent_exam: 'ExamAce AI (Exam Roadmap & PYQs)',
    agent_assign: 'AssignMate AI (Academic Rewriter)',
    agent_concept: 'ConceptClear AI (Socratic Solver)',
    agent_note: 'NoteCraft AI (Markdown & Mind Maps)',
    agent_quiz: 'QuizMaster AI (Adaptive MCQs & SM-2)',
    agent_study: 'StudyFlow AI (Pomodoro Timetable)',
    agent_pdf: 'PDFTutor AI (Multi-Document RAG)',
    agent_code: 'CodeMentor AI (DSA Sandbox & Big-O)',
    agent_career: 'CareerPath AI (ATS Resume Scanner)',
  };

  const isSpecializedAgent = activeTab.startsWith('agent_');

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 flex font-sans transition-colors duration-200 overflow-hidden relative">
      
      {/* Settings Modal (Groq API Key Config) */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />

      {/* Left Sidebar Menu with Collapsible State */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />

        {/* Active Agents Status Bar */}
        <ActiveAgentsBar 
          activeAgentId={isSpecializedAgent ? activeTab : undefined}
          onSelectAgent={(agentId) => setActiveTab(agentId)}
        />

        {/* Specialized Agent Mode Banner Header */}
        {isSpecializedAgent && (
          <div className="bg-purple-600 text-white px-6 py-2 flex items-center justify-between text-xs font-bold shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>Specialized Dedicated AI Agent Mode: <strong>{agentNamesMap[activeTab] || 'Specialized Agent'}</strong></span>
            </div>
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-[11px] transition-all cursor-pointer font-bold"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Return to Master AI</span>
            </button>
          </div>
        )}

        {/* Content Workspace Canvas View */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeTab === 'chat' && (
            <MasterAIChat 
              rightPanelOpen={rightPanelOpen} 
              onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)} 
            />
          )}

          {activeTab === 'sign_ai' && <SignAIPage />}

          {activeTab === 'knowledge' && <KnowledgeGraphVisualizer />}
          {activeTab === 'heatmap' && <SkillHeatmap />}
          {activeTab === 'agents' && <AgentDirectory />}
          {activeTab === 'analytics' && <LearningAnalytics />}
          {activeTab === 'debate' && <AIDebateMode />}
          {activeTab === 'simulator' && <ExamSimulator />}
          {activeTab === 'study_twin' && <AIStudyTwin />}
          {activeTab === 'projects' && <ProjectRecommender />}

          {/* Dedicated Individual Specialized Agent Workspaces */}
          {activeTab === 'agent_code' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full">
              <CodeMentorSandbox />
              <div className="max-w-4xl mx-auto pt-4">
                <MasterAIChat activeAgentId="agent_code" />
              </div>
            </div>
          )}

          {activeTab === 'agent_pdf' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full">
              <PDFTutorUploader />
              <div className="max-w-4xl mx-auto pt-4">
                <MasterAIChat activeAgentId="agent_pdf" />
              </div>
            </div>
          )}

          {activeTab === 'agent_career' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full">
              <CareerPathResumeScanner />
              <div className="max-w-4xl mx-auto pt-4">
                <MasterAIChat activeAgentId="agent_career" />
              </div>
            </div>
          )}

          {(activeTab === 'agent_exam' || activeTab === 'agent_assign' || activeTab === 'agent_concept' || activeTab === 'agent_note' || activeTab === 'agent_quiz' || activeTab === 'agent_study') && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full">
              <MasterAIChat activeAgentId={activeTab} />
            </div>
          )}

          {/* Right Slide-Over Telemetry & Context Panel */}
          {rightPanelOpen && (
            <OrchestrationPanel onClose={() => setRightPanelOpen(false)} />
          )}
        </main>
      </div>

      {/* Master AI Floating Voice Assistant Widget */}
      <VoiceAssistantWidget />

    </div>
  );
};
