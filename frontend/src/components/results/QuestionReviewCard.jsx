import React, { useState } from 'react';
import { LETTERS } from '../../utils/formatters';
import { Check, X, Minus, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';

export default function QuestionReviewCard({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);

  const isCorrect = item.status === 'correct';
  const isWrong = item.status === 'wrong';
  const isSkipped = item.status === 'unattempted';

  let borderClass = 'border-l-4 border-l-slate-300 dark:border-l-slate-700';
  let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let icon = <Minus className="w-4 h-4 text-slate-400" />;

  if (isCorrect) {
    borderClass = 'border-l-4 border-l-emerald-500';
    badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    icon = <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
  } else if (isWrong) {
    borderClass = 'border-l-4 border-l-rose-500';
    badgeColor = 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    icon = <X className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
  }

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs mb-3.5 transition-all ${borderClass}`}>
      {/* Clickable Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
              Q{index + 1}
            </span>
            <span className={`text-[10.5px] font-bold uppercase px-2.5 py-0.5 rounded-full ${badgeColor}`}>
              {item.status}
            </span>
            {item.isMarked && (
              <span className="text-[10.5px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> Marked
              </span>
            )}
            {item.subject && (
              <span className="text-[10.5px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/50">
                {item.subject}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-850 dark:text-slate-150 line-clamp-2 leading-relaxed">
            {item.question}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 pt-1">
          <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {icon}
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 space-y-3.5 text-xs sm:text-sm animate-fade-in">
          {/* Full Question */}
          <div className="text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed font-medium pb-3 border-b border-slate-200/70 dark:border-slate-800">
            {item.question}
          </div>

          {/* Options Display */}
          <div className="space-y-2 pt-1">
            {item.options && item.options.map((optText, oi) => {
              const isUserChoice = item.userAnswer === oi;
              const isCorrectChoice = item.correctAnswer === oi;

              let rowClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400';
              if (isCorrectChoice) {
                rowClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-medium';
              } else if (isUserChoice && !isCorrect) {
                rowClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100 font-medium';
              }

              return (
                <div
                  key={oi}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm ${rowClass}`}
                >
                  <span className="w-6 h-6 rounded-lg border border-current flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {LETTERS[oi]}
                  </span>
                  <span className="flex-1 pt-0.5">{optText}</span>
                  {isCorrectChoice && <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wider">✓ Correct</span>}
                  {isUserChoice && !isCorrect && <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px] uppercase tracking-wider">✕ Your Choice</span>}
                </div>
              );
            })}
          </div>

          {/* Response Summary */}
          <div className="flex flex-wrap gap-4 pt-2 font-medium text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Your Response:</span>
              <span className={`font-semibold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : (isSkipped ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400')}`}>
                {item.userAnswer !== null && item.userAnswer !== undefined ? `${LETTERS[item.userAnswer]}. ${item.options[item.userAnswer]}` : 'Not Attempted'}
              </span>
            </div>
            {!isCorrect && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400">Correct Answer:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {LETTERS[item.correctAnswer]}. {item.options[item.correctAnswer]}
                </span>
              </div>
            )}
          </div>

          {/* Detailed Clinical Rationale */}
          {item.explanation && (
            <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 leading-relaxed text-xs sm:text-sm">
              <span className="text-purple-600 dark:text-purple-400 font-bold block mb-1">Clinical Rationale:</span>
              <div className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {item.explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
