import React, { useState } from 'react';
import { Repeat, RotateCw } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  intervalDays: number;
}

export const SM2FlashcardViewer: React.FC = () => {
  const cards: Flashcard[] = [
    {
      id: '1',
      front: 'What is the worst-case time complexity of QuickSort?',
      back: 'O(N²) when the pivot chosen is consistently the smallest or largest element (e.g. already sorted array).',
      subject: 'DSA',
      intervalDays: 1,
    },
    {
      id: '2',
      front: 'Define Virtual Memory and Paging.',
      back: 'Virtual memory decouples physical memory from logical address space. Paging divides memory into fixed-size blocks called pages.',
      subject: 'Operating Systems',
      intervalDays: 3,
    },
    {
      id: '3',
      front: 'Explain ACID Properties in DBMS.',
      back: 'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions), Durability (persisted changes).',
      subject: 'DBMS',
      intervalDays: 5,
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const handleRating = (_multiplier: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 250);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Smart SM-2 Flashcard Revision Engine
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
          {cards.length} Cards Due Today
        </span>
      </div>

      {currentCard && (
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-[180px] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent flex flex-col justify-between cursor-pointer transition-all duration-300 relative group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-indigo-500">
              {currentCard.subject}
            </span>
            <span className="flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              Click to {isFlipped ? 'Show Front' : 'Reveal Answer'}
            </span>
          </div>

          <div className="my-4 text-center">
            {!isFlipped ? (
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {currentCard.front}
              </h4>
            ) : (
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300 leading-relaxed">
                {currentCard.back}
              </p>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400">
            Card {currentIndex + 1} of {cards.length} • Current Interval: {currentCard.intervalDays} days
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 pt-1">
        <button
          onClick={() => handleRating(1)}
          className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20 transition-all text-center"
        >
          🔴 Hard (1d)
        </button>
        <button
          onClick={() => handleRating(2.5)}
          className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20 transition-all text-center"
        >
          🟡 Good (3d)
        </button>
        <button
          onClick={() => handleRating(3.5)}
          className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20 transition-all text-center"
        >
          🟢 Easy (6d)
        </button>
      </div>
    </div>
  );
};
