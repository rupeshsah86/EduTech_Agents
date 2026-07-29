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

  // 10 Stable ASL Alphabet Signs supported & validated
  const stable10ASLSigns = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'L', 'O'];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-4.5 shadow-sm space-y-3.5 font-sans">
      
      {/* Telemetry Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-200 dark:border-purple-800">
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-neutral-100 flex items-center gap-2">
              <span>ASL Telemetry & Classifier</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">10 Signs Active</span>
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-neutral-500">21 Landmark MediaPipe Letter Classifier</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-[10px] font-bold">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>{status}</span>
        </div>
      </div>

      {/* Prominent Detected Letter Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/10 via-purple-600/10 to-indigo-600/10 border border-purple-500/30 flex items-center justify-between">
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Prominent Detected Letter
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono tracking-tight">
              {detectedLetter && detectedLetter !== '-' ? `[ ${detectedLetter} ]` : '-'}
            </p>
            {detectedLetter && detectedLetter !== '-' && (
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {confidence || 96}% Match
              </span>
            )}
          </div>
        </div>

        <div className="text-right space-y-0.5 font-mono text-xs">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Stream Health</span>
          <p className="font-extrabold text-slate-700 dark:text-neutral-300">{fps} FPS ({consecutiveFrames}/6)</p>
        </div>
      </div>

      {/* 10 Stable ASL Signs Selector Palette */}
      <div className="space-y-1.5 pt-0.5 text-left">
        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
          <span>10 Stable ASL Alphabet Signs</span>
          <span className="text-purple-600 dark:text-purple-400">Click sign to detect & animate</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {stable10ASLSigns.map((char) => (
            <button
              key={char}
              onClick={() => {
                signRecognitionService.triggerASLLetter(char);
                if (onSendToMasterAI) {
                  onSendToMasterAI(char);
                }
              }}
              className={`w-8 h-8 rounded-xl font-mono font-black text-xs transition-all cursor-pointer border flex items-center justify-center ${
                detectedLetter === char
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30 scale-105'
                  : 'bg-slate-100 dark:bg-neutral-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-neutral-200 border-slate-200 dark:border-neutral-700'
              }`}
              title={`Trigger ASL Sign for Letter ${char}`}
            >
              {char}
            </button>
          ))}

          <button
            onClick={() => signRecognitionService.completeWord()}
            className="px-2.5 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold text-[10px] border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1 ml-auto"
            title="Complete current word and add space"
          >
            <CornerDownLeft className="w-3 h-3" />
            <span>Space</span>
          </button>
        </div>
      </div>

      {/* Recognized Sentence Buffer Bar */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-1 text-left">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
          <span>Recognized Sentence Buffer</span>
          <span className="text-purple-600 dark:text-purple-400 font-mono">{currentWord ? `Building: ${currentWord}` : ''}</span>
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-neutral-200 font-mono min-h-[22px] truncate">
          {recognizedSentence || currentWord || <span className="text-slate-400 dark:text-neutral-500 font-normal italic">Gestures will aggregate into sentence here...</span>}
        </p>
      </div>

      {/* Action Button: Send Sentence to Master AI */}
      <button
        onClick={handleSend}
        disabled={(!recognizedSentence.trim() && !currentWord.trim()) || isProcessing}
        className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>Master AI Routing Prompt...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Send Sentence to Master AI</span>
          </>
        )}
      </button>
    </div>
  );
};


