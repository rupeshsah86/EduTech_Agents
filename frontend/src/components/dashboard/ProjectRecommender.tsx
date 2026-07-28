import React from 'react';
import { Rocket, ExternalLink } from 'lucide-react';

export const ProjectRecommender: React.FC = () => {
  const recommendations = [
    {
      title: 'Distributed Vector RAG Search Engine',
      category: 'System Architecture & AI',
      difficulty: 'Advanced',
      matchingSkills: ['PostgreSQL pgvector', 'Python', 'FastAPI', 'LangChain'],
      description: 'Build a high-performance vector search service with HNSW indexing, chunking pipelines, and hybrid keyword search.'
    },
    {
      title: 'Distributed Task Queue with Celery & Redis',
      category: 'Backend & Concurrency',
      difficulty: 'Intermediate',
      matchingSkills: ['Redis', 'Celery', 'Django', 'Concurrency'],
      description: 'Implement a reliable background worker engine with retry policies, rate limiting, and result store persistence.'
    },
    {
      title: 'Global EdTech Hackathon 2026',
      category: 'Hackathon Opportunity',
      difficulty: 'Open to All',
      matchingSkills: ['Multi-Agent Systems', 'React', 'Groq API'],
      description: 'Compete against global teams building AI-powered student learning apps with prizes worth $25,000.'
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              AI Project & Hackathon Recommender
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            CareerPath AI automatically matches real portfolio projects & hackathons to your Personal Knowledge Graph mastery level.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
          Unique Feature #13: Project & Hackathon Recommender
        </span>
      </div>

      {/* Recommended Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((item, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-purple-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {item.category}
                </span>
                <span className="text-[11px] font-extrabold text-amber-500">{item.difficulty}</span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-neutral-100 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.matchingSkills.map((sk, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Start Project Spec</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
