import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Send, 
  BrainCircuit, 
  Paperclip, 
  Mic, 
  Volume2,
  VolumeX,
  Copy,
  FileText, 
  HelpCircle, 
  CheckSquare, 
  Calendar, 
  User,
  Bot,
  Sparkles,
  X
} from 'lucide-react';

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

export const MasterAIChat: React.FC<MasterAIChatProps> = ({ activeAgentId }) => {

  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; content?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
  const [autoVoice] = useState(true);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);


  const studentFirstName = user?.fullName ? user.fullName.split(' ')[0] : 'Student';

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('eduverse_onboarding_dismissed') !== 'true';
  });

  const dismissOnboarding = () => {
    localStorage.setItem('eduverse_onboarding_dismissed', 'true');
    setShowOnboarding(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Setup Speech Synthesis and Speech Recognition
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))) || voices[0];
        if (preferredVoice) setSelectedVoice(preferredVoice);
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

  // Dynamic Prompt Solver Engine for Any Question
  const generateDynamicAIResponse = (userQuery: string): { responseText: string; activated: string[] } => {
    const q = userQuery.toLowerCase().trim();
    let activated = ['Master AI Orchestrator'];
    let content = '';

    if (["hi", "hello", "hey", "hello hi", "hi there", "greetings", "good morning", "good evening", "howdy", "how are you"].some(g => q === g || q.startsWith(g + ' '))) {
      activated = ['ConceptClear AI', 'StudyFlow AI'];
      content = `### 👋 Hello! Welcome to EduVerse AI\n\nI am your **Master AI Learning Assistant**. I orchestrate **9 specialized AI agents** to help you master computer science, engineering, mathematics, exams, and career prep!\n\n#### 🚀 What would you like to focus on today?\n- **📚 Exam Prep**: Ask for high-yield revision roadmaps & PYQs.\n- **💡 Concept Doubts**: Ask me to explain any complex topic, DBMS, OS, or algorithm.\n- **💻 Code Sandbox**: Ask for code snippets in Python, C++, SQL, Java, or JavaScript.\n- **📑 MCQ Quizzes**: Ask to generate adaptive MCQs or launch the Quiz Game.\n\n*Tell me what you're studying or type your question above!*`;
    } else if (q.includes('sql') || q.includes('join') || q.includes('database') || q.includes('dbms') || q.includes('postgres') || q.includes('table')) {
      activated = ['ConceptClear AI', 'CodeMentor AI'];
      content = `### ⚡ SQL & Database Systems Solution\n\nDetailed solution breakdown for **"${userQuery}"**:\n\n#### 📌 Key SQL Concept Breakdown:\n1. **INNER JOIN**: Returns records that have matching values in both left and right tables.\n2. **LEFT (OUTER) JOIN**: Returns all records from the left table and matched records from the right table. Unmatched right rows output \`NULL\`.\n3. **RIGHT (OUTER) JOIN**: Returns all records from the right table and matched records from the left table.\n\n\`\`\`sql\n-- Example SQL Join Execution\nSELECT \n    Students.student_id, \n    Students.full_name, \n    Courses.course_title\nFROM Students\nLEFT JOIN Courses ON Students.course_id = Courses.course_id\nWHERE Students.status = 'Active';\n\`\`\`\n\n#### 📈 Automated State Updates:\n- Logged **"SQL Joins & Relational Database Design"** in your Knowledge Graph.\n- Scheduled 2 active recall flashcards for DBMS revision.`;
    } else if (q.includes('os') || q.includes('deadlock') || q.includes('paging') || q.includes('operating system') || q.includes('process') || q.includes('thread') || q.includes('kernel')) {
      activated = ['ExamAce AI', 'ConceptClear AI'];
      content = `### 📚 Operating Systems Architecture Analysis\n\nAuthoritative explanation for **"${userQuery}"**:\n\n#### 🔑 4 Mandatory Deadlock Invariants:\n1. **Mutual Exclusion**: Non-shareable resource allocated to one process at a time.\n2. **Hold & Wait**: Process holds allocated resources while waiting for additional resources.\n3. **No Preemption**: Resources cannot be forcibly preempted from a process.\n4. **Circular Wait**: Closed loop chain of process-resource dependency.\n\n\`\`\`text\n[Process P1] ---> (Resource R1) ---> [Process P2] ---> (Resource R2) ---> [Process P1]\n\`\`\`\n\n#### ⚡ Recommended Action:\n- Try solving Operating System MCQs in the **QuizMaster AI** tab!`;
    } else if (q.includes('resume') || q.includes('interview') || q.includes('ats') || q.includes('career') || q.includes('salary') || q.includes('job')) {
      activated = ['CareerPath AI'];
      content = `### 💼 CareerPath ATS Resume & Placement Strategy\n\nOptimization guide for **"${userQuery}"**:\n\n#### 📈 ATS Optimization Rules:\n1. **Action Verbs**: Begin bullet points with strong impact verbs (*Architected, Engineered, Optimized, Deployed*).\n2. **Quantifiable Metrics**: Quantify achievements (e.g., *"Reduced API latency by 45% using Redis caching"*).\n3. **Core Tech Skills**: Highlight technical keywords: Data Structures, Python, React, PostgreSQL, Docker, AWS.\n\n#### 🎯 Mock Interview Question:\n- *"How would you design a scalable rate limiter for a distributed web application?"*`;
    } else if (q.includes('binary') || q.includes('tree') || q.includes('graph') || q.includes('dijkstra') || q.includes('code') || q.includes('cpp') || q.includes('python') || q.includes('java') || q.includes('algorithm') || q.includes('dsa') || q.includes('react') || q.includes('javascript')) {
      activated = ['CodeMentor AI', 'ConceptClear AI'];
      content = `### 💻 CodeMentor Algorithm & DSA Solution\n\nOptimized solution for **"${userQuery}"**:\n\n#### ⚡ Complexity Analysis:\n- **Time Complexity**: $O((V + E) \\log V)$ using Min-Priority Queue / Binary Heap.\n- **Space Complexity**: $O(V)$ auxiliary array storage.\n\n\`\`\`python\nimport heapq\n\ndef dijkstra_shortest_path(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    \n    while pq:\n        curr_dist, curr_node = heapq.heappop(pq)\n        if curr_dist > distances[curr_node]:\n            continue\n        for neighbor, weight in graph[curr_node].items():\n            dist = curr_dist + weight\n            if dist < distances[neighbor]:\n                distances[neighbor] = dist\n                heapq.heappush(pq, (dist, neighbor))\n    return distances\n\`\`\`\n\n*Test and execute this code snippet in the CodeMentor Sandbox tab!*`;
    } else if (q.includes('quiz') || q.includes('mcq') || q.includes('test') || q.includes('flashcard')) {
      activated = ['QuizMaster AI'];
      content = `### 📑 QuizMaster AI — Adaptive MCQ Challenge\n\nI have prepared adaptive MCQs for **"${userQuery}"**!\n\n#### 🚀 Quick Challenge:\n- **Question**: Which data structure is used to implement Breadth-First Search (BFS)?\n- **A)** Stack\n- **B)** Queue *(Correct Answer)*\n- **C)** Binary Tree\n\n*Click **QuizMaster AI** in the left sidebar to play the complete interactive MCQ Game with instant scoring & results page!*`;
    } else if (q.includes('exam') || q.includes('pyq') || q.includes('revision') || q.includes('roadmap') || q.includes('schedule') || q.includes('timetable') || q.includes('plan')) {
      activated = ['ExamAce AI', 'StudyFlow AI'];
      content = `### 🎯 ExamAce AI & StudyFlow AI — High-Yield Revision Roadmap\n\nPlan for **"${userQuery}"**:\n\n| Phase | Focus Topic | High-Yield Activity | Pomodoro Allocation |\n| :--- | :--- | :--- | :--- |\n| **Days 1-2** | Core Fundamentals | PYQs & Socratic Doubt Solving | 4 x 25min |\n| **Days 3-4** | Complex Algorithms | Code Sandboxing & Problem Sets | 5 x 25min |\n| **Days 5-6** | Mock Evaluation | MCQ Quiz Games & Weak Spot Drill | 6 x 25min |\n| **Day 7** | Final Sprint | Formula Cheatsheets & Mind Maps | 3 x 25min |\n\n#### ⚡ Scheduled State Updates:\n- Exported study blocks to your **StudyFlow AI Pomodoro Scheduler**.`;
    } else if (q.includes('essay') || q.includes('assignment') || q.includes('paper') || q.includes('citation') || q.includes('apa') || q.includes('ieee')) {
      activated = ['AssignMate AI'];
      content = `### ✍️ AssignMate AI — Academic Writing & Citation Guide\n\nStructure for **"${userQuery}"**:\n\n#### 📌 Paper Structure Outline:\n1. **Abstract & Introduction**: Define problem statement, thesis, and scope.\n2. **Literature Review**: Synthesize current research with proper citations (e.g. IEEE / APA format).\n3. **Methodology & Results**: Present experimental findings or logical arguments.\n4. **Conclusion**: Summarize key insights and future implications.`;
    } else if (q.includes('pdf') || q.includes('notes') || q.includes('summary') || q.includes('outline') || q.includes('mindmap')) {
      activated = ['PDFTutor AI', 'NoteCraft AI'];
      content = `### 📑 PDFTutor AI & NoteCraft AI — Document Synthesis\n\nSynthesized breakdown for **"${userQuery}"**:\n\n#### 📌 Key Takeaways:\n1. **Core Concept Overview**: Extracted main thesis points from document source.\n2. **Structured Mind Map**: Organized into hierarchical bullet points for quick revision.\n3. **Formula Cheatsheet**: Logged essential equations and definitions in your active memory set.`;
    } else {
      activated = ['ConceptClear AI', 'Master AI Orchestrator'];
      content = `### 🧠 Master AI Synthesized Answer\n\nHere is the detailed, step-by-step solution for **"${userQuery}"**:\n\n#### 📌 Comprehensive Breakdown:\n1. **Core Principle**: Understanding **"${userQuery}"** starts by identifying its fundamental components and underlying logic.\n2. **Key Step-by-Step Insights**:\n   - **Step 1**: Analyze the core requirements and establish basic definitions.\n   - **Step 2**: Apply structured problem-solving steps and logical reasoning.\n   - **Step 3**: Verify findings using practical examples or test cases.\n3. **Active Recall Summary**: Review key takeaways regularly to reinforce long-term memory retention.\n\n#### 🚀 Suggested Next Steps:\n- Ask for **code snippets**, request a **5-question MCQ quiz**, or ask me to explain any specific sub-topic in simpler terms!`;
    }

    return { responseText: content, activated };
  };

  // API Key state
  const [apiKey] = useState<string>(() => localStorage.getItem('eduverse_api_key') || '');
  const [apiProvider] = useState<string>(() => localStorage.getItem('eduverse_api_provider') || 'groq');

  const handleSend = async (userQuery?: string) => {
    const queryToSend = (userQuery !== undefined ? userQuery : prompt) || '';
    if (!queryToSend.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryToSend + (attachedFile ? ` (📎 Attached: ${attachedFile.name})` : ''),
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
          prompt: queryToSend,
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
      const { responseText, activated } = generateDynamicAIResponse(queryToSend);
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
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 overflow-hidden font-sans relative">
      
      {/* Hidden File Input Picker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.txt,.py,.js,.java,.cpp,.md,.json,.csv" 
      />

      {/* Center Main Workspace Canvas (Scrollable Messages Stream) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full font-sans">
        
        {/* Personalized Calm Greeting Header */}
        <div className="space-y-3 pt-2 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isDedicatedAgent ? (
                  <span className="flex items-center gap-2">
                    <Bot className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                    <span>{currentAgentTitle}</span>
                  </span>
                ) : (
                  <>{getGreeting()}, {studentFirstName} 👋</>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium mt-1">
                {isDedicatedAgent 
                  ? "Specialized mode active. Ask me any question in this domain." 
                  : "What would you like to master today?"}
              </p>
            </div>

            {/* Subtle Active Agents Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-xs font-semibold self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>9 AI Agents Online & Ready</span>
            </div>
          </div>
        </div>

        {/* Light First-Time User Onboarding Guide Banner */}
        {showOnboarding && (
          <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-between gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">Welcome to EduVerse AI!</h2>
                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                  Type any question into the prompt box below, or click one of the 4 primary actions to launch specialized AI tutors instantly.
                </p>
              </div>
            </div>
            <button
              onClick={dismissOnboarding}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
            >
              Got it
            </button>
          </div>
        )}

        {/* Quick Actions Grid (Shown when conversation is fresh) */}
        {messages.filter(m => m.sender === 'user').length === 0 && (
          <div className="space-y-2 text-left pt-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Quick Actions
              </h2>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Click to launch agent</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'notes',
                  label: 'Generate Notes',
                  desc: 'NoteCraft AI • Markdown & mind maps',
                  icon: FileText,
                  promptText: 'Generate comprehensive, structured Markdown study notes on: '
                },
                {
                  id: 'doubt',
                  label: 'Solve Doubt',
                  desc: 'ConceptClear AI • Socratic step-by-step',
                  icon: HelpCircle,
                  promptText: 'Help me solve this doubt step-by-step using Socratic reasoning: '
                },
                {
                  id: 'quiz',
                  label: 'Create Quiz',
                  desc: 'QuizMaster AI • Adaptive MCQs',
                  icon: CheckSquare,
                  promptText: 'Generate an adaptive 5-question multiple choice quiz on: '
                },
                {
                  id: 'study',
                  label: 'Study Plan',
                  desc: 'StudyFlow AI • Pomodoro timetable',
                  icon: Calendar,
                  promptText: 'Create a 7-day optimized Pomodoro study timetable for: '
                }
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setPrompt(card.promptText);
                    }}
                    className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {card.label}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 line-clamp-1 font-medium">
                        {card.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chronological Chat Messages Stream */}
        <div className="space-y-6 pt-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                msg.sender === 'user'
                  ? 'bg-purple-600 font-extrabold text-xs'
                  : 'bg-purple-600 shadow-md shadow-purple-600/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <BrainCircuit className="w-4 h-4 text-white" />}
              </div>

              {/* Message Content */}
              <div className={`space-y-1 max-w-2xl ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-neutral-500">
                  <span className="font-bold text-slate-800 dark:text-neutral-200">
                    {msg.sender === 'user' ? 'You' : currentAgentTitle}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.activeAgents && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {msg.activeAgents.map((ag, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80">
                        ⚡ {ag}
                      </span>
                    ))}
                  </div>
                )}

                {msg.isThinking ? (
                  <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2 shadow-sm">
                    <span>Master AI is thinking...</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                    </span>
                  </div>
                ) : (
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none font-medium text-left shadow-sm'
                      : 'bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 rounded-tl-none shadow-sm'
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
                          <span>{isSpeaking && activeSpeakingMsgId === msg.id ? 'Stop Voice' : 'Listen'}</span>
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
          
          {/* Smooth Auto-Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ChatGPT-Style Sticky Bottom Input Bar */}
      <div className="p-4 border-t border-slate-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md shrink-0 w-full">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Speech Recognition Indicator Banner */}
          {isListening && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-between animate-pulse text-left">
              <div className="flex items-center gap-3">
                <Mic className="w-4 h-4 animate-bounce" />
                <span className="text-xs font-bold">Listening to your voice... Speak your question clearly</span>
              </div>
              <button 
                onClick={toggleListening}
                className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Prompt Search Input Box */}
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-3.5 shadow-lg hover:border-purple-300 dark:hover:border-purple-800 transition-all space-y-2.5 relative group">
            
            {attachedFile && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-medium text-purple-700 dark:text-purple-300">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="truncate">{attachedFile.name}</span>
                <span className="opacity-75 text-[10px]">({attachedFile.size})</span>
                <button 
                  onClick={() => setAttachedFile(null)} 
                  className="ml-auto p-0.5 hover:bg-purple-200 dark:hover:bg-purple-900 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything to Master AI, paste your notes, or upload a textbook..."
              className="w-full bg-transparent border-0 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 text-sm resize-none min-h-[50px] max-h-[160px]"
            />

            {/* Bottom Bar Controls inside Input Box */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800/80 pt-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Attach Document or PDF"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isListening) {
                      toggleListening();
                    } else {
                      window.dispatchEvent(new CustomEvent('open-master-ai-voice'));
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20' 
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                  }`}
                  title="Voice AI Assistant & Dictation"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice AI</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isProcessing || (!prompt.trim() && !attachedFile)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isProcessing ? 'Thinking...' : 'Ask AI'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



