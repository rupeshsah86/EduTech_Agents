import React, { useState } from 'react';
import { Repeat, RotateCw, HelpCircle, Brain } from 'lucide-react';

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
      back: 'O(N²) — Occurs when the pivot chosen is consistently the smallest or largest element (e.g., on an already sorted array).',
      subject: 'DSA & Algorithms',
      intervalDays: 1,
    },
    {
      id: '2',
      front: 'Define Virtual Memory and Paging in Operating Systems.',
      back: 'Virtual memory decouples physical RAM from logical address space. Paging divides virtual memory into fixed-size blocks called pages to eliminate external fragmentation.',
      subject: 'Operating Systems',
      intervalDays: 3,
    },
    {
      id: '3',
      front: 'Explain ACID Properties in DBMS Transactions.',
      back: 'Atomicity (all or nothing), Consistency (valid invariants), Isolation (concurrency control), Durability (persisted commit logs).',
      subject: 'DBMS & Databases',
      intervalDays: 5,
    },
    {
      id: '4',
      front: 'What is Dijkstra\'s algorithm time complexity using a Min-Heap?',
      back: 'O((V + E) log V) — Extracting min vertex takes O(log V) time, done for all V vertices and E edges.',
      subject: 'Graph Theory',
      intervalDays: 7,
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentCard = cards[currentIndex];

  const handleRating = (_multiplier: number) => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 200);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-4 shadow-sm text-left">
      
      {/* Header with SM-2 Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                SuperMemo-2 (SM-2) Spaced Repetition Engine
              </h3>
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                title="Click to learn how SM-2 Memory Spacing works"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
              Schedules flashcard reviews right before your brain forgets to maximize long-term retention.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit shrink-0">
          {cards.length} Flashcards Due Today
        </span>
      </div>

      {/* SM-2 Explanation Banner (Expandable) */}
      {showExplanation && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-extrabold">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>How the SM-2 Spaced Repetition Algorithm Works:</span>
          </div>
          <p className="text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
            1. **Read Question**: Test your active recall memory before flipping.<br />
            2. **Flip & Review**: Check if your recalled answer matches.<br />
            3. **Rate Recall**: Choose **Hard (1d)**, **Good (3d)**, or **Easy (6d)**. Harder items reappear sooner, while easy items space out up to 30 days!
          </p>
        </div>
      )}

      {/* Interactive 3D Flashcard Container */}
      {currentCard && (
        <div className="space-y-3">
          
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[200px] p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative group cursor-pointer flex flex-col justify-between ${
              isFlipped
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                : 'bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-800'
            }`}
          >
            {/* Card Header Tag */}
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                isFlipped ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
              }`}>
                {currentCard.subject}
              </span>

              <span className={`flex items-center gap-1.5 font-bold text-xs ${
                isFlipped ? 'text-purple-100' : 'text-slate-500 dark:text-neutral-400'
              }`}>
                <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                <span>{isFlipped ? 'Click to Show Question' : 'Click Card to Reveal Answer'}</span>
              </span>
            </div>

            {/* Main Question / Answer Body */}
            <div className="my-6 text-center">
              {!isFlipped ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-neutral-500 block">
                    Active Recall Question
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                    "{currentCard.front}"
                  </h4>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-200 block">
                    Verified Correct Answer
                  </span>
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              )}
            </div>

            {/* Card Footer Progress */}
            <div className={`text-center text-[11px] font-medium flex items-center justify-between border-t pt-3 ${
              isFlipped ? 'border-purple-400/30 text-purple-100' : 'border-slate-200/60 dark:border-neutral-800 text-slate-400'
            }`}>
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span className="font-mono font-bold">Current Interval: {currentCard.intervalDays} Days</span>
            </div>
          </div>

          {/* Action Rating Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-wider block">
              Step 2: Rate how easily you recalled the answer (Determines next review date):
            </span>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleRating(1)}
                className="py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-extrabold text-xs border border-rose-200 dark:border-rose-800 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>🔴 Hard (Review in 1 Day)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRating(2.5)}
                className="py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-extrabold text-xs border border-amber-200 dark:border-amber-800 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>🟡 Good (Review in 3 Days)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRating(3.5)}
                className="py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-800 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>🟢 Easy (Review in 6 Days)</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
