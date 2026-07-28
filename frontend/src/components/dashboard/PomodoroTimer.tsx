import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((sec) => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      if (mode === 'focus') {
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        setMode('focus');
        setSecondsLeft(25 * 60);
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            StudyFlow AI Pomodoro Planner
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
          mode === 'focus' 
            ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' 
            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
        }`}>
          {mode} Session
        </span>
      </div>

      <div className="text-center my-4">
        <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
          {formatTime(secondsLeft)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {mode === 'focus' ? '🎯 Stay focused on current learning topic' : '☕ Take a 5-minute break'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleTimer}
          className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause Session' : 'Start Focus Timer'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
