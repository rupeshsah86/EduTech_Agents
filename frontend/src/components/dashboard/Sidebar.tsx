import React from 'react';
import { 
  MessageSquare, 
  Network, 
  Flame, 
  Bot, 
  BarChart3, 
  Code2, 
  FileText,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'chat', label: 'Master AI Assistant', icon: MessageSquare, badge: 'Main' },
    { id: 'knowledge', label: 'Knowledge Graph', icon: Network, badge: 'Interactive' },
    { id: 'heatmap', label: 'Skill Heatmap', icon: Flame, badge: 'Adaptive' },
    { id: 'agents', label: 'Specialized Agents', icon: Bot, badge: '9 Neural' },
    { id: 'analytics', label: 'Learning Analytics', icon: BarChart3, badge: 'Telemetry' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/90 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col justify-between p-4 hidden md:flex min-h-[calc(100vh-4rem)] shrink-0 select-none">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Core Learning Platform
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold tracking-tight ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Tools Section */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Agent Quick Triggers
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/40">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-teal-500" /> CodeMentor Sandbox
                </span>
                <span className="text-[10px] text-teal-500 font-mono font-bold">v1.2</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                DSA Debugger & Complexity Analyzer ready.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/40">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-red-500" /> PDFTutor Multi-RAG
                </span>
                <span className="text-[10px] text-red-500 font-mono font-bold">Indexed</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                2 documents active in vector store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile Status */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Award className="w-4 h-4 text-amber-500" /> Spaced Repetition Streak
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">12 Days 🔥</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            8 SM-2 flashcards due for review today.
          </p>
        </div>
      </div>
    </aside>
  );
};
