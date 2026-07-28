import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  Share2,
  BrainCircuit
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'master_ai';
  text: string;
  timestamp: string;
  activeAgents?: string[];
  knowledgeGraphNodesAdded?: string[];
  flashcardsCreated?: number;
}

export const MasterAIChat: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'master_ai',
      text: "Hello! I am your **Master AI Learning Assistant**. I orchestrate 9 specialized AI agents behind the scenes to help you master any subject.\n\nAsk me anything — whether it's building an exam roadmap, debugging DSA code, parsing PDFs, or generating adaptive quizzes!",
      timestamp: '10:00 AM',
      activeAgents: ['Master AI Orchestrator'],
    }
  ]);

  const agentBadges = [
    { name: 'ExamAce AI', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
    { name: 'AssignMate AI', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30' },
    { name: 'ConceptClear AI', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    { name: 'NoteCraft AI', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' },
    { name: 'QuizMaster AI', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
    { name: 'StudyFlow AI', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' },
    { name: 'PDFTutor AI', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' },
    { name: 'CodeMentor AI', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30' },
    { name: 'CareerPath AI', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30' },
  ];

  const presets = [
    {
      label: "🎯 Exam Prep Roadmap & PYQs",
      query: "Create a 14-day high-yield revision roadmap for Data Structures & Algorithms exams with PYQ breakdown."
    },
    {
      label: "💡 Concept Doubt & Code Sandbox",
      query: "Explain Dijkstra's shortest path algorithm step-by-step with real-life analogies and Python code snippet."
    },
    {
      label: "📑 PDF Analysis & Adaptive Quiz",
      query: "Analyze my uploaded operating systems PDF notes and generate 5 adaptive MCQs with instant scoring."
    },
    {
      label: "💼 Resume ATS Review & Career Guidance",
      query: "Review my resume for a Software Engineer Intern role, highlight missing skill gaps, and simulate a mock interview."
    }
  ];

  const handleSend = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/master-ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });

      if (response.ok) {
        const data = await response.json();
        const meta = data.orchestration_metadata || {};
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'master_ai',
          text: data.master_ai_response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          activeAgents: meta.active_agents || ['Master AI Assistant'],
          knowledgeGraphNodesAdded: [userPrompt.slice(0, 20)],
          flashcardsCreated: meta.flashcards_created || 0
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsProcessing(false);
        return;
      }
    } catch (e) {
      console.log("Django API offline, using local Orchestrator simulation:", e);
    }

    let activated: string[] = [];
    const lower = userPrompt.toLowerCase();
    if (lower.includes('exam') || lower.includes('revision') || lower.includes('roadmap')) activated.push('ExamAce AI', 'StudyFlow AI');
    if (lower.includes('code') || lower.includes('algorithm') || lower.includes('python') || lower.includes('dijkstra')) activated.push('CodeMentor AI', 'ConceptClear AI');
    if (lower.includes('pdf') || lower.includes('notes') || lower.includes('operating system')) activated.push('PDFTutor AI', 'QuizMaster AI', 'NoteCraft AI');
    if (lower.includes('resume') || lower.includes('interview') || lower.includes('career')) activated.push('CareerPath AI');
    
    if (activated.length === 0) activated = ['ConceptClear AI', 'QuizMaster AI'];

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'master_ai',
        text: `### Master AI Synthesized Response\n\nI have analyzed your request and orchestrated **${activated.join(', ')}** to provide an optimal learning solution.\n\n#### 🔑 Core Breakdown & Insights:\n1. **Concept Breakdown**: Structured logic tailored to your current mastery level in your Personal Knowledge Graph.\n2. **Actionable Roadmap**: Step-by-step execution path generated with adaptive recall markers.\n\n\`\`\`python\n# Master AI Code Optimization Example\ndef shortest_path(graph, start):\n    # Optimized Dijkstra Implementation\n    pass\n\`\`\`\n\n#### 📈 Automated State Updates:\n- Added concept node **"${userPrompt.slice(0, 20)}..."** to Knowledge Graph.\n- Scheduled 3 SM-2 spaced-repetition flashcards for tonight's review session.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeAgents: activated,
        knowledgeGraphNodesAdded: [userPrompt.slice(0, 20)],
        flashcardsCreated: 3
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-50/70 dark:bg-slate-950/70 relative">
      {/* Top Active Agent Network Header Bar */}
      <div className="px-6 py-2.5 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-3 shadow-xs z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Active Agent Network:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {agentBadges.map((badge, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap shadow-2xs ${badge.color}`}
            >
              {badge.name}
            </span>
          ))}
        </div>
      </div>

      {/* Main Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 max-w-4xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              msg.sender === 'user'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs'
                : 'agent-gradient-master text-white shadow-indigo-500/20'
            }`}>
              {msg.sender === 'user' ? 'ST' : <BrainCircuit className="w-5 h-5" />}
            </div>

            <div className={`space-y-2 max-w-2xl ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {msg.sender === 'user' ? 'Student' : 'Master AI Assistant'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {msg.activeAgents && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {msg.activeAgents.map((ag, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-indigo-500" /> {ag}
                    </span>
                  ))}
                </div>
              )}

              <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20 font-medium'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {msg.text}
                </div>

                {msg.flashcardsCreated ? (
                  <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-2 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> +{msg.flashcardsCreated} Flashcards Scheduled
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 font-bold">
                      <Share2 className="w-3.5 h-3.5" /> Knowledge Graph Updated
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-4 max-w-2xl items-center">
            <div className="w-9 h-9 rounded-xl agent-gradient-master flex items-center justify-center text-white animate-pulse">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs text-indigo-600 dark:text-indigo-400 font-bold shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
              Master AI is classifying intent & orchestrating specialized agents...
            </div>
          </div>
        )}
      </div>

      {/* Bottom Preset Chips & Input Bar */}
      <div className="p-4 border-t border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md space-y-3 shadow-lg z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-bold shrink-0 text-[11px]">Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs hover:shadow-md hover:border-transparent cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(prompt);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Master AI... (e.g. 'Explain binary search trees, create a 5-question quiz, and write Python code')"
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium transition-all shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="px-6 py-3 rounded-xl agent-gradient-master text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
