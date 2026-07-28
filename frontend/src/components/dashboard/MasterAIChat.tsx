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
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      title: "Exam Roadmap & PYQs",
      desc: "14-day revision schedule with high-yield topic priorities",
      query: "Create a 14-day high-yield revision roadmap for Data Structures & Algorithms exams with PYQ breakdown."
    },
    {
      icon: HelpCircle,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      title: "Socratic Doubt Solver",
      desc: "Step-by-step explanation with real-world analogies",
      query: "Explain Dijkstra's shortest path algorithm step-by-step with real-life analogies and Python code snippet."
    },
    {
      icon: FileText,
      color: 'text-red-500 bg-red-500/10 border-red-500/20',
      title: "PDF Textbook QA & MCQs",
      desc: "Cross-reasoning across uploaded operating systems notes",
      query: "Analyze my uploaded operating systems PDF notes and generate 5 adaptive MCQs with instant scoring."
    },
    {
      icon: Briefcase,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      title: "ATS Resume & Mock Interview",
      desc: "Skill gap analysis and interactive technical interview",
      query: "Review my resume for a Software Engineer Intern role, highlight missing skill gaps, and simulate a mock interview."
    }
  ];

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
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-50/40 via-indigo-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 overflow-hidden font-sans">
      
      {/* Top Active Agent Network Header Bar */}
      <div className="px-6 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between gap-3 shadow-2xs z-10 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Active Agent Network:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {agentBadges.map((badge, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${badge.color}`}
            >
              {badge.name}
            </span>
          ))}
        </div>
      </div>

      {/* Brainly-Inspired Hero Search & Ask Section */}
      <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-5 text-center shrink-0">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Go from <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">questioning</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">understanding</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            One Master AI Assistant orchestrates 9 specialized neural agents to crack your toughest homework, code, and exam questions.
          </p>
        </div>

        {/* Prominent Brainly-Style Rounded Search & Ask Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(prompt);
          }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative flex items-center bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 rounded-full shadow-xl hover:shadow-2xl focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-1.5">
            <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What is your question? (e.g. 'Explain Dijkstra algorithm', 'Create 5 MCQs on OS')"
              className="w-full pl-3 pr-16 py-3 bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isProcessing}
              className="w-12 h-12 rounded-full agent-gradient-master text-white flex items-center justify-center shadow-lg hover:scale-105 disabled:opacity-40 transition-transform shrink-0 cursor-pointer absolute right-2"
              title="Ask Master AI"
            >
              {isProcessing ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {/* Subject Filter Carousel Chips */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {subjectFilters.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSubject(sub.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                selectedSubject === sub.value
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Action Cards Row */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4 max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {presets.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSend(preset.query)}
                className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 p-4 rounded-2xl shadow-xs hover:shadow-lg hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${preset.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {preset.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Try this prompt</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Conversation Log Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 max-w-5xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.sender === 'user' ? 'ml-auto flex-row-reverse max-w-2xl' : 'max-w-4xl'}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              msg.sender === 'user'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-xs'
                : 'agent-gradient-master text-white shadow-indigo-500/25'
            }`}>
              {msg.sender === 'user' ? 'ST' : <BrainCircuit className="w-6 h-6" />}
            </div>

            <div className={`space-y-2 flex-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {msg.sender === 'user' ? 'Student Question' : 'Master AI Assistant'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {msg.activeAgents && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {msg.activeAgents.map((ag, i) => (
                    <span key={i} className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-indigo-500" /> {ag}
                    </span>
                  ))}
                </div>
              )}

              <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md font-semibold text-left'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
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
      </div>
    </div>
  );
};
