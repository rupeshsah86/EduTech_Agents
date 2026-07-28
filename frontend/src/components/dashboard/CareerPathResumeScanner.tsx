import React, { useState } from 'react';
import { Briefcase, CheckCircle2, AlertTriangle, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export const CareerPathResumeScanner: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Software Engineer Intern');
  const [atsScore, setAtsScore] = useState(88);
  const [isScanning, setIsScanning] = useState(false);
  const [mockQuestion, setMockQuestion] = useState<string | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAtsScore(92);
      setIsScanning(false);
    }, 1000);
  };

  const handleStartMockInterview = () => {
    setMockQuestion(
      "AI Interviewer: 'Welcome! Let's start with a technical question: Can you explain how Redis in-memory caching reduces PostgreSQL database load, and how you handle cache invalidation strategies?'"
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            CareerPath AI — ATS Resume Scanner & Mock Interview Simulator
          </h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
          ATS v2.4 Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ATS Gauge Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 flex flex-col justify-between text-center space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase">Target Role Match</p>
          <div>
            <div className="text-4xl font-extrabold text-orange-500">{atsScore} / 100</div>
            <p className="text-[11px] text-emerald-500 font-medium mt-1">High ATS Compatibility</p>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {isScanning ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{isScanning ? 'Re-scanning Resume...' : 'Re-Scan Resume PDF'}</span>
          </button>
        </div>

        {/* Target Role & Skill Gap Analysis */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Role:</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="Software Engineer Intern">Software Engineer Intern</option>
              <option value="Backend Engineer">Backend Engineer (Django/Python)</option>
              <option value="Full Stack Engineer">Full Stack Engineer (React/Node)</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords
                </span>
                <span className="text-[11px] text-slate-400">14 / 16 Found</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Python, Django, React, TypeScript, PostgreSQL, Redis, Celery, REST API, Git, Docker.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Actionable Resume Rewrites Suggested
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong className="text-amber-500">Original:</strong> "Built a chat application with AI." <br />
                <strong className="text-emerald-500">Actionable Rewrite:</strong> "Orchestrated 9 neural AI agents behind a Master AI Assistant using Python, Groq LLM API, and PostgreSQL pgvector."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Interview Simulator Section */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              AI Mock Technical & Behavioral Interview Simulator
            </h4>
          </div>
          <button
            onClick={handleStartMockInterview}
            className="px-4 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Launch Mock Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {mockQuestion && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-orange-300 font-mono leading-relaxed">
            {mockQuestion}
          </div>
        )}
      </div>
    </div>
  );
};
