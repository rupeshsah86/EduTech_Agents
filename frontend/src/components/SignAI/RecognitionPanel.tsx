import React from 'react';
import { signRecognitionService, type RecognitionResult } from '../../services/signRecognition';
import { Hand, Cpu, Send, Activity, CornerDownLeft } from 'lucide-react';

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
  const {
    detectedLetter,
    confidence,
    currentWord,
    recognizedSentence,
    status,
    consecutiveFrames,
    fps,
  } = result;


  const handleSend = () => {
    const textToSend = (recognizedSentence || currentWord).trim();
    if (textToSend) {
      onSendToMasterAI(textToSend);
    }
  };

  const testLetters = ['H', 'E', 'L', 'O', 'A', 'B', 'C', 'S'];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3 font-sans">

      
      {/* Telemetry Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-200 dark:border-purple-800">
            <Hand className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-neutral-100">
              ASL Telemetry & Classifier
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-neutral-500">21 Landmark MediaPipe Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-[10px] font-bold">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>{status}</span>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
          <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
            Detected
          </span>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
            {detectedLetter || '-'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 block">
            Confidence
          </span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            {confidence}%
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 block">
            Frame Lock
          </span>
          <p className="text-xs font-mono font-bold text-slate-700 dark:text-neutral-300 mt-1">
            {fps} FPS ({consecutiveFrames}/6)
          </p>
        </div>
      </div>

      {/* Word & Sentence Buffer Bar */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
          <span>Recognized Sentence Buffer</span>
          <span className="text-purple-600 dark:text-purple-400 font-mono">{currentWord ? `Word: ${currentWord}` : ''}</span>
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-neutral-200 font-mono min-h-[22px] truncate">
          {recognizedSentence || currentWord || <span className="text-slate-400 dark:text-neutral-500 font-normal italic">Gestures will aggregate into sentence here...</span>}
        </p>
      </div>

      {/* Quick ASL Letter Triggers & Send Button */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 flex-wrap">
          {testLetters.slice(0, 6).map((char) => (
            <button
              key={char}
              onClick={() => {
                signRecognitionService.triggerASLLetter(char);
                if (onSendToMasterAI) {
                  onSendToMasterAI(char);
                }
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-purple-600 hover:text-white font-mono font-extrabold text-[11px] text-slate-700 dark:text-neutral-300 transition-all cursor-pointer border border-slate-200 dark:border-neutral-700 active:scale-95"
            >
              {char}
            </button>
          ))}
          <button
            onClick={() => signRecognitionService.completeWord()}
            className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold text-[10px] border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1"
            title="Push word into sentence"
          >
            <CornerDownLeft className="w-2.5 h-2.5" />
            <span>Space</span>
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={(!recognizedSentence.trim() && !currentWord.trim()) || isProcessing}
          className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {isProcessing ? (
            <Cpu className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

