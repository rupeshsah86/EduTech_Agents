import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Plus, 
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
  Crown,
  ArrowRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const agentsList = [
    { id: 'agents_all', name: 'All Agents', icon: Grid, color: 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300' },
    { id: 'agents_exam', name: 'ExamAce AI', icon: BookOpen, color: 'bg-amber-500 text-white' },
    { id: 'agents_assign', name: 'AssignMate AI', icon: PenTool, color: 'bg-pink-500 text-white' },
    { id: 'agents_concept', name: 'ConceptClear AI', icon: HelpCircle, color: 'bg-blue-500 text-white' },
    { id: 'agents_note', name: 'NoteCraft AI', icon: FileText, color: 'bg-purple-500 text-white' },
    { id: 'agents_quiz', name: 'QuizMaster AI', icon: CheckSquare, color: 'bg-emerald-500 text-white' },
    { id: 'agents_study', name: 'StudyFlow AI', icon: Calendar, color: 'bg-teal-500 text-white' },
    { id: 'agents_pdf', name: 'PDFTutor AI', icon: FileCode, color: 'bg-red-500 text-white' },
    { id: 'agents_code', name: 'CodeMentor AI', icon: Code, color: 'bg-indigo-500 text-white' },
    { id: 'agents_career', name: 'CareerPath AI', icon: Briefcase, color: 'bg-orange-500 text-white' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between p-4 hidden lg:flex min-h-screen shrink-0 select-none">
      <div className="space-y-5">
        
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
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 p-1 cursor-pointer">
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Core Nav Group 1 */}
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
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
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-neutral-100 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Master AI</span>
          </button>
        </nav>

        {/* AI Agents Group */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
            <span>AI Agents</span>
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-purple-500" />
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-none pr-1">
            {agentsList.map((agent) => {
              const Icon = agent.icon;
              const isActive = activeTab === 'agents' || activeTab === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveTab('agents')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive && activeTab === agent.id
                      ? 'bg-slate-100 dark:bg-neutral-900 text-slate-900 dark:text-neutral-100 font-bold'
                      : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100/60 dark:hover:bg-neutral-900/60 hover:text-slate-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 ${agent.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="truncate">{agent.name}</span>
                </button>
              );
            })}
          </div>
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
      <div className="pt-4 border-t border-slate-100 dark:border-neutral-900">
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            <Crown className="w-4 h-4" />
            <span>Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-snug">
            Unlock advanced agents, voice mode & more!
          </p>
          <button className="w-full py-2 rounded-xl bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400 font-bold text-xs shadow-xs border border-purple-200 dark:border-purple-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer">
            <span>Upgrade Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
