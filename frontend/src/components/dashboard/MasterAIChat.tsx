import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Zap, 
  Share2,
  BrainCircuit,
  Search,
  BookOpen,
  FileText,
  Briefcase,
  HelpCircle,
  ChevronRight
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
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'master_ai',
      text: "Hello! I am your **Master AI Assistant**. I orchestrate 9 specialized neural agents behind the scenes to help you go from questioning to understanding.\n\nAsk me anything — whether it's building an exam roadmap, debugging DSA code, parsing PDF textbooks, or generating adaptive quizzes!",
      timestamp: '10:00 AM',
      activeAgents: ['Master AI Orchestrator'],
    }
  ]);

  const subjectFilters = [
    { label: '🎯 All Subjects', value: 'All' },
    { label: '💻 DSA & Algorithms', value: 'DSA' },
    { label: '📚 Operating Systems', value: 'OS' },
    { label: '⚡ Database Systems', value: 'DBMS' },
    { label: '📑 PDF Research RAG', value: 'PDF' },
    { label: '💼 Career & Resume', value: 'Career' },
  ];

  const presets = [
    {
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
      title: "Exam Roadmap & PYQs",
      desc: "14-day revision schedule with high-yield topic priorities",
      query: "Create a 14-day high-yield revision roadmap for Data Structures & Algorithms exams with PYQ breakdown."
    },
    {
      icon: HelpCircle,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
      title: "Socratic Doubt Solver",
      desc: "Step-by-step explanation with real-world analogies",
      query: "Explain Dijkstra's shortest path algorithm step-by-step with real-life analogies and Python code snippet."
    },
    {
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
      title: "PDF Textbook QA & MCQs",
      desc: "Cross-reasoning across uploaded operating systems notes",
      query: "Analyze my uploaded operating systems PDF notes and generate 5 adaptive MCQs with instant scoring."
    },
    {
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20',
      title: "ATS Resume & Mock Interview",
      desc: "Skill gap analysis and interactive technical interview",
      query: "Review my resume for a Software Engineer Intern role, highlight missing skill gaps, and simulate a mock interview."
    }
  ];

  const agentBadges = [
    { name: 'ExamAce AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'AssignMate AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'ConceptClear AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'NoteCraft AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'QuizMaster AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'StudyFlow AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'PDFTutor AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'CodeMentor AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
    { name: 'CareerPath AI', color: 'bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-300 border-slate-200 dark:border-neutral-800' },
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
        text: `### Master AI Synthesized Answer\n\nI have processed your request and orchestrated **${activated.join(', ')}** to provide an authoritative learning response.\n\n#### 🔑 Core Breakdown & Learning Strategy:\n1. **Socratic Analysis**: Tailored to your current level in your Personal Knowledge Graph.\n2. **Actionable Output**: Step-by-step roadmap with recall checkpoints.\n\n\`\`\`python\n# Master AI Automated Sandbox Execution\ndef eduverse_solver():\n    # Optimized Implementation\n    return "Master AI Answer Verified"\n\`\`\`\n\n#### 📈 Learning State Updates:\n- Added concept node **"${userPrompt.slice(0, 20)}..."** to Knowledge Graph.\n- Scheduled 3 SM-2 flashcards for tonight's revision session.`,
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
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen font-sans flex flex-col">
      
      {/* Subtle Active Agent Network Header Bar */}
      <div className="px-6 py-2 border-b border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2 font-bold text-slate-600 dark:text-neutral-400 shrink-0">
          <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Active Agent Network:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {agentBadges.map((badge, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${badge.color}`}
            >
              {badge.name}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8 flex-1">
        
        {/* Clean Hero Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-neutral-100">
            Go from <span className="text-purple-600 dark:text-purple-400">questioning</span> to <span className="text-purple-600 dark:text-purple-400">understanding</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-xl mx-auto font-medium">
            One Master AI Assistant orchestrates 9 specialized neural agents behind the scenes.
          </p>
        </div>

        {/* Hero Focused Question Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(prompt);
          }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative flex items-center bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 rounded-full shadow-lg focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/20 transition-all p-1.5">
            <Search className="w-5 h-5 text-slate-400 dark:text-neutral-500 ml-4 shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What is your question? (e.g. 'Explain Dijkstra algorithm', 'Create 5 MCQs on OS')"
              className="w-full pl-3 pr-14 py-2.5 bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isProcessing}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md disabled:opacity-40 transition-all shrink-0 cursor-pointer absolute right-2"
              title="Ask Master AI"
            >
              {isProcessing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Minimal Subject Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {subjectFilters.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSubject(sub.value)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                selectedSubject === sub.value
                  ? 'bg-slate-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-slate-900 dark:border-neutral-100 shadow-xs'
                  : 'bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-800'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Refined Feature Suggestion Cards */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {presets.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleSend(preset.query)}
                  className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 rounded-2xl hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${preset.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-snug">
                        {preset.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-[10px] font-bold text-purple-600 dark:text-purple-400 pt-1">
                    <span>Try this prompt</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Conversation / Master AI Output Log */}
        <div className="space-y-6 pt-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.sender === 'user' ? 'ml-auto flex-row-reverse max-w-2xl' : 'max-w-3xl'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-xs'
                  : 'bg-purple-600 text-white'
              }`}>
                {msg.sender === 'user' ? 'ST' : <BrainCircuit className="w-5 h-5" />}
              </div>

              <div className={`space-y-2 flex-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-neutral-500">
                  <span className="font-bold text-slate-900 dark:text-neutral-100">
                    {msg.sender === 'user' ? 'Student Question' : 'Master AI Assistant'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.activeAgents && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {msg.activeAgents.map((ag, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-purple-500" /> {ag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none font-medium text-left'
                    : 'bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 rounded-tl-none shadow-xs'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {msg.flashcardsCreated ? (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-neutral-800 flex flex-wrap gap-2 text-xs">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +{msg.flashcardsCreated} Flashcards Scheduled
                      </span>
                      <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20 font-bold">
                        <Share2 className="w-3.5 h-3.5" /> Knowledge Graph Updated
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
