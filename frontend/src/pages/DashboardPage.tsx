import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { MasterAIChat } from '../components/dashboard/MasterAIChat';
import { KnowledgeGraphVisualizer } from '../components/dashboard/KnowledgeGraphVisualizer';
import { SkillHeatmap } from '../components/dashboard/SkillHeatmap';
import { AgentDirectory } from '../components/dashboard/AgentDirectory';
import { LearningAnalytics } from '../components/dashboard/LearningAnalytics';
import { CodeMentorSandbox } from '../components/dashboard/CodeMentorSandbox';
import { PDFTutorUploader } from '../components/dashboard/PDFTutorUploader';
import { CareerPathResumeScanner } from '../components/dashboard/CareerPathResumeScanner';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';

interface DashboardPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigateToLanding?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState('chat');

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

        {/* Specialized Agent Mode Banner Header */}
        {isSpecializedAgent && (
          <div className="bg-purple-600 text-white px-6 py-2 flex items-center justify-between text-xs font-bold shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>Specialized Agent Workspace Mode: <strong>{agentNamesMap[activeTab] || 'Specialized Agent'}</strong></span>
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

        {/* Content View */}
        <main className="flex-1 flex overflow-hidden">
          {activeTab === 'chat' && <MasterAIChat />}
          {activeTab === 'knowledge' && <KnowledgeGraphVisualizer />}
          {activeTab === 'heatmap' && <SkillHeatmap />}
          {activeTab === 'agents' && <AgentDirectory />}
          {activeTab === 'analytics' && <LearningAnalytics />}

          {/* Dedicated Specialized Agent Interactive Views */}
          {activeTab === 'agent_code' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full">
              <CodeMentorSandbox />
            </div>
          )}

          {activeTab === 'agent_pdf' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full">
              <PDFTutorUploader />
            </div>
          )}

          {activeTab === 'agent_career' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full">
              <CareerPathResumeScanner />
            </div>
          )}

          {(activeTab === 'agent_exam' || activeTab === 'agent_assign' || activeTab === 'agent_concept' || activeTab === 'agent_note' || activeTab === 'agent_quiz' || activeTab === 'agent_study') && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-neutral-950 w-full max-w-4xl mx-auto">
              <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-neutral-100">
                  {agentNamesMap[activeTab]} Active
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
                  You are working directly with this specialized neural agent. Any questions asked will be processed exclusively by this agent.
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Open Master AI Chat for {agentNamesMap[activeTab]?.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
