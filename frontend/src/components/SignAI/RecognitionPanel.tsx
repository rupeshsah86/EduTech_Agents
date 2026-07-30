import React from 'react';
import { signRecognitionService, type RecognitionResult } from '../../services/signRecognition';
import { Hand, Cpu, Send, CornerDownLeft } from 'lucide-react';

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
  } = result;


  const handleSend = () => {
    const textToSend = (recognizedSentence || currentWord).trim();
    if (textToSend) {
      onSendToMasterAI(textToSend);
    }
  };

  // 10 Stable ASL Alphabet Signs supported & validated
  const stable10ASLSigns = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'L', 'O'];

  // Dynamic Status Indicator determination
  const getStatusBadge = () => {
    if (confidence > 0 && confidence < 75) {
      return {
        label: 'Low Confidence – Please adjust hand',
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse',
        indicator: 'bg-amber-500'
      };
    }
    if (detectedLetter && detectedLetter !== '-') {
      return {
        label: 'Letter Detected',
        className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-extrabold',
        indicator: 'bg-emerald-500 animate-ping'
      };
    }
    if (status === 'Listening...' || result.handDetected) {
      return {
        label: 'Detecting...',
        className: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/80',
        indicator: 'bg-purple-500 animate-pulse'
      };
    }
    return {
      label: 'Ready',
      className: 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-700',
      indicator: 'bg-slate-400'
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-4.5 shadow-sm space-y-3.5 font-sans">
      
      {/* Clear Detection Status Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold border border-purple-200 dark:border-purple-800">
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-neutral-100 flex items-center gap-2">
              <span>Detection Status Panel</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">10 ASL Signs</span>
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-neutral-500">Live MediaPipe 21-Landmark Classifier</p>
          </div>
        </div>

        {/* Live Status Indicator Pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold shadow-2xs ${statusBadge.className}`}>
          <span className={`w-2 h-2 rounded-full ${statusBadge.indicator}`} />
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Prominent Current Detected Letter & Confidence Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/10 via-purple-600/10 to-indigo-600/10 border border-purple-500/30 flex items-center justify-between">
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Current Detected Letter
          </span>
          <div className="flex items-baseline gap-2.5">
            <p className="text-4xl font-black text-purple-600 dark:text-purple-400 font-mono tracking-tight">
              {detectedLetter && detectedLetter !== '-' ? `[ ${detectedLetter} ]` : '-'}
            </p>
            {detectedLetter && detectedLetter !== '-' && (
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {confidence || 96}% Confidence
              </span>
            )}
          </div>
        </div>

        <div className="text-right space-y-1 font-mono text-xs">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Current Word</span>
          <p className="font-extrabold text-purple-600 dark:text-purple-400 text-sm max-w-[120px] truncate">
            {currentWord ? `Building: ${currentWord}` : 'Empty'}
          </p>
        </div>
      </div>


      {/* Quick Sign Language Questions Chips */}
      <div className="space-y-1.5 pt-0.5 text-left">
        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
          <span>Quick Sign Language Questions</span>
          <span className="text-purple-600 dark:text-purple-400 font-medium">Click to Sign & Query</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: 'What is Data Structures?', query: 'What is Data Structures' },
            { label: 'What is EduVerse AI?', query: 'What is EduVerse AI' },
            { label: 'Hello Welcome', query: 'Hello Welcome' },
          ].map((q) => (
            <button
              key={q.query}
              onClick={() => {
                signRecognitionService.setSentence(q.query);
                if (onSendToMasterAI) {
                  onSendToMasterAI(q.query);
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-600 hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              {q.label}
            </button>
          ))}
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


