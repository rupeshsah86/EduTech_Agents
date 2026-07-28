import React, { useState } from 'react';
import { Bell, Sparkles, BookOpen, Repeat, Code2, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'quiz' | 'exam' | 'pdf' | 'code';
  read: boolean;
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'SM-2 Flashcards Due',
      message: '3 SM-2 spaced repetition flashcards are scheduled for review today.',
      time: '10m ago',
      type: 'quiz',
      read: false
    },
    {
      id: '2',
      title: 'PDFTutor Indexing Complete',
      message: 'Operating_Systems_Concepts_10th_Ed.pdf vector index is active.',
      time: '1h ago',
      type: 'pdf',
      read: false
    },
    {
      id: '3',
      title: 'CodeMentor Sandbox',
      message: 'Dijkstra shortest path algorithm complexity analysis calculated O((V+E) log V).',
      time: '2h ago',
      type: 'code',
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleRemove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 transition-all relative cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center border-2 border-white dark:border-neutral-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop click dismiss */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Popover Card */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xl z-50 overflow-hidden font-sans space-y-0 text-slate-900 dark:text-neutral-100">
            <div className="p-3.5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50 dark:bg-neutral-950">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[10px]">
                    {unreadCount} New
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-neutral-800">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-neutral-500">
                  No notifications yet!
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 flex items-start gap-3 transition-colors ${
                      !n.read ? 'bg-purple-500/5 dark:bg-purple-500/10' : 'hover:bg-slate-50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {n.type === 'quiz' && <Repeat className="w-4 h-4 text-emerald-500" />}
                      {n.type === 'pdf' && <BookOpen className="w-4 h-4 text-rose-500" />}
                      {n.type === 'code' && <Code2 className="w-4 h-4 text-purple-500" />}
                      {n.type === 'exam' && <Sparkles className="w-4 h-4 text-amber-500" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-neutral-100">{n.title}</span>
                        <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-snug">
                        {n.message}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(n.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
