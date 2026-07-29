import React from 'react';
import { signRecognitionService, type RecognitionResult } from '../../services/signRecognition';
import { Hand, Cpu, Send, Activity, Zap, Video, Gauge, CornerDownLeft } from 'lucide-react';

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
    expectedLetter,
    confidence,
    currentAnimation,
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
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 h-full">
      <div className="space-y-4">
        {/* Debug Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Hand className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100 flex items-center gap-2">
                <span>ASL Sign Telemetry & Debug Panel</span>
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500">21 Landmark MediaPipe Letter Classifier</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-[11px] font-bold">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>{status}</span>
          </div>
        </div>

        {/* Live Debug Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* 1. Detected Letter */}
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Detected Letter
            </span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {detectedLetter || '-'}
            </p>
          </div>

          {/* 2. Expected Letter */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
              Expected Letter
            </span>
            <p className="text-2xl font-black text-slate-800 dark:text-neutral-200 font-mono">
              {expectedLetter || '-'}
            </p>
          </div>

          {/* 3. Current Animation */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500 flex items-center gap-1">
              <Video className="w-3 h-3 text-indigo-500" /> Clip
            </span>
            <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate">
              {currentAnimation || 'Idle.anim'}
            </p>
          </div>

          {/* 4. Live FPS & Frames */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-500" /> Frame Lock
            </span>
            <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {fps} FPS ({consecutiveFrames}/6)
            </p>
          </div>
        </div>

        {/* 5. Recognition Confidence (>90% threshold) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-neutral-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Landmark Confidence
            </span>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-extrabold text-xs">
              {confidence}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                confidence >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* ASL Letter Input Test Controls */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
            <span>Test ASL Letter Input</span>
            <span>Click letter to trigger</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {testLetters.map((char) => (
              <button
                key={char}
                onClick={() => signRecognitionService.triggerASLLetter(char)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-purple-600 hover:text-white font-mono font-extrabold text-xs text-slate-700 dark:text-neutral-300 transition-all cursor-pointer border border-slate-200 dark:border-neutral-700 active:scale-95"
              >
                {char}
              </button>
            ))}
            <button
              onClick={() => signRecognitionService.completeWord()}
              className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 font-extrabold text-[10px] transition-all cursor-pointer border border-purple-500/20 flex items-center gap-1"
              title="Push current word into sentence buffer"
            >
              <CornerDownLeft className="w-3 h-3" />
              <span>Space / Word</span>
            </button>
          </div>
        </div>

        {/* 6. Current Word Buffer */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
            Current Word Building
          </span>
          <p className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono min-h-[20px]">
            {currentWord || <span className="text-slate-400 dark:text-neutral-600 font-normal italic">Letters combine into word...</span>}
          </p>
        </div>

        {/* 7. Full Sentence Buffer */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
            Full Recognized Sentence
          </span>
          <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200 leading-relaxed min-h-[30px] font-mono">
            {recognizedSentence || <span className="text-slate-400 dark:text-neutral-600 italic">Signed text accumulates here...</span>}
          </p>
        </div>
      </div>

      {/* Action Button: Send to Master AI */}
      <button
        onClick={handleSend}
        disabled={(!recognizedSentence.trim() && !currentWord.trim()) || isProcessing}
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
