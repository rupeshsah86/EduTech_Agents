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
    { id: 'agent_exam', name: 'ExamAce', icon: GraduationCap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { id: 'agent_assign', name: 'AssignMate', icon: FileEdit, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' },
    { id: 'agent_concept', name: 'ConceptClear', icon: HelpCircle, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { id: 'agent_note', name: 'NoteCraft', icon: FileText, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { id: 'agent_quiz', name: 'QuizMaster', icon: CheckSquare, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'agent_study', name: 'StudyFlow', icon: Calendar, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'agent_pdf', name: 'PDFTutor', icon: FileCheck, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { id: 'agent_code', name: 'CodeMentor', icon: Code, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
    { id: 'agent_career', name: 'CareerPath', icon: Briefcase, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  ];

  return (
    <div className="w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 px-6 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none transition-colors duration-200">
      <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-neutral-200 dark:border-neutral-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? `${agent.color} ring-2 ring-purple-500/30 font-bold`
                  : 'bg-neutral-100/80 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
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
