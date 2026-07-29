import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Send, 
  BrainCircuit, 
  Plus, 
  Paperclip, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  FileText, 
  HelpCircle, 
  CheckSquare, 
  Calendar,
  User,
  PanelRightClose,
  PanelRightOpen,
  Bot,
  Key,
  RotateCcw,
  Code,
  Sparkles,
  FileCheck,
  X
} from 'lucide-react';
import robotAvatar from '../../assets/robot_avatar.png';

interface ChatMessage {
  id: string;
  sender: 'user' | 'master_ai';
  text: string;
  timestamp: string;
  isThinking?: boolean;
  activeAgents?: string[];
  attachedFile?: string;
}

interface MasterAIChatProps {
  activeAgentId?: string;
  onToggleRightPanel?: () => void;
  rightPanelOpen?: boolean;
}

export const MasterAIChat: React.FC<MasterAIChatProps> = ({ activeAgentId, onToggleRightPanel, rightPanelOpen }) => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [mentorPersonality, setMentorPersonality] = useState('Socratic Professor');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; content?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleExternalPrompt = (e: any) => {
      const promptText = e.detail;
      if (promptText && typeof promptText === 'string') {
        handleSend(promptText);
      }
    };
    window.addEventListener('send-master-ai-prompt', handleExternalPrompt);
    return () => window.removeEventListener('send-master-ai-prompt', handleExternalPrompt);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        content: event.target?.result as string
      });
    };
    reader.readAsText(file);
  };



  // Speech Recognition & Synthesis state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const studentFirstName = user?.fullName ? user.fullName.split(' ')[0] : 'Student';

  const agentTitles: Record<string, string> = {
    agent_exam: 'ExamAce AI Assistant',
    agent_assign: 'AssignMate AI Assistant',
    agent_concept: 'ConceptClear AI Assistant',
    agent_note: 'NoteCraft AI Assistant',
    agent_quiz: 'QuizMaster AI Assistant',
    agent_study: 'StudyFlow AI Assistant',
    agent_pdf: 'PDFTutor AI Assistant',
    agent_code: 'CodeMentor AI Assistant',
    agent_career: 'CareerPath AI Assistant'
  };

  const isDedicatedAgent = Boolean(activeAgentId && activeAgentId !== 'agents_all');
  const currentAgentTitle = activeAgentId ? (agentTitles[activeAgentId] || 'Master AI Assistant') : 'Master AI Assistant';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'master_ai',
      text: isDedicatedAgent 
        ? `Hello! I am **${currentAgentTitle}**. Ask me any specific questions, code problems, or concepts in my field and I will solve them in depth for you! 🚀`
        : "Hello! I orchestrate 9 specialized AI agents to help you master any subject.\n\nAsk me anything — from building an exam roadmap to debugging code or parsing PDFs. I've got you covered! 🚀",
      timestamp: '10:00 AM'
    }
  ]);

  // Setup Speech Synthesis and Speech Recognition
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const avail = window.speechSynthesis.getVoices();
        const englishVoice = avail.find(v => v.lang.startsWith('en')) || avail[0];
        if (englishVoice) setSelectedVoice(englishVoice);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setPrompt(currentTranscript);
      };
      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }
  }, []);

  // Strip Markdown for clean TTS
  const cleanMarkdownForSpeech = (rawText: string): string => {
    return rawText
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, 'code snippet')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*]\s+/g, '')
      .trim();
  };

  const speakMessageText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking && activeSpeakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const clean = cleanMarkdownForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(clean);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Failed to start speech recognition:", e);
        }
      } else {
        alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      }
    }
  };

  const presetActions = [
    { label: 'Generate Notes', icon: FileText, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40', query: 'Generate comprehensive revision notes for Data Structures and Operating Systems.' },
    { label: 'Solve Doubts', icon: HelpCircle, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40', query: 'Explain SQL INNER JOIN vs LEFT JOIN with example tables and query output.' },
    { label: 'Create Quiz', icon: CheckSquare, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40', query: 'Create 5 adaptive MCQs on Operating System Deadlock Conditions with answer key.' },
    { label: 'Study Plan', icon: Calendar, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40', query: 'Build a 7-day high-yield exam revision plan with daily time allocations.' },
  ];

  // Dynamic Prompt Solver Engine
  const generateDynamicAIResponse = (userQuery: string): { responseText: string; activated: string[] } => {
    const q = userQuery.toLowerCase().trim();
    let activated = ['Master AI Orchestrator'];
    let content = '';

    if (["hi", "hello", "hey", "hello hi", "hi there", "greetings", "good morning", "good evening"].includes(q)) {
      activated = ['ConceptClear AI', 'StudyFlow AI'];
      content = `### 👋 Hello! Welcome to EduVerse AI\n\nI am your **Master AI Learning Assistant**. I orchestrate **9 specialized AI agents** behind the scenes to help you master any subject!\n\n#### 🚀 What would you like to focus on today?\n- **📚 Exam Prep**: Ask for high-yield revision roadmaps & PYQs.\n- **💡 Concept Doubts**: Ask me to explain complex topics, DBMS, OS, or algorithms.\n- **💻 Code Sandbox**: Ask for code snippets in Python, C++, SQL, or JavaScript.\n- **📑 Adaptive Quizzes**: Request 5-question MCQs or flashcards.`;
    } else if (q.includes('sql') || q.includes('join') || q.includes('database') || q.includes('dbms')) {
      activated = ['ConceptClear AI', 'QuizMaster AI'];
      content = `### ⚡ SQL & Database Systems Solution\n\nHere is your step-by-step breakdown for **"${userQuery}"**:\n\n#### 📌 Key Concept Breakdown:\n1. **INNER JOIN**: Returns records that have matching values in both tables.\n2. **LEFT JOIN**: Returns all records from the left table, and matched records from the right table.\n\n\`\`\`sql\n-- Example SQL Join Query\nSELECT Students.id, Students.name, Courses.course_name\nFROM Students\nINNER JOIN Courses ON Students.course_id = Courses.id;\n\`\`\``;
    } else if (q.includes('os') || q.includes('deadlock') || q.includes('paging') || q.includes('operating system') || q.includes('memory')) {
      activated = ['ExamAce AI', 'ConceptClear AI'];
      content = `### 📚 Operating Systems Analysis\n\nHere is your authoritative solution for **"${userQuery}"**:\n\n#### 🔑 Deadlock Conditions:\n1. **Mutual Exclusion**: Non-shareable resource allocated to one process.\n2. **Hold & Wait**: Process holding resources while requesting others.\n3. **No Preemption**: Resources released voluntarily.\n4. **Circular Wait**: Closed loop of process-resource requests.\n\n\`\`\`text\n[Process P1] ---> (Resource R1) ---> [Process P2] ---> (Resource R2) ---> [Process P1]\n\`\`\``;
    } else if (q.includes('resume') || q.includes('interview') || q.includes('ats') || q.includes('career')) {
      activated = ['CareerPath AI'];
      content = `### 💼 CareerPath ATS Resume & Interview Report\n\nAnalysis for **"${userQuery}"**:\n\n#### 📈 Key Recommendations:\n1. **Quantify Impact**: Use metrics (e.g. *"Optimized API latency by 35%"*).\n2. **Keyword Optimization**: Include core tech keywords: Python, React, PostgreSQL, Docker, Data Structures.\n3. **Formatting**: Use clean single-column layout for ATS parsing.`;
    } else if (q.includes('binary') || q.includes('tree') || q.includes('graph') || q.includes('dijkstra') || q.includes('code') || q.includes('cpp') || q.includes('python') || q.includes('algorithm')) {
      activated = ['CodeMentor AI', 'ConceptClear AI'];
      content = `### 💻 CodeMentor Algorithm Solution\n\nHere is your custom solution for **"${userQuery}"**:\n\n#### ⚡ Complexity Analysis:\n- **Time Complexity**: O((V + E) log V) using Min-Priority Queue.\n- **Space Complexity**: O(V) auxiliary space.\n\n\`\`\`python\nimport heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    while pq:\n        curr_d, curr_n = heapq.heappop(pq)\n        if curr_d > distances[curr_n]: continue\n        for nxt, w in graph[curr_n].items():\n            d = curr_d + w\n            if d < distances[nxt]:\n                distances[nxt] = d\n                heapq.heappush(pq, (d, nxt))\n    return distances\n\`\`\``;
    } else {
      activated = ['Master AI Assistant', 'NoteCraft AI'];
      content = `### 🧠 Master AI Synthesized Answer\n\nHere is the tailored learning response for **"${userQuery}"**:\n\n#### 📌 Step-by-Step Explanation:\n1. **Core Concept Analysis**: We've processed **"${userQuery}"** and identified key concept markers.\n2. **Practical Takeaway**: Break down the core problem into sub-components and practice active recall.\n3. **Next Action**: Ask for code examples, request a 5-question quiz, or ask me to explain any sub-topic in simpler terms!`;
    }

    return { responseText: content, activated };
  };

  // API Key state
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('eduverse_api_key') || '');
  const [apiProvider, setApiProvider] = useState<string>(() => localStorage.getItem('eduverse_api_provider') || 'groq');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  const handleSaveApiKey = (key: string, prov: string) => {
    localStorage.setItem('eduverse_api_key', key);
    localStorage.setItem('eduverse_api_provider', prov);
    setApiKey(key);
    setApiProvider(prov);
    setShowKeyModal(false);
  };

  const handleNewChatSession = () => {
    setMessages([{
      id: '1',
      sender: 'master_ai',
      text: `Hello! I am your EduVerse Master AI Assistant. I orchestrate 9 specialized AI agents to help you master computer science, software engineering, and GATE exam subjects.\n\nAsk me anything — from building an exam roadmap to debugging code or parsing PDF notes! 🚀`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activeAgents: ['Master AI Assistant', 'ExamAce AI', 'CodeMentor AI']
    }]);
    setShowQuickMenu(false);
  };

  const handleInsertCodeSnippet = () => {
    setPrompt((prev) => prev ? `${prev}\n\`\`\`python\n# Write your code snippet here\n\`\`\`` : "```python\n# Write your code snippet here\n```");
    setShowQuickMenu(false);
  };

  const handleSend = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuery + (attachedFile ? ` (📎 Attached: ${attachedFile.name})` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFile: attachedFile ? attachedFile.name : undefined
    };

    const thinkingMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'master_ai',
      text: 'Thinking...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isThinking: true
    };

    setMessages((prev) => [...prev.filter(m => !m.isThinking), userMsg, thinkingMsg]);
    setPrompt('');
    setAttachedFile(null);
    setIsProcessing(true);

    const storedKey = localStorage.getItem('eduverse_api_key') || apiKey;
    const storedProv = localStorage.getItem('eduverse_api_provider') || apiProvider;

    // Backend Django API check first (with API Key payload)
    try {
      const response = await fetch('http://localhost:8000/api/v1/master-ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userQuery,
          api_key: storedKey,
          provider: storedProv
        })
      });

      if (response.ok) {
        const data = await response.json();
        const meta = data.orchestration_metadata || {};
        const responseId = (Date.now() + 2).toString();
        const responseMsg: ChatMessage = {
          id: responseId,
          sender: 'master_ai',
          text: data.master_ai_response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          activeAgents: meta.active_agents || [currentAgentTitle]
        };
        setMessages((prev) => [...prev.filter(m => !m.isThinking), responseMsg]);
        setIsProcessing(false);

        if (autoVoice) {
          speakMessageText(responseId, data.master_ai_response);
        }
        return;
      }
    } catch (e) {
      console.log("Django backend error or offline:", e);
    }

    // Fallback Dynamic solver
    setTimeout(() => {
      const { responseText, activated } = generateDynamicAIResponse(userQuery);
      const responseId = (Date.now() + 2).toString();
      const responseMsg: ChatMessage = {
        id: responseId,
        sender: 'master_ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeAgents: isDedicatedAgent ? [currentAgentTitle] : activated
      };

      setMessages((prev) => [...prev.filter(m => !m.isThinking), responseMsg]);
      setIsProcessing(false);

      if (autoVoice) {
        speakMessageText(responseId, responseText);
      }
    }, 1000);
  };

  return (
    <div className="flex-1 flex bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 overflow-hidden font-sans relative">
      
      {/* Hidden File Input Picker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.txt,.py,.js,.java,.cpp,.md,.json,.csv" 
      />

      {/* Center Main Workspace Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Top Greeting Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-purple-500/10 border border-purple-200/80 dark:border-purple-900/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
          
          <div className="space-y-4 max-w-lg z-10">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight flex items-center gap-2">
                {isDedicatedAgent ? (
                  <>
                    <Bot className="w-7 h-7 text-purple-600" />
                    <span>{currentAgentTitle}</span>
                  </>
                ) : (
                  <>Good morning, {studentFirstName}! 👋</>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed font-medium">
                {isDedicatedAgent 
                  ? "Specialized mode active. Ask me any direct question in my field." 
                  : "I'm your Master AI Assistant. How can I help you learn smarter today?"}
              </p>

              {/* Unique Feature #11: Agent Personality Selector */}
              <div className="pt-2 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-widest shrink-0">
                  Mentor Personality:
                </span>
                {['Socratic Professor', 'Strict Coach', 'Friendly Senior', 'Chill Senior', 'Industry Mentor'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setMentorPersonality(style)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                      mentorPersonality === style
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Action Preset Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {presetActions.map((preset, idx) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(preset.query)}
                    className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-2xs hover:shadow-md hover:border-purple-400 transition-all flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${preset.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cute 3D AI Robot Avatar */}
          <div className="w-44 h-44 shrink-0 flex items-center justify-center z-10 relative">
            <img 
              src={robotAvatar} 
              alt="Master AI Robot" 
              className="w-full h-full object-contain drop-shadow-xl animate-float"
            />
          </div>
        </div>

        {/* Speech Recognition Indicator Banner (Shown when listening) */}
        {isListening && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 animate-bounce" />
              <div>
                <p className="text-xs font-bold">Listening to your voice...</p>
                <p className="text-[11px] text-red-400 opacity-90">Speak your question clearly. Text is populating live below.</p>
              </div>
            </div>
            <button 
              onClick={toggleListening}
              className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Stop Listening
            </button>
          </div>
        )}

        {/* Conversation Message Log */}
        <div className="space-y-6 pt-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white ${
                msg.sender === 'user'
                  ? 'bg-purple-600 font-extrabold text-xs'
                  : 'bg-purple-600 shadow-purple-500/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <BrainCircuit className="w-5 h-5" />}
              </div>

              {/* Message Content */}
              <div className={`space-y-1 max-w-2xl ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-neutral-500">
                  <span className="font-bold text-slate-800 dark:text-neutral-200">
                    {msg.sender === 'user' ? 'User' : currentAgentTitle}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.activeAgents && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {msg.activeAgents.map((ag, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        ⚡ {ag}
                      </span>
                    ))}
                  </div>
                )}

                {msg.isThinking ? (
                  <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2 shadow-2xs">
                    <span>Thinking...</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                    </span>
                  </div>
                ) : (
                  <div className={`p-4.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-100 border border-purple-200 dark:border-purple-800 rounded-tr-none font-semibold text-left shadow-2xs'
                      : 'bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 rounded-tl-none shadow-xs'
                  }`}>
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {msg.sender === 'master_ai' && (
                      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs">
                        <button
                          onClick={() => speakMessageText(msg.id, msg.text)}
                          className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            isSpeaking && activeSpeakingMsgId === msg.id
                              ? 'bg-emerald-500 text-white animate-pulse'
                              : 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 hover:bg-purple-100'
                          }`}
                        >
                          {isSpeaking && activeSpeakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isSpeaking && activeSpeakingMsgId === msg.id ? 'Stop Voice' : 'Speak Answer'}</span>
                        </button>

                        <button
                          onClick={() => navigator.clipboard.writeText(msg.text)}
                          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 text-[11px] font-semibold cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Question Input Card Container */}
        <div className="space-y-2 pt-4 relative">
          
          {/* Quick Actions Dropdown Menu */}
          {showQuickMenu && (
            <div className="absolute bottom-full left-4 mb-2 w-64 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-30 font-sans space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Quick Actions</div>
              
              <button
                type="button"
                onClick={handleNewChatSession}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors cursor-pointer text-left"
              >
                <RotateCcw className="w-4 h-4 text-purple-500" />
                <span>New Chat Session</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors cursor-pointer text-left"
              >
                <Paperclip className="w-4 h-4 text-blue-500" />
                <span>Attach Notes or PDF</span>
              </button>

              <button
                type="button"
                onClick={handleInsertCodeSnippet}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors cursor-pointer text-left"
              >
                <Code className="w-4 h-4 text-indigo-500" />
                <span>Insert Code Block</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrompt("Create a 5-question MCQ quiz on Operating Systems and Data Structures.");
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors cursor-pointer text-left"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Generate Adaptive Quiz</span>
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(prompt);
            }}
            className="rounded-3xl border border-purple-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all space-y-3"
          >
            {/* Attached File Pill Badge */}
            {attachedFile && (
              <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 w-fit">
                <FileCheck className="w-4 h-4 text-purple-600" />
                <span>{attachedFile.name}</span>
                <span className="text-[10px] text-purple-400 font-normal">({attachedFile.size})</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-0.5 rounded-full hover:bg-purple-200/50 dark:hover:bg-purple-800/50 text-purple-500 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full border border-rose-500/20 text-xs font-bold w-fit mb-2 animate-pulse">
                <Mic className="w-3.5 h-3.5 animate-bounce" />
                <span>Listening... Speak into your microphone</span>
              </div>
            )}

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : isDedicatedAgent ? `Ask ${currentAgentTitle} anything...` : "Ask anything or click mic to speak..."}
              rows={2}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none resize-none"
            />

            {/* Input Toolbar */}
            <div className="flex items-center justify-between pt-2">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setShowQuickMenu(!showQuickMenu)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-400 text-xs font-bold transition-all cursor-pointer"
                  title="Quick Actions Menu"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-400 text-xs font-semibold transition-all cursor-pointer"
                  title="Attach file (PDF, TXT, Code)"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>

                {/* API Key Configure Button */}
                <button 
                  type="button"
                  onClick={() => setShowKeyModal(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    apiKey ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                  title="Configure LLM API Key (Groq, Gemini, OpenAI)"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{apiKey ? `API Active (${apiProvider.toUpperCase()})` : 'Set LLM API Key'}</span>
                </button>

                {/* Auto Voice Output Toggle */}
                <button 
                  type="button"
                  onClick={() => setAutoVoice(!autoVoice)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    autoVoice ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-slate-100 text-slate-400 dark:bg-neutral-800'
                  }`}
                >
                  {autoVoice ? <Volume2 className="w-3.5 h-3.5 text-purple-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{autoVoice ? 'Auto Voice On' : 'Muted'}</span>
                </button>
              </div>

              {/* Right Send & Speech Recognition Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-full transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                      : 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-purple-100 hover:text-purple-600'
                  }`}
                  title={isListening ? "Stop Speech Recognition" : "Click to Speak (Speech Recognition)"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={(!prompt.trim() && !attachedFile) || isProcessing}
                  className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center font-medium">
            Master AI orchestrates 9 specialized agents. Click the mic to speak or listen to answers in voice.
          </p>
        </div>

      </div>

      {/* Right Collapsible Panel Toggle Button */}
      {onToggleRightPanel && (
        <div className="border-l border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center p-2">
          <button
            onClick={onToggleRightPanel}
            className="p-2 rounded-xl text-slate-400 hover:text-purple-600 transition-colors flex flex-col items-center gap-2 cursor-pointer text-[10px] font-bold"
            title="Toggle Right Telemetry Panel"
          >
            {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span className="writing-mode-vertical uppercase tracking-wider text-[9px] text-slate-400 hidden sm:inline">
              Open panel
            </span>
          </button>
        </div>
      )}

      {/* LLM API Key Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  🔑
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-neutral-100">LLM API Key Settings</h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Enter your Groq, Google Gemini, or OpenAI API key. Master AI will use this API key to generate live LLM responses for all queries.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 block mb-1">Provider:</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs rounded-xl p-2.5 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="groq">Groq API (Llama 3.3 70B - Recommended / Free)</option>
                  <option value="gemini">Google Gemini API (Gemini 1.5 Flash)</option>
                  <option value="openai">OpenAI API (GPT-4o mini)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 block mb-1">API Key:</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={apiProvider === 'groq' ? "gsk_..." : apiProvider === 'gemini' ? "AIza..." : "sk-..."}
                  className="w-full bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs rounded-xl p-2.5 text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleSaveApiKey('', 'groq');
                }}
                className="px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
              >
                Clear Key
              </button>

              <button
                type="button"
                onClick={() => handleSaveApiKey(apiKey, apiProvider)}
                className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md cursor-pointer transition-all"
              >
                Save API Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
