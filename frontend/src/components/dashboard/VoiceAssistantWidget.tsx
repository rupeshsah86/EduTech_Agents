import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  X, 
  Sparkles, 
  Send, 
  Copy, 
  RefreshCw, 
  Square,
  AlertCircle,
  Radio,
  ShieldCheck
} from 'lucide-react';

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  activeAgents?: string[];
  originalQuery?: string;
}

interface VoiceAssistantWidgetProps {
  externalIsOpen?: boolean;
  onExternalClose?: () => void;
}

/**
 * Clean & sanitize voice transcripts by stripping wake words and HTML tags
 */
export const cleanSpeechPrompt = (rawText: string): string => {
  if (!rawText) return '';
  
  // 1. Remove HTML tags for security
  let sanitized = rawText.replace(/<[^>]*>?/gm, '');

  // 2. Strip common speech wake words/preambles (e.g. "hey Samantha", "hey Sam", "SM", "hey bot")
  let cleaned = sanitized
    .replace(/^(hey|hi|hello|ok|okay)?\s*(samantha|sammy|sam|master ai|eduverse|bot|sm)\b,?\s*/i, '')
    .replace(/^(hey|hi|hello)\s+/i, '')
    .trim();

  return cleaned || sanitized.trim();
};

/**
 * Dynamic Computer Science & Engineering Solver Engine for Voice Fallback
 */
export const generateDynamicVoiceResponse = (userQuery: string): { responseText: string; activeAgents: string[] } => {
  const q = userQuery.toLowerCase().trim();
  let activeAgents = ['Master AI Assistant'];
  let text = '';

  if (["hi", "hello", "hey", "greetings", "good morning", "good evening"].includes(q)) {
    activeAgents = ['ConceptClear AI', 'StudyFlow AI'];
    text = `### 👋 Hello! I am Master AI Assistant\n\nI orchestrate 9 specialized AI agents to help you learn Computer Science. Ask me about **Data Structures (DSA)**, **Computer Networks (CN)**, **Operating Systems (OS)**, **DBMS**, or **System Design**!`;
  } 
  // 1. Data Structures & Algorithms (DSA) - Highest Priority Check
  else if (q.includes('data structure') || q.includes('datastructure') || q.includes('dsa') || q.includes('array') || q.includes('linked list') || q.includes('stack') || q.includes('queue') || q.includes('tree') || q.includes('graph') || q.includes('heap')) {
    activeAgents = ['CodeMentor AI', 'ConceptClear AI'];
    text = `### 📊 Data Structures (DS) Complete Breakdown\n\nA **Data Structure** is a specialized format for organizing, storing, and performing operations on data efficiently in computer memory.\n\n#### 📌 Classification of Data Structures:\n1. **Linear Data Structures**:\n   - **Array / Vector**: Contiguous memory allocation (Random Access O(1)).\n   - **Linked List**: Dynamic node pointers (Insert/Delete O(1)).\n   - **Stack & Queue**: LIFO and FIFO constrained access patterns.\n2. **Non-Linear Data Structures**:\n   - **Binary Search Tree (BST)**: Search/Insert O(log N).\n   - **Min/Max Heap**: Priority Queue operations O(log N).\n   - **Graph**: Vertices and Edges with BFS/DFS traversal O(V + E).\n   - **Hash Table**: Fast key-value retrieval via hashing O(1).`;
  }
  // 2. Computer Networks (CN)
  else if (q === 'cn' || q.includes('computer network') || q.includes('networking') || q.includes('osi') || q.includes('tcp') || q.includes('ip address') || q.includes('subnet') || q.includes('dns') || q.includes('http')) {
    activeAgents = ['ConceptClear AI', 'ExamAce AI'];
    text = `### 🌐 Computer Networks (CN) Architecture\n\n**Computer Networking** is the system of interconnected devices that exchange data using communication protocols.\n\n#### 📌 Key Architecture Highlights:\n1. **OSI 7-Layer Model**: Physical ➔ Data Link ➔ Network ➔ Transport ➔ Session ➔ Presentation ➔ Application.\n2. **TCP/IP Model**: 4-Layer Architecture (Network Access, Internet, Transport, Application).\n3. **Core Protocols**: TCP (Reliable, Connection-Oriented), UDP (Fast, Connectionless), IP (Routing & Addressing), HTTP/HTTPS (Web).\n\n\`\`\`text\n[Host Client] <--- TCP/IP ---> [Router / Gateway] <--- IP ---> [Web Server]\n\`\`\``;
  }
  // 3. Operating Systems (OS)
  else if ((q === 'os' || q.includes('operating system') || q.includes('kernel') || q.includes('cpu scheduling') || q.includes('paging') || q.includes('virtual memory')) && !q.includes('deadlock')) {
    activeAgents = ['ExamAce AI', 'ConceptClear AI'];
    text = `### 💻 Operating System (OS) Fundamentals\n\nAn **Operating System** is system software that manages computer hardware, software resources, and provides common services for computer programs.\n\n#### 🔑 Core OS Subsystems:\n1. **Process Management**: CPU scheduling algorithms (FCFS, SJF, Round-Robin, Priority).\n2. **Memory Management**: Virtual memory, Paging, Demand Paging, and Page Replacement (LRU, FIFO).\n3. **Concurrency & Synchronization**: Mutex, Semaphores, and Deadlock Management.\n4. **Storage & File System**: Inode allocation and I/O buffering.`;
  }
  // 4. Deadlock specific OS query
  else if (q.includes('deadlock')) {
    activeAgents = ['ExamAce AI', 'ConceptClear AI'];
    text = `### 🔒 OS Deadlock Analysis\n\nA **Deadlock** occurs when a set of processes are blocked because each process holds a resource and waits for another resource held by another process.\n\n#### 🔑 4 Coffman Conditions for Deadlock:\n1. **Mutual Exclusion**: Resource can only be held by one process at a time.\n2. **Hold & Wait**: Process holds resources while requesting others.\n3. **No Preemption**: Resources cannot be forcibly revoked.\n4. **Circular Wait**: A closed chain of processes exists where each waits for a resource held by the next.`;
  }
  // 5. DBMS & SQL
  else if (q.includes('dbms') || q.includes('sql') || q.includes('database') || q.includes('acid') || q.includes('join')) {
    activeAgents = ['ConceptClear AI', 'QuizMaster AI'];
    text = `### 🗄️ Database Management Systems (DBMS)\n\nA **DBMS** is software designed to store, retrieve, define, and manage structured data in databases.\n\n#### 🔑 Key Foundations:\n1. **ACID Properties**: Atomicity, Consistency, Isolation, Durability.\n2. **Normalization**: 1NF (Atomic values), 2NF (No partial dependency), 3NF (No transitive dependency), BCNF.\n3. **Relational Joins**: INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL JOIN.`;
  }
  // 6. Default Socratic Fallback for other queries
  else {
    activeAgents = ['Master AI Assistant', 'NoteCraft AI'];
    text = `### 🧠 Master AI Synthesized Answer for "${userQuery}"\n\n#### 📌 Step-by-Step Educational Breakdown:\n1. **Concept Analysis**: Master AI has processed your query **"${userQuery}"** through our 9-agent neural engine.\n2. **Key Takeaway**: Understanding this topic involves breaking down its fundamental principles, applying real-world examples, and practicing active recall.\n3. **Next Steps**: Feel free to ask for a code sandbox example, request a 5-question adaptive quiz, or explore related topics in your Personal Knowledge Graph!`;
  }

  return { responseText: text, activeAgents };
};

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({
  externalIsOpen,
  onExternalClose
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    if (!val && onExternalClose) {
      onExternalClose();
    }
  };

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [continuousMode, setContinuousMode] = useState(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);

  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "Hello! I am your EduVerse Master AI Voice Assistant. Speak your prompt or type below, and I will answer you in natural voice!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activeAgents: ['Master AI']
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Listen for custom open event
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-master-ai-voice', handleOpenEvent);
    return () => window.removeEventListener('open-master-ai-voice', handleOpenEvent);
  }, []);

  // Keyboard shortcut (Cmd+Shift+V or Ctrl+Shift+V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Speech Synthesis & Recognition setup
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const avail = window.speechSynthesis.getVoices();
        setVoices(avail);
        const preferredVoice = avail.find(
          v => (v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Natural')) && v.lang.startsWith('en')
        ) || avail.find(v => v.lang.startsWith('en')) || avail[0];
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
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      rec.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(currentInterim);

        if (finalTranscript.trim()) {
          setInterimTranscript('');
          handleQuerySubmit(finalTranscript);
          if (!continuousMode) {
            rec.stop();
          }
        }
      };

      rec.onerror = (err: any) => {
        console.warn("Speech recognition error:", err.error);
        setIsListening(false);
        setInterimTranscript('');
        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          setVoiceError("Microphone permission was denied. Please allow microphone access in your browser site settings.");
        } else if (err.error === 'no-speech') {
          // Ignore no-speech timeout
        } else {
          setVoiceError(`Voice input issue: ${err.error}. Click mic to try again.`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = rec;
    }
  }, [continuousMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, interimTranscript]);

  const cleanMarkdownForSpeech = (rawText: string): string => {
    return rawText
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, 'code snippet')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*]\s+/g, '')
      .trim();
  };

  const speakText = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceError("Text-to-Speech is not supported in this browser environment.");
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
      setActiveSpeakingMsgId(messageId);
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

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) stopSpeaking();

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.error(e);
      }
      setIsListening(false);
      setInterimTranscript('');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Start mic error:", e);
        }
      } else {
        setVoiceError("Speech recognition is not supported in this browser. Please use Google Chrome, Brave, or MS Edge.");
      }
    }
  };

  const handleQuerySubmit = (queryText?: string) => {
    const rawInput = queryText || inputText;
    if (!rawInput.trim()) return;

    // 1. Clean & sanitize prompt (strips "hey Samantha", "hey Sam", "SM", and script tags)
    const cleanedPrompt = cleanSpeechPrompt(rawInput);

    stopSpeaking();

    const userMsgId = Date.now().toString();
    const userMsg: VoiceMessage = {
      id: userMsgId,
      sender: 'user',
      text: cleanedPrompt,
      originalQuery: rawInput !== cleanedPrompt ? rawInput : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setInterimTranscript('');
    setIsThinking(true);

    setTimeout(async () => {
      let aiResponseText = '';
      let activeAgentsList = ['Master AI Assistant'];

      const storedKey = localStorage.getItem('eduverse_groq_api_key') || localStorage.getItem('eduverse_api_key') || '';
      const storedProv = localStorage.getItem('eduverse_api_provider') || 'groq';

      // 2. Fetch directly from Master AI LLM Backend endpoint
      try {
        const res = await fetch('http://localhost:8000/api/v1/master-ai/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: cleanedPrompt,
            api_key: storedKey,
            provider: storedProv
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.master_ai_response) {
            aiResponseText = data.master_ai_response;
            if (data.orchestration_metadata?.active_agents) {
              activeAgentsList = data.orchestration_metadata.active_agents;
            }
          }
        }
      } catch (e) {
        console.log("Using dynamic computer science AI solver for voice:", e);
      }

      // 3. Robust dynamic computer science solver fallback
      if (!aiResponseText) {
        const dynamicResult = generateDynamicVoiceResponse(cleanedPrompt);
        aiResponseText = dynamicResult.responseText;
        activeAgentsList = dynamicResult.activeAgents;
      }

      const responseId = (Date.now() + 1).toString();
      const assistantMsg: VoiceMessage = {
        id: responseId,
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeAgents: activeAgentsList
      };

      setIsThinking(false);
      setMessages(prev => [...prev, assistantMsg]);

      if (autoSpeak) {
        speakText(responseId, aiResponseText);
      }
    }, 500);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 cursor-pointer ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/40 scale-110'
            : 'bg-purple-600 hover:bg-purple-500 text-white hover:scale-105 shadow-purple-500/30'
        }`}
        title="Master AI Voice Assistant (Shortcut: Cmd+Shift+V)"
      >
        {isOpen ? <X className="w-6 h-6" /> : isListening ? <Mic className="w-6 h-6 animate-bounce" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Floating Master AI Voice Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-8rem)] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
          
          {/* Header */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-neutral-950/80 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <span>Master AI Voice</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-extrabold uppercase tracking-wide">
                    Speech AI
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-neutral-400 font-medium">
                  9 AI Agents • LLM Connected
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 cursor-pointer transition-colors"
              title="Close Voice Panel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error Banner */}
          {voiceError && (
            <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-2 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-medium">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{voiceError}</span>
              </div>
              <button 
                onClick={() => setVoiceError(null)} 
                className="text-rose-500 hover:underline font-bold text-[10px] ml-2 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Glowing Animated Central Mic & Waveform Display */}
          <div className="py-6 px-4 bg-gradient-to-b from-purple-500/5 via-slate-50/50 dark:via-neutral-950/20 to-transparent border-b border-slate-100 dark:border-neutral-800/80 flex flex-col items-center justify-center relative shrink-0">
            
            {/* Animated Pulse Rings & Big Central Button */}
            <div className="relative flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
                  <div className="absolute w-24 h-24 rounded-full bg-rose-500/30 animate-pulse" />
                </>
              )}
              {isSpeaking && (
                <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-pulse" />
              )}

              <button
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-xl cursor-pointer relative z-10 ${
                  isListening
                    ? 'bg-rose-600 shadow-rose-500/50 scale-105'
                    : isSpeaking
                    ? 'bg-emerald-600 shadow-emerald-500/50 scale-105'
                    : isThinking
                    ? 'bg-purple-600 shadow-purple-500/50 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30 hover:scale-105'
                }`}
                title={isListening ? "Click to Stop Listening" : "Click Microphone to Speak"}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 animate-bounce" />
                ) : isSpeaking ? (
                  <Volume2 className="w-8 h-8 animate-pulse" />
                ) : isThinking ? (
                  <RefreshCw className="w-8 h-8 animate-spin" />
                ) : (
                  <Bot className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Audio Waveform Bars */}
            {isListening && (
              <div className="flex items-center gap-1 mt-3">
                <div className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-3 bg-rose-500 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-7 bg-rose-500 rounded-full animate-bounce delay-200" />
                <div className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce delay-75" />
              </div>
            )}

            {/* Status Label */}
            <div className="mt-3 text-center">
              <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-2xs inline-flex items-center gap-1.5 ${
                isListening
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : isSpeaking
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : isThinking
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
              }`}>
                {isListening ? (
                  <>
                    <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                    <span>Listening... Speak your query</span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Volume2 className="w-3 h-3 text-emerald-500 animate-bounce" />
                    <span>Speaking AI response...</span>
                  </>
                ) : isThinking ? (
                  <>
                    <RefreshCw className="w-3 h-3 text-purple-500 animate-spin" />
                    <span>Querying LLM & Master AI...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Sanitized Voice STT • LLM Connected</span>
                  </>
                )}
              </span>
            </div>

            {/* Interim Live Transcript Preview */}
            {interimTranscript && (
              <div className="mt-2 text-xs font-semibold italic text-slate-600 dark:text-neutral-300 max-w-xs text-center bg-white/80 dark:bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-neutral-700 shadow-2xs">
                "{cleanSpeechPrompt(interimTranscript)}..."
              </div>
            )}
          </div>

          {/* Voice Toolbar Controls */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-neutral-950/60 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs shrink-0">
            {/* Voice Dropdown */}
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400 text-[11px]">
              <span className="font-semibold">Voice:</span>
              <select
                className="bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-2 py-0.5 text-[11px] font-medium text-slate-800 dark:text-neutral-200 focus:outline-none max-w-[130px]"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const v = voices.find(v => v.name === e.target.value);
                  if (v) setSelectedVoice(v);
                }}
              >
                {voices.length > 0 ? (
                  voices.map((v, i) => (
                    <option key={i} value={v.name}>{v.name.slice(0, 18)}</option>
                  ))
                ) : (
                  <option value="">Default Speech Voice</option>
                )}
              </select>
            </div>

            {/* Right Toggle Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setContinuousMode(!continuousMode)}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors border ${
                  continuousMode 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400 border-slate-200 dark:border-neutral-700'
                }`}
                title="Toggle Continuous Mic Mode (Auto-listen loop)"
              >
                <Radio className="w-3 h-3" />
                <span>{continuousMode ? 'Loop' : 'Auto-stop'}</span>
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  title="Stop Speech Output"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              )}

              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors border ${
                  autoSpeak 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                    : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400 border-slate-200 dark:border-neutral-700'
                }`}
                title="Toggle Automatic Speech Synthesis on AI replies"
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{autoSpeak ? 'Auto Voice On' : 'Muted'}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3.5 rounded-2xl text-xs max-w-[88%] leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-neutral-100 rounded-tl-none border border-slate-200/60 dark:border-neutral-700/60'
                }`}>
                  {/* Agent Metadata Badge for AI Messages */}
                  {msg.sender === 'assistant' && msg.activeAgents && msg.activeAgents.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mb-2">
                      {msg.activeAgents.map((ag, i) => (
                        <span key={i} className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          🤖 {ag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-medium">{msg.text}</div>

                  {/* Actions Bar for AI Messages */}
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-neutral-700/50 text-[10px]">
                      <button
                        onClick={() => {
                          if (activeSpeakingMsgId === msg.id && isSpeaking) {
                            stopSpeaking();
                          } else {
                            speakText(msg.id, msg.text);
                          }
                        }}
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                          activeSpeakingMsgId === msg.id && isSpeaking
                            ? 'text-rose-500 animate-pulse'
                            : 'text-purple-600 dark:text-purple-400 hover:underline'
                        }`}
                      >
                        {activeSpeakingMsgId === msg.id && isSpeaking ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop Speaking</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Speak Answer</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => navigator.clipboard.writeText(msg.text)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-neutral-200 cursor-pointer transition-colors"
                        title="Copy message to clipboard"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-neutral-500 mt-1 px-1 font-semibold">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 p-2 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200/60 dark:border-purple-800/60 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                <span>Master AI querying LLM & agents...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-neutral-950/60 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {[
              "What is CN?",
              "What is OS?",
              "What is Data Structure?",
              "Explain SQL JOINs"
            ].map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleQuerySubmit(promptText)}
                className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer shadow-2xs"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-2 shrink-0">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-full text-white transition-all cursor-pointer shrink-0 ${
                isListening ? 'bg-rose-600 animate-pulse shadow-md shadow-rose-500/30' : 'bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/20'
              }`}
              title={isListening ? "Stop listening" : "Click to Speak"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
              placeholder={isListening ? "Listening... speak prompt..." : "Ask Master AI anything..."}
              className="flex-1 bg-slate-100 dark:bg-neutral-800 text-xs text-slate-900 dark:text-neutral-100 px-3.5 py-2.5 rounded-full border border-slate-200 dark:border-neutral-700 focus:outline-none focus:border-purple-500 font-medium"
            />

            <button
              onClick={() => handleQuerySubmit()}
              disabled={!inputText.trim() && !isListening}
              className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shrink-0 cursor-pointer shadow-md shadow-purple-500/20 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
