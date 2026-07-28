import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Send, 
  BrainCircuit, 
  Plus, 
  Paperclip, 
  Code, 
  Mic, 
  FileText, 
  HelpCircle, 
  CheckSquare, 
  Calendar,
  User,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import robotAvatar from '../../assets/robot_avatar.png';

interface ChatMessage {
  id: string;
  sender: 'user' | 'master_ai';
  text: string;
  timestamp: string;
  isThinking?: boolean;
}

export const MasterAIChat: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const studentFirstName = user?.fullName ? user.fullName.split(' ')[0] : 'Student';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'master_ai',
      text: "Hello! I orchestrate 9 specialized AI agents to help you master any subject.\n\nAsk me anything — from building an exam roadmap to debugging code or parsing PDFs. I've got you covered! 🚀",
      timestamp: '10:00 AM'
    },
    {
      id: '2',
      sender: 'user',
      text: 'Explain binary search with example and code in C++',
      timestamp: '10:01 AM'
    },
    {
      id: '3',
      sender: 'master_ai',
      text: 'Thinking...',
      timestamp: '10:01 AM',
      isThinking: true
    }
  ]);

  const presetActions = [
    { label: 'Generate Notes', icon: FileText, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40', query: 'Generate comprehensive notes for my upcoming Computer Science exams.' },
    { label: 'Solve Doubts', icon: HelpCircle, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40', query: 'I have a doubt regarding Dijkstra algorithm time complexity analysis.' },
    { label: 'Create Quiz', icon: CheckSquare, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40', query: 'Create a 5-question adaptive quiz on Operating Systems memory paging.' },
    { label: 'Study Plan', icon: Calendar, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40', query: 'Build a 14-day structured revision schedule for Data Structures.' },
  ];

  const handleSend = (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    setIsProcessing(true);

    setTimeout(() => {
      const responseMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        sender: 'master_ai',
        text: `### Master AI Assistant Response\n\nHere is a complete explanation for **"${userQuery}"**:\n\n#### 📌 Binary Search Logic:\nBinary Search operates on a **sorted array** by repeatedly dividing the search interval in half. Time complexity is **O(log N)**.\n\n\`\`\`cpp\n// C++ Binary Search Implementation\n#include <iostream>\nusing namespace std;\n\nint binarySearch(int arr[], int size, int target) {\n    int left = 0, right = size - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\`\`\``,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev.filter(m => !m.isThinking), responseMsg]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 overflow-hidden font-sans relative">
      
      {/* Center Main Workspace Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Top Greeting Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-purple-500/10 border border-purple-200/80 dark:border-purple-900/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
          
          <div className="space-y-4 max-w-lg z-10">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight flex items-center gap-2">
                Good morning, {studentFirstName}! 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed font-medium">
                I'm your Master AI Assistant.<br />
                How can I help you learn smarter today?
              </p>
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
                    {msg.sender === 'user' ? 'User' : 'Master AI'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Question Input Card Container */}
        <div className="space-y-2 pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(prompt);
            }}
            className="rounded-3xl border border-purple-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900 shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all space-y-3"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              rows={2}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none resize-none"
            />

            {/* Input Toolbar */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800/80 pt-3">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button 
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-400 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>

                <button 
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-400 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
              </div>

              {/* Right Send & Voice Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!prompt.trim() || isProcessing}
                  className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center font-medium">
            Master AI may make mistakes. Please verify important information.
          </p>
        </div>

      </div>

      {/* Right Collapsible Panel Toggle */}
      <div className="border-l border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center p-2">
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-purple-600 transition-colors flex flex-col items-center gap-2 cursor-pointer text-[10px] font-bold"
          title="Toggle Right Panel"
        >
          {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          <span className="writing-mode-vertical uppercase tracking-wider text-[9px] text-slate-400 hidden sm:inline">
            Open panel
          </span>
        </button>
      </div>

    </div>
  );
};
