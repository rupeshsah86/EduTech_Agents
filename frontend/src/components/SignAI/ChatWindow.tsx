import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble, type ChatMessage } from './MessageBubble';
import { VoiceControls } from './VoiceControls';
import { Send, Keyboard, Mic, Hand, Sparkles, MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onPlaySignAnimation: (text: string) => void;
  onPlayVoice: (text: string) => void;
  isMuted: boolean;
  isSpeaking: boolean;
  onToggleMute: () => void;
  onReplayVoice: () => void;
  recognizedSentenceBuffer?: string;
  isRecognizing?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  onPlaySignAnimation,
  onPlayVoice,
  isMuted,
  isSpeaking,
  onToggleMute,
  onReplayVoice,
  recognizedSentenceBuffer = '',
  isRecognizing = false,
}) => {
  const [inputTab, setInputTab] = useState<'keyboard' | 'mic' | 'sign'>('sign');
  const [textInput, setTextInput] = useState<string>('');
  const [isMicListening, setIsMicListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onSendMessage(textInput.trim());
      setTextInput('');
    }
  };

  const handleMicToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is supported in Chrome, Edge, and modern browsers.');
      return;
    }
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isMicListening) {
      setIsMicListening(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
        setIsMicListening(false);
      };
      recognition.onerror = () => {
        setIsMicListening(false);
      };
      recognition.onend = () => {
        setIsMicListening(false);
      };
    } else {
      setIsMicListening(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/20">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">Sign Language AI Chat</h3>
            <p className="text-[10px] text-slate-400 dark:text-neutral-500">Multi-modal AI conversation workspace</p>
          </div>
        </div>

        {/* Integrated Voice Controls Toolbar */}
        <VoiceControls
          isMuted={isMuted}
          isSpeaking={isSpeaking}
          onToggleMute={onToggleMute}
          onReplay={onReplayVoice}
        />
      </div>

      {/* Messages Stream Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/30 dark:bg-neutral-950/30 min-h-[300px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <h4 className="font-bold text-slate-700 dark:text-neutral-300 text-sm">Start Sign Language Conversation</h4>
            <p className="text-xs max-w-sm">Sign in front of camera or type your question below. Master AI will route your prompt to the specialized AI agent!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onPlaySignAnimation={onPlaySignAnimation}
              onPlayVoice={onPlayVoice}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Multi-Input Tab Switcher & Form */}
      <div className="p-3 border-t border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
        {/* Input Method Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-950 p-1 rounded-xl border border-slate-200 dark:border-neutral-800 w-fit">
          <button
            onClick={() => setInputTab('sign')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputTab === 'sign'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-purple-600'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Sign Language</span>
          </button>

          <button
            onClick={() => setInputTab('keyboard')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputTab === 'keyboard'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-purple-600'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard</span>
          </button>

          <button
            onClick={() => setInputTab('mic')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              inputTab === 'mic'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-purple-600'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Microphone</span>
          </button>
        </div>

        {/* Input Form based on Active Tab */}
        {inputTab === 'sign' && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <Hand className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="flex-1 font-mono text-xs text-slate-800 dark:text-neutral-200 truncate">
              {recognizedSentenceBuffer || (
                <span className="text-slate-400 dark:text-neutral-500 italic">
                  {isRecognizing ? 'Listening to webcam gestures...' : 'Click Start Recognition on webcam to sign.'}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                if (recognizedSentenceBuffer) {
                  onSendMessage(recognizedSentenceBuffer);
                }
              }}
              disabled={!recognizedSentenceBuffer.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Signed Query</span>
            </button>
          </div>
        )}

        {inputTab === 'keyboard' && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your question for Master AI..."
              className="flex-1 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500 font-medium"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        )}

        {inputTab === 'mic' && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-neutral-300">
              <Mic className={`w-4 h-4 ${isMicListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
              <span>{isMicListening ? 'Listening to speech...' : 'Click mic button to speak query'}</span>
            </div>
            <button
              onClick={handleMicToggle}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                isMicListening ? 'bg-red-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isMicListening ? 'Stop Listening' : 'Start Speech Input'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
