import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  MoreVertical, 
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
  ArrowRight,
  ChevronDown,
  Hand
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(true);

  const agentsList = [
    { id: 'agents_all', name: 'All Agents (9)', icon: Grid, color: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300' },
    { id: 'agent_exam', name: 'ExamAce AI', icon: BookOpen, color: 'bg-amber-500 text-white' },
    { id: 'agent_assign', name: 'AssignMate AI', icon: PenTool, color: 'bg-pink-500 text-white' },
    { id: 'agent_concept', name: 'ConceptClear AI', icon: HelpCircle, color: 'bg-blue-500 text-white' },
    { id: 'agent_note', name: 'NoteCraft AI', icon: FileText, color: 'bg-purple-500 text-white' },
    { id: 'agent_quiz', name: 'QuizMaster AI', icon: CheckSquare, color: 'bg-emerald-500 text-white' },
    { id: 'agent_study', name: 'StudyFlow AI', icon: Calendar, color: 'bg-teal-500 text-white' },
    { id: 'agent_pdf', name: 'PDFTutor AI', icon: FileCode, color: 'bg-red-500 text-white' },
    { id: 'agent_code', name: 'CodeMentor AI', icon: Code, color: 'bg-indigo-500 text-white' },
    { id: 'agent_career', name: 'CareerPath AI', icon: Briefcase, color: 'bg-orange-500 text-white' },
  ];

  if (collapsed) {
    return (
      <aside className="w-16 border-r border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col items-center justify-between py-4 hidden lg:flex min-h-screen shrink-0 select-none transition-all duration-200">
        <div className="space-y-6 flex flex-col items-center w-full">
          {/* Logo & Expand Button */}
          <div className="flex flex-col items-center gap-2 border-b border-slate-100 dark:border-neutral-900 pb-3 w-full">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
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
              onClick={() => setActiveTab('sign_ai')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sign_ai'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Sign AI Assistant (Sign Language)"
            >
              <Hand className="w-4 h-4 text-purple-500" />
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Dashboard / Master AI"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab.startsWith('agent')
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="AI Agents (9)"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Knowledge Graph"
            >
              <Network className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
              title="Learning Analytics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* Upgrade Icon */}
        <button 
          onClick={() => setCollapsed(false)}
          className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 cursor-pointer"
          title="Upgrade to Pro"
        >
          <Crown className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between p-4 hidden lg:flex min-h-screen shrink-0 select-none transition-all duration-200">
      <div className="space-y-4">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 dark:text-neutral-100 tracking-tight">EduVerse AI</h1>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">One Master AI Assistant</p>
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

        {/* Core Nav Group 1 */}
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 shadow-xs'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-100 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Master AI</span>
          </button>

          <button
            onClick={() => setActiveTab('sign_ai')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'sign_ai'
                ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 shadow-xs'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Hand className="w-4 h-4 text-purple-500" />
              <span>🤟 Sign AI</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-purple-500 text-white uppercase shadow-xs">
              Deaf AI
            </span>
          </button>
        </nav>

        {/* AI Agents Group with Three-Dot / Collapsible Menu */}
        <div className="space-y-1 border-t border-slate-100 dark:border-neutral-900 pt-2">
          <div 
            onClick={() => setAgentsDropdownOpen(!agentsDropdownOpen)}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>AI Agents</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">9</span>
            </div>
            <div className="flex items-center gap-1">
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${agentsDropdownOpen ? 'rotate-180' : ''}`} />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('agents');
                }}
                className="p-0.5 hover:text-purple-600"
                title="View All Specialized Agents"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {agentsDropdownOpen && (
            <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-none pr-1 pl-1">
              {agentsList.map((agent) => {
                const Icon = agent.icon;
                const isActive = activeTab === agent.id || (activeTab === 'agents' && agent.id === 'agents_all');
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveTab(agent.id === 'agents_all' ? 'agents' : agent.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20'
                        : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100/70 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] shrink-0 ${agent.color}`}>
                      <Icon className="w-2.5 h-2.5" />
                    </div>
                    <span className="truncate">{agent.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Core Nav Group 2 */}
        <nav className="space-y-1 pt-2 border-t border-slate-100 dark:border-neutral-900">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'knowledge'
                ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Knowledge Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Learning Analytics</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-bold text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Upgrade to Pro Card */}
      <div className="pt-3 border-t border-slate-100 dark:border-neutral-900">
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            <Crown className="w-4 h-4" />
            <span>Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-snug">
            Unlock advanced agents, voice mode & more!
          </p>
          <button className="w-full py-1.5 rounded-xl bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 font-bold text-xs shadow-xs border border-purple-200 dark:border-purple-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer">
            <span>Upgrade Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
