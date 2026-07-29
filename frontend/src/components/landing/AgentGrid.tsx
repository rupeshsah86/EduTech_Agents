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
  Briefcase,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AgentGrid: React.FC = () => {
  const agents = [
    { name: "ExamAce AI", role: "PYQs & Exam Roadmaps", icon: BookOpen },
    { name: "AssignMate AI", role: "Academic Rewriter & Citations", icon: PenTool },
    { name: "ConceptClear AI", role: "Socratic Step-by-Step Doubt Solver", icon: HelpCircle },
    { name: "NoteCraft AI", role: "Structured Markdown & Mind Maps", icon: FileText },
    { name: "QuizMaster AI", role: "Adaptive MCQs & Flashcards", icon: CheckSquare },
    { name: "StudyFlow AI", role: "Pomodoro Schedules & Timetables", icon: Calendar },
    { name: "PDFTutor AI", role: "Multi-Document PDF RAG & Q&A", icon: FileCode },
    { name: "CodeMentor AI", role: "DSA Sandbox & Code Optimizer", icon: Code },
    { name: "CareerPath AI", role: "ATS Resume & Skill Analyzer", icon: Briefcase },
  ];

  return (
    <section id="agents" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-100 dark:border-neutral-800/80 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>9 Autonomous Intelligence Agents</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Domain Experts at Your Service
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-400">
          Master AI automatically orchestrates the ideal agent for your specific academic need.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200/80 dark:border-neutral-800 flex items-center gap-4 hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-sm hover:shadow-md text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 truncate">
                  {agent.role}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

