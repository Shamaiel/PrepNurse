import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answers = {},
  marked = {},
  visited = {},
  questions = [],
  mode = 'mock',
  onSelectQuestion,
  isOpenMobile,
  onCloseMobile
}) {
  function getStatus(idx) {
    const isAns = answers[idx] !== undefined && answers[idx] !== null;
    const isMrk = Boolean(marked[idx]);
    const isVis = Boolean(visited[idx]);

    if (mode === 'practice' && isAns) {
      const q = questions[idx];
      if (q && q.correctAnswer !== undefined) {
        return answers[idx] === q.correctAnswer ? 'pcorrect' : 'pwrong';
      }
    }

    if (isAns && isMrk) return 'markedans';
    if (isMrk) return 'marked';
    if (isAns) return 'answered';
    if (isVis) return 'notanswered';
    return 'notvisited';
  }

  function getButtonStyles(status, isCurrent) {
    let base = 'aspect-square rounded-xl font-semibold text-xs flex items-center justify-center transition-all cursor-pointer select-none border ';

    if (isCurrent) {
      base += 'ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-slate-900 font-bold scale-105 z-10 shadow-sm ';
    }

    switch (status) {
      case 'answered':
        return base + 'bg-teal-500 border-teal-500 text-white hover:bg-teal-600 shadow-xs';
      case 'notanswered':
        return base + 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-100';
      case 'marked':
        return base + 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700 shadow-xs';
      case 'markedans':
        return base + 'bg-purple-600 border-purple-600 text-white ring-2 ring-teal-400 ring-inset hover:bg-purple-700 shadow-xs';
      case 'pcorrect':
        return base + 'bg-emerald-600 border-emerald-600 text-white';
      case 'pwrong':
        return base + 'bg-rose-600 border-rose-600 text-white';
      case 'notvisited':
      default:
        return base + 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:text-slate-200';
    }
  }

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Question Palette</h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{totalQuestions} Total Questions</span>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-teal-500 flex-shrink-0" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-100 dark:bg-rose-950 border border-rose-300 flex-shrink-0" />
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-600 flex-shrink-0" />
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700 border border-slate-300 flex-shrink-0" />
          <span>Not Visited</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[60vh] md:max-h-[500px]">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const status = getStatus(i);
          const isCurrent = i === currentIndex;
          return (
            <button
              key={i}
              onClick={() => {
                onSelectQuestion(i);
                if (onCloseMobile) onCloseMobile();
              }}
              className={getButtonStyles(status, isCurrent)}
              title={`Question ${i + 1} (${status})`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* WhatsApp Community CTA in palette */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs bg-slate-50/70 dark:bg-slate-850">
        <a
          href="https://chat.whatsapp.com/GCymmczgn6W1FBPhxc3cux?s=cl&p=a&mlu=4&ilr=4"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1 font-semibold text-[11.5px]"
        >
          <span>PrepNurse WhatsApp Community</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 lg:w-80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex-shrink-0 sticky top-20">
        {content}
      </div>

      {/* Mobile Bottom Sheet Overlay */}
      {isOpenMobile && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center animate-fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="w-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}
