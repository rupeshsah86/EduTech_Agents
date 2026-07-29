import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Grid, 
  BookOpen, 
  PenTool, 
  HelpCircle, 
  FileText, 
  CheckSquare, 
  Calendar, 
  FileCode, 
  Code, 
  Briefcase, 
  Network, 
  BarChart3, 
  Settings, 
  ChevronsLeft,
  ChevronsRight,
  Crown,
  ChevronDown,
  Hand,
  Target
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed, onOpenSettings }) => {
  const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(true);
  const [advancedDropdownOpen, setAdvancedDropdownOpen] = useState(true);

  const agentsList = [
    { id: 'agent_note', name: 'NoteCraft AI', icon: FileText },
    { id: 'agent_concept', name: 'ConceptClear AI', icon: HelpCircle },
    { id: 'agent_quiz', name: 'QuizMaster AI', icon: CheckSquare },
    { id: 'agent_study', name: 'StudyFlow AI', icon: Calendar },
    { id: 'agent_exam', name: 'ExamAce AI', icon: BookOpen },
    { id: 'agent_assign', name: 'AssignMate AI', icon: PenTool },
    { id: 'agent_pdf', name: 'PDFTutor AI', icon: FileCode },
    { id: 'agent_code', name: 'CodeMentor AI', icon: Code },
    { id: 'agent_career', name: 'CareerPath AI', icon: Briefcase },
  ];

  if (collapsed) {
    return (
      <aside className="w-16 border-r border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col items-center justify-between py-4 hidden lg:flex min-h-screen shrink-0 select-none transition-all duration-200 font-sans">
        <div className="space-y-6 flex flex-col items-center w-full">
          {/* Logo & Expand Button */}
          <div className="flex flex-col items-center gap-2 border-b border-slate-100 dark:border-neutral-900 pb-3 w-full">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <button 
              onClick={() => setCollapsed(false)}
              className="text-slate-400 hover:text-purple-600 p-1 cursor-pointer transition-colors"
              title="Expand Sidebar"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Icon-Only Navigation */}
          <nav className="space-y-2 flex flex-col items-center w-full px-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Dashboard / Master AI"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Knowledge Graph"
            >
              <Network className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('sign_ai')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sign_ai'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Sign AI Assistant"
            >
              <Hand className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Learning Analytics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenSettings && onOpenSettings()}
              className="p-2.5 rounded-xl text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between p-4 hidden lg:flex min-h-screen shrink-0 select-none transition-all duration-200 font-sans overflow-y-auto">
      <div className="space-y-5">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">EduVerse AI</h1>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">9 Tutors • 1 Assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setCollapsed(true)}
            className="text-slate-400 hover:text-purple-600 p-1 cursor-pointer transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Dashboard Home */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
            Main Workspace
          </div>

          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80'
                : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Section 2: Advanced Features (Moved to Sidebar per UX prompt) */}
        <div className="space-y-1 border-t border-slate-100 dark:border-neutral-900 pt-3">
          <div 
            onClick={() => setAdvancedDropdownOpen(!advancedDropdownOpen)}
            className="flex items-center justify-between px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 cursor-pointer hover:text-purple-600"
          >
            <span>Advanced Tools</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${advancedDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {advancedDropdownOpen && (
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  activeTab === 'knowledge'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-purple-500" />
                <span>Knowledge Graph</span>
              </button>

              <button
                onClick={() => setActiveTab('study_twin')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  activeTab === 'study_twin'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-purple-500" />
                <span>AI Study Twin</span>
              </button>

              <button
                onClick={() => setActiveTab('debate')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  activeTab === 'debate'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>AI Debate Mode</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
                <span>Exam Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-purple-500" />
                <span>Project Recommender</span>
              </button>

              <button
                onClick={() => setActiveTab('sign_ai')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  activeTab === 'sign_ai'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <Hand className="w-3.5 h-3.5 text-purple-500" />
                <span>SignAI Tutor</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Specialized 9 AI Agents List */}
        <div className="space-y-1 border-t border-slate-100 dark:border-neutral-900 pt-3">
          <div 
            onClick={() => setAgentsDropdownOpen(!agentsDropdownOpen)}
            className="flex items-center justify-between px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 cursor-pointer hover:text-purple-600"
          >
            <span>9 Specialized Agents</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${agentsDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {agentsDropdownOpen && (
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setActiveTab('agents')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  activeTab === 'agents'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-purple-500" />
                <span>All Agents Overview</span>
              </button>

              {agentsList.map((agent) => {
                const Icon = agent.icon;
                const isActive = activeTab === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveTab(agent.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold'
                        : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                    <span className="truncate">{agent.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Analytics & Settings */}
        <div className="space-y-0.5 border-t border-slate-100 dark:border-neutral-900 pt-3">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
            <span>Learning Analytics</span>
          </button>

          <button
            onClick={() => onOpenSettings && onOpenSettings()}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-200 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

