import React from 'react';
import { User, Sparkles, Volume2, Play, Bot } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  agentName?: string;
  timestamp: string;
  signSummary?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  onPlaySignAnimation?: (text: string) => void;
  onPlayVoice?: (text: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onPlaySignAnimation,
  onPlayVoice,
}) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'} my-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-600/20">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
        {/* Sender Header */}
        <div className={`flex items-center gap-2 text-[11px] font-bold ${isUser ? 'justify-end text-slate-500 dark:text-neutral-400' : 'text-purple-600 dark:text-purple-400'}`}>
          {!isUser && (
            <span className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full text-[10px]">
              <Bot className="w-3 h-3" />
              {message.agentName || 'Master AI'}
            </span>
          )}
          <span>{isUser ? 'You (Sign Input)' : ''}</span>
          <span className="text-[10px] text-slate-400 font-normal">{message.timestamp}</span>
        </div>

        {/* Message Content Bubble */}
        <div
          className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm transition-all ${
            isUser
              ? 'bg-purple-600 text-white rounded-tr-none'
              : 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-neutral-800 rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Action Controls for AI Messages */}
        {!isUser && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onPlaySignAnimation && onPlaySignAnimation(message.signSummary || message.text)}
              className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-bold text-[11px] flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Play Sign Animation</span>
            </button>

            <button
              onClick={() => onPlayVoice && onPlayVoice(message.text)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700 font-bold text-[11px] flex items-center gap-1.5 border border-slate-200 dark:border-neutral-800 transition-all cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>Speak Voice</span>
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-slate-700 dark:text-neutral-300 shrink-0 font-bold">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
