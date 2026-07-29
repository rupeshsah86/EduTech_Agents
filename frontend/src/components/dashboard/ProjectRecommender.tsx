import React, { useState } from 'react';
import { Rocket, ExternalLink, Sparkles, Clock, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProjectRecommendation {
  id: string;
  title: string;
  category: string;
  matchScore: number; // 0 to 100 percentage
  estimatedTime: string;
  difficulty: string;
  existingSkills: string[];
  missingSkills: string[];
  whyRecommended: string;
  description: string;
  projectUrl?: string;
}

export const ProjectRecommender: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const recommendations: ProjectRecommendation[] = [
    {
      id: 'proj_1',
      title: 'Distributed Vector RAG Search Engine',
      category: 'System Architecture & AI',
      matchScore: 94,
      estimatedTime: '14 Hours (2-3 Days)',
      difficulty: 'Advanced',
      existingSkills: ['Python', 'FastAPI', 'PostgreSQL', 'LangChain'],
      missingSkills: ['HNSW Vector Indexing', 'Multi-Query RAG'],
      whyRecommended: 'Your Knowledge Graph shows 95% mastery in Arrays/SQL but missing HNSW vector indexing. Building this bridges your AI engineering gap.',
      description: 'Build a high-performance vector search engine with HNSW indexing, document chunking pipelines, and hybrid keyword-vector retrieval.'
    },
    {
      id: 'proj_2',
      title: 'Distributed Task Queue with Celery & Redis',
      category: 'Backend & Concurrency',
      matchScore: 88,
      estimatedTime: '10 Hours (2 Days)',
      difficulty: 'Intermediate',
      existingSkills: ['Django', 'Python', 'Redis'],
      missingSkills: ['Celery Workers', 'Exponential Backoff Retry'],
      whyRecommended: 'Perfect match for your Operating Systems Process Synchronization interest. Teaches async message broker design.',
      description: 'Implement a reliable background worker engine with retry policies, rate limiting, and result store persistence.'
    },
    {
      id: 'proj_3',
      title: 'Global EdTech Hackathon 2026',
      category: 'Hackathon Opportunity',
      matchScore: 96,
      estimatedTime: '48 Hour Hackathon',
      difficulty: 'Open to All',
      existingSkills: ['Multi-Agent Systems', 'React', 'TypeScript', 'Groq API'],
      missingSkills: ['WebRTC Live Audio'],
      whyRecommended: 'Matches your top strengths in Multi-Agent AI architecture & React dashboard design. High prize pool opportunity ($25,000).',
      description: 'Compete against global engineering teams building AI-powered student learning tools with multi-agent orchestration.'
    }
  ];

  const filteredProjects = selectedFilter === 'All'
    ? recommendations
    : recommendations.filter((p) => p.category.includes(selectedFilter) || p.difficulty.includes(selectedFilter));

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              AI Project & Hackathon Recommender
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            CareerPath AI automatically matches real portfolio projects & hackathons to your Personal Knowledge Graph mastery level.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
          Unique Feature #13: Project & Hackathon Recommender
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'System Architecture', 'Backend', 'Hackathon'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
              selectedFilter === cat
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProjects.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-purple-500/50 transition-all group"
          >
            <div className="space-y-4">
              {/* Header Badges: Category + Match % */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {item.category}
                </span>

                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-black">
                  <Target className="w-3 h-3" />
                  <span>{item.matchScore}% Match</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-neutral-100 leading-snug group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* 🌟 Why Recommended For You Highlight Box */}
              <div className="p-3 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-1">
                <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Why Recommended For You
                </span>
                <p className="text-[11px] text-slate-700 dark:text-neutral-300 font-medium leading-relaxed">
                  {item.whyRecommended}
                </p>
              </div>

              {/* Existing Skills vs Missing Skills */}
              <div className="space-y-2 pt-1 text-xs">
                {/* Existing Skills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Existing Skills You Have
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.existingSkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" /> Skills You Will Learn
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.missingSkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Estimated Time & Action Button */}
            <div className="border-t border-slate-100 dark:border-neutral-800 pt-3 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-neutral-400">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-purple-500" /> {item.estimatedTime}
                </span>
                <span className="text-amber-500 font-extrabold text-[11px]">{item.difficulty}</span>
              </div>

              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('send-master-ai-prompt', { 
                    detail: `Provide a step-by-step implementation guide and architecture spec for the project: ${item.title}` 
                  }));
                }}
                className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Generate Project Architecture Spec</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
