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
    { id: 'agents', label: 'Specialized Agents (9)', icon: Bot, badge: 'Neural' },
    { id: 'analytics', label: 'Learning Analytics', icon: BarChart3, badge: 'Stats' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-col justify-between p-4 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive 
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
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
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Agent Quick Triggers
          </p>
          <div className="space-y-1 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-teal-500" /> CodeMentor Sandbox
                </span>
                <span className="text-[10px] text-teal-500 font-mono">v1.2</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                DSA Debugger & Complexity Analyzer ready.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-red-500" /> PDFTutor Multi-RAG
                </span>
                <span className="text-[10px] text-red-500 font-mono">Indexed</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                2 documents active in vector store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile Status */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Award className="w-4 h-4" /> Spaced Repetition Streak
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">12 Days 🔥</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            8 SM-2 flashcards due for review today.
          </p>
        </div>
      </div>
    </aside>
  );
};
