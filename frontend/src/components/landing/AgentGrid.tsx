import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  HelpCircle, 
  FileText, 
  CheckSquare, 
  Calendar, 
  FileCode, 
  Code, 
  Briefcase 
} from 'lucide-react';

export const AgentGrid: React.FC = () => {
  const agents = [
    { name: "ExamAce AI", role: "PYQs & Revision Strategy", icon: BookOpen, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { name: "AssignMate AI", role: "Academic Writing & Citations", icon: PenTool, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
    { name: "ConceptClear AI", role: "Socratic Doubt Solver", icon: HelpCircle, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { name: "NoteCraft AI", role: "Mind Maps & Markdown Notes", icon: FileText, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { name: "QuizMaster AI", role: "Adaptive MCQs & Flashcards", icon: CheckSquare, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { name: "StudyFlow AI", role: "AI Timetable & Pomodoro", icon: Calendar, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
    { name: "PDFTutor AI", role: "Multi-Document PDF RAG", icon: FileCode, color: "text-red-500 bg-red-500/10 border-red-500/20" },
    { name: "CodeMentor AI", role: "DSA Sandbox & Debugger", icon: Code, color: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
    { name: "CareerPath AI", role: "ATS Resume & Mock Interview", icon: Briefcase, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          The Specialized Agent Ecosystem
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Meet the 9 Neural AI Agents
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Each agent is a specialized domain expert operating under Master AI leadership.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl flex items-center gap-4 glass-card-hover border border-slate-200 dark:border-slate-800/80"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${agent.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {agent.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {agent.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
