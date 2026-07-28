import React from 'react';
import { Volume2, VolumeX, RotateCcw, Volume1 } from 'lucide-react';

interface VoiceControlsProps {
  isMuted: boolean;
  isSpeaking: boolean;
  onToggleMute: () => void;
  onReplay: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isMuted,
  isSpeaking,
  onToggleMute,
  onReplay,
}) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
      <button
        onClick={onToggleMute}
        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
          isMuted
            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
        }`}
        title={isMuted ? 'Unmute Voice Synthesis' : 'Mute Voice Synthesis'}
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
        <span>{isMuted ? 'Muted' : 'Voice Active'}</span>
      </button>

      <button
        onClick={onReplay}
        className="p-1.5 rounded-lg text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-all cursor-pointer"
        title="Replay Voice Speech"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {isSpeaking && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 animate-pulse ml-auto pr-2">
          <Volume1 className="w-3.5 h-3.5" />
          <span>Speaking...</span>
        </div>
      )}
    </div>
  );
};
