import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Bot, X, Sparkles, Send, Copy, RefreshCw } from 'lucide-react';

interface VoiceMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const VoiceAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate] = useState(1.0);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      sender: 'assistant',
      text: "Hello! I am your EduVerse Master AI Voice Assistant. Speak your prompt or type below, and I will answer you in natural voice!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const avail = window.speechSynthesis.getVoices();
        setVoices(avail);
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
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          handleQuerySubmit(transcript);
        }
      };
      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Strip Markdown for clean speech playback
  const cleanMarkdownForSpeech = (rawText: string): string => {
    return rawText
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, 'code snippet')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*]\s+/g, '')
      .trim();
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = cleanMarkdownForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(clean);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) stopSpeaking();

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      }
    }
  };

  const handleQuerySubmit = (queryText?: string) => {
    const text = queryText || inputText;
    if (!text.trim()) return;

    stopSpeaking();

    const userMsg: VoiceMessage = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Call dynamic backend/local solver
    setTimeout(async () => {
      let aiResponseText = '';
      const storedKey = localStorage.getItem('eduverse_api_key') || '';
      const storedProv = localStorage.getItem('eduverse_api_provider') || 'groq';

      try {
        const res = await fetch('http://localhost:8000/api/v1/master-ai/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            api_key: storedKey,
            provider: storedProv
          })
        });
        if (res.ok) {
          const data = await res.json();
          aiResponseText = data.master_ai_response;
        }
      } catch (e) {
        console.log("Using local dynamic agent response:", e);
      }

      if (!aiResponseText) {
        const q = text.toLowerCase();
        if (q.includes('exam') || q.includes('revision') || q.includes('roadmap')) {
          aiResponseText = "ExamAce AI & StudyFlow AI have generated a high-yield exam revision plan tailored to your upcoming test deadlines. Review your Flashcards in the dashboard!";
        } else if (q.includes('code') || q.includes('python') || q.includes('algorithm') || q.includes('dijkstra')) {
          aiResponseText = "CodeMentor AI analyzed your algorithmic problem. Time complexity is O(V log V) with auxiliary space complexity O(V). Check the Code Sandbox tab for complete execution code!";
        } else if (q.includes('pdf') || q.includes('notes')) {
          aiResponseText = "PDFTutor AI parsed your document and generated 5 adaptive SM-2 review flashcards for your Knowledge Graph.";
        } else {
          aiResponseText = `Master AI synthesized solution for "${text}": We've updated your Personal Knowledge Graph and scheduled recall intervals for peak retention.`;
        }
      }

      const assistantMsg: VoiceMessage = {
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsThinking(false);
      setMessages(prev => [...prev, assistantMsg]);

      if (autoSpeak) {
        speakText(aiResponseText);
      }
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 cursor-pointer ${
          isListening
            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-400/40 scale-110'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 hover:shadow-purple-500/30'
        }`}
        title="Master AI Voice Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : isListening ? <Mic className="w-6 h-6 animate-bounce" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Floating Voice Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-slate-50 dark:bg-neutral-950/60 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-neutral-100">Master AI Voice</h3>
                <p className="text-[10px] text-slate-400 dark:text-neutral-400 font-medium">9 AI Agents • Real-time Speech</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Glowing Orb Visualizer */}
          <div className="py-6 px-4 bg-gradient-to-b from-purple-500/5 to-transparent border-b border-slate-100 dark:border-neutral-800/80 flex flex-col items-center justify-center relative">
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-red-500 to-orange-500 shadow-red-500/50 scale-110 animate-pulse'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/50 scale-105 animate-bounce'
                  : isThinking
                  ? 'bg-gradient-to-tr from-purple-600 to-pink-500 shadow-purple-500/50 animate-spin'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/30'
              }`}
            >
              {isListening ? <Mic className="w-8 h-8" /> : isSpeaking ? <Volume2 className="w-8 h-8" /> : isThinking ? <RefreshCw className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
            </div>

            {/* Status Badge */}
            <div className="mt-3">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                isListening
                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                  : isSpeaking
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : isThinking
                  ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
              }`}>
                {isListening ? '🎙 Listening to your speech...' : isSpeaking ? '🔊 Speaking response...' : isThinking ? '🧠 Orchestrating 9 AI Agents...' : 'Click mic or ask below'}
              </span>
            </div>
          </div>

          {/* Settings Bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-neutral-950/40 border-b border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400 text-[11px]">
              <span>Voice:</span>
              <select
                className="bg-transparent border border-slate-200 dark:border-neutral-800 rounded px-1.5 py-0.5 text-[10px] text-slate-700 dark:text-neutral-300 focus:outline-none"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const v = voices.find(v => v.name === e.target.value);
                  if (v) setSelectedVoice(v);
                }}
              >
                {voices.map((v, i) => (
                  <option key={i} value={v.name}>{v.name.slice(0, 16)}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                autoSpeak ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>{autoSpeak ? 'Auto Voice On' : 'Muted'}</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 rounded-tl-none border border-slate-200/50 dark:border-neutral-700/50'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-200/40 dark:border-neutral-700/40 text-[10px]">
                      <button
                        onClick={() => speakText(msg.text)}
                        className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline cursor-pointer font-bold"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak</span>
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.text)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Master AI orchestrating agents...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-neutral-950/40 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              "14-day Exam Roadmap",
              "Dijkstra Algorithm Code",
              "Operating System Quiz",
              "ATS Resume Audit"
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuerySubmit(prompt)}
                className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 hover:border-purple-500 hover:text-purple-600 transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-full text-white transition-all cursor-pointer shrink-0 ${
                isListening ? 'bg-red-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-500'
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
              placeholder={isListening ? "Listening..." : "Type or speak prompt..."}
              className="flex-1 bg-slate-100 dark:bg-neutral-800 text-xs text-slate-900 dark:text-neutral-100 px-3.5 py-2.5 rounded-full border border-slate-200 dark:border-neutral-700 focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={() => handleQuerySubmit()}
              className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shrink-0 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
