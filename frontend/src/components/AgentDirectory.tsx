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

export const AgentDirectory: React.FC = () => {
  const agents = [
    {
      name: "ExamAce AI",
      category: "Exam Preparation",
      icon: BookOpen,
      color: "from-amber-500 to-red-500",
      description: "Generates PYQ roadmaps, high-yield topic analysis, revision strategies, and exam countdown schedules.",
      tags: ["PYQs", "Revision", "Topic Priority"]
    },
    {
      name: "AssignMate AI",
      category: "Academic Writing",
      icon: PenTool,
      color: "from-pink-500 to-rose-500",
      description: "Assists with paper drafting, academic rewrites, citation styling (APA/IEEE/MLA), and plagiarism checks.",
      tags: ["Citations", "Grammar", "Research"]
    },
    {
      name: "ConceptClear AI",
      category: "Doubt Solving",
      icon: HelpCircle,
      color: "from-blue-500 to-indigo-500",
      description: "Socratic teaching engine providing step-by-step doubt resolution, real-world analogies, and multi-level explanations.",
      tags: ["Socratic", "Analogies", "Step-by-Step"]
    },
    {
      name: "NoteCraft AI",
      category: "Notes & Summaries",
      icon: FileText,
      color: "from-purple-500 to-violet-500",
      description: "Converts lectures and documents into structured markdown notes, visual mind maps, and formula cheat sheets.",
      tags: ["Mind Maps", "Markdown", "Summaries"]
    },
    {
      name: "QuizMaster AI",
      category: "Adaptive Evaluation",
      icon: CheckSquare,
      color: "from-emerald-500 to-teal-500",
      description: "Generates dynamic adaptive MCQs, evaluates attempts instantly, and schedules SM-2 spaced repetition flashcards.",
      tags: ["Adaptive MCQs", "SM-2 Flashcards", "Scoring"]
    },
    {
      name: "StudyFlow AI",
      category: "Study Planner",
      icon: Calendar,
      color: "from-cyan-500 to-blue-500",
      description: "AI timetable generator with Pomodoro timers, study velocity tracking, and automated timetable adjustments.",
      tags: ["Timetable", "Pomodoro", "Analytics"]
    },
    {
      name: "PDFTutor AI",
      category: "Multi-Document RAG",
      icon: FileCode,
      color: "from-red-500 to-amber-500",
      description: "Upload multiple PDF textbooks/notes for cross-document reasoning, citation lookup, and topic extraction.",
      tags: ["RAG", "PDF QA", "Cross-Reasoning"]
    },
    {
      name: "CodeMentor AI",
      category: "Coding & Interview Prep",
      icon: Code,
      color: "from-teal-500 to-emerald-500",
      description: "Interactive coding sandbox tutor providing DSA complexity analysis (Time/Space), debugging, and interview prep.",
      tags: ["DSA Sandbox", "Big-O", "Debugging"]
    },
    {
      name: "CareerPath AI",
      category: "Career & Placement",
      icon: Briefcase,
      color: "from-orange-500 to-amber-500",
      description: "Resume ATS scanner with actionable rewrites, skill gap detection, salary insights, and mock interview simulator.",
      tags: ["ATS Resume", "Skill Gap", "Mock Interview"]
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 min-h-[calc(100vh-4rem)]">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Specialized Neural AI Agents (9)</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Master AI Assistant seamlessly orchestrates these 9 agents behind the scenes for unified learning.
        </p>
      </div>

      {/* Grid of 9 Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl glass-card-hover flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {agent.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                {agent.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


