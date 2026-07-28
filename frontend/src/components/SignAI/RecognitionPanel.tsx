import React from 'react';
import type { RecognitionResult } from '../../services/signRecognition';
import { Hand, Cpu, Send, Activity, Zap } from 'lucide-react';

interface RecognitionPanelProps {
  result: RecognitionResult;
  onSendToMasterAI: (sentence: string) => void;
  isProcessing?: boolean;
}

export const RecognitionPanel: React.FC<RecognitionPanelProps> = ({
  result,
  onSendToMasterAI,
  isProcessing = false,
}) => {
  const { detectedSign, confidence, recognizedSentence, status } = result;

  const handleSend = () => {
    if (recognizedSentence.trim()) {
      onSendToMasterAI(recognizedSentence);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 h-full">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Hand className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">Live Sign Telemetry</h3>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500">Real-time Sign-to-Text classification</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-[11px] font-bold">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>{status}</span>
          </div>
        </div>

        {/* 1. Detected Sign */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
            Detected Sign
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black tracking-tight text-purple-600 dark:text-purple-400 font-mono">
              {detectedSign || 'Waiting for sign...'}
            </span>
            {detectedSign && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                Active Sign
              </span>
            )}
          </div>
        </div>

        {/* 2. Recognition Confidence */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-neutral-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Recognition Confidence
            </span>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-extrabold text-sm">
              {confidence}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* 3. Recognized Sentence Buffer */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
            Recognized Sentence
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed min-h-[48px] font-mono">
            {recognizedSentence || <span className="text-slate-400 dark:text-neutral-600 italic">Signed text accumulates here... (e.g. Explain Binary Search)</span>}
          </p>
        </div>
      </div>

      {/* Action Button: Send to Master AI */}
      <button
        onClick={handleSend}
        disabled={!recognizedSentence.trim() || isProcessing}
        className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Cpu className="w-4 h-4 animate-spin" />
            <span>Master AI Routing Prompt...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Sentence to Master AI</span>
          </>
        )}
      </button>
    </div>
  );
};
