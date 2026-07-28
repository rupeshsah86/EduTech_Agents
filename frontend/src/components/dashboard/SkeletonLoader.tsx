import React from 'react';

export const ChatSkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4 max-w-4xl w-full animate-skeleton font-sans">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-neutral-800 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-slate-200 dark:bg-neutral-800 rounded-md" />
          <div className="h-16 w-full max-w-xl bg-slate-200 dark:bg-neutral-800 rounded-2xl" />
        </div>
      </div>
      
      <div className="flex items-start gap-3 flex-row-reverse">
        <div className="w-8 h-8 rounded-xl bg-purple-200 dark:bg-purple-900/40 shrink-0" />
        <div className="space-y-2 flex-1 text-right">
          <div className="h-4 w-24 bg-slate-200 dark:bg-neutral-800 rounded-md ml-auto" />
          <div className="h-12 w-3/4 bg-purple-100 dark:bg-purple-950/40 rounded-2xl ml-auto border border-purple-200 dark:border-purple-800" />
        </div>
      </div>
    </div>
  );
};

export const CardSkeletonLoader: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-4 animate-skeleton">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-neutral-800" />
        <div className="w-16 h-4 bg-slate-200 dark:bg-neutral-800 rounded-md" />
      </div>
      <div className="h-5 w-3/4 bg-slate-200 dark:bg-neutral-800 rounded-md" />
      <div className="h-4 w-full bg-slate-200 dark:bg-neutral-800 rounded-md" />
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-neutral-800 rounded-md" />
    </div>
  );
};
