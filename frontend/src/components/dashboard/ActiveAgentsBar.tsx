import React from 'react';
import { 
  GraduationCap, 
  FileEdit, 
  HelpCircle, 
  FileText, 
  CheckSquare, 
  Calendar, 
  FileCheck, 
  Code, 
  Briefcase 
} from 'lucide-react';

interface ActiveAgentsBarProps {
  activeAgentId?: string;
  onSelectAgent?: (id: string) => void;
}

export const ActiveAgentsBar: React.FC<ActiveAgentsBarProps> = ({ activeAgentId, onSelectAgent }) => {
  const agents = [
    { id: 'agent_exam', name: 'ExamAce', icon: GraduationCap, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'agent_assign', name: 'AssignMate', icon: FileEdit, color: 'text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/30' },
    { id: 'agent_concept', name: 'ConceptClear', icon: HelpCircle, color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'agent_note', name: 'NoteCraft', icon: FileText, color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'agent_quiz', name: 'QuizMaster', icon: CheckSquare, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'agent_study', name: 'StudyFlow', icon: Calendar, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'agent_pdf', name: 'PDFTutor', icon: FileCheck, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { id: 'agent_code', name: 'CodeMentor', icon: Code, color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/30' },
    { id: 'agent_career', name: 'CareerPath', icon: Briefcase, color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30' },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border-b border-slate-200 dark:border-neutral-800 px-4 sm:px-6 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none transition-colors duration-200">
      <div className="flex items-center gap-1.5 shrink-0 pr-2.5 border-r border-slate-200 dark:border-neutral-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-black text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
          9 Active Agents
        </span>
      </div>

      <div className="flex items-center gap-2">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = activeAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent?.(agent.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? `${agent.color} ring-2 ring-purple-500/30 shadow-xs scale-105`
                  : 'bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{agent.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
