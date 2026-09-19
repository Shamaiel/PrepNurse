import React from 'react';
import { LETTERS } from '../../utils/formatters';
import { Bookmark, BookmarkCheck, CheckCircle2, XCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isMarked,
  mode,
  onSelectOption,
  onClearResponse,
  onToggleMark,
  onPrev,
  onNext,
  onSaveAndNext
}) {
  if (!question) return null;

  const isPractice = mode === 'practice';
  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;
  const isLocked = isPractice && isAnswered;
  const isCorrectInPractice = isPractice && isAnswered && selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs">
      {/* Question Header Meta */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-bold text-xs tracking-wider text-purple-600 dark:text-purple-400 uppercase">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          {question.subject && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
              {question.subject}
            </span>
          )}
          {question.difficulty && (
            <span className={`text-[10.5px] px-2.5 py-0.5 rounded-full font-semibold ${
              question.difficulty === 'Hard'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                : question.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
            }`}>
              {question.difficulty}
            </span>
          )}
        </div>

        {/* Mark for Review Flag */}
        <button
          onClick={onToggleMark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isMarked
              ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300'
          }`}
        >
          {isMarked ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Marked for Review</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Mark for Review</span>
            </>
          )}
        </button>
      </div>

      {/* Question Text */}
      <div className="text-base sm:text-lg leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-line mb-6 font-medium">
        {question.question}
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((optionText, optIndex) => {
          const isSelected = selectedAnswer === optIndex;
          let btnClass = 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-slate-100/50';
          let badgeClass = 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';
          let indicatorIcon = null;

          if (isPractice && isLocked) {
            if (optIndex === question.correctAnswer) {
              btnClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/20';
              badgeClass = 'bg-emerald-600 text-white border-emerald-600';
              indicatorIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto flex-shrink-0" />;
            } else if (isSelected) {
              btnClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500/20';
              badgeClass = 'bg-rose-600 text-white border-rose-600';
              indicatorIcon = <XCircle className="w-5 h-5 text-rose-600 ml-auto flex-shrink-0" />;
            }
          } else if (isSelected) {
            btnClass = 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 text-purple-950 dark:text-purple-100 font-medium ring-2 ring-purple-500/20 shadow-xs';
            badgeClass = 'bg-gradient-to-r from-purple-600 to-teal-500 text-white border-transparent';
          }

          return (
            <button
              key={optIndex}
              disabled={isLocked}
              onClick={() => onSelectOption(optIndex)}
              className={`w-full flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all text-sm sm:text-base leading-snug ${btnClass} ${isLocked ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'}`}
            >
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border shadow-xs ${badgeClass}`}>
                {LETTERS[optIndex]}
              </span>
              <span className="flex-1 pt-0.5">{optionText}</span>
              {indicatorIcon}
            </button>
          );
        })}
      </div>

      {/* Practice Mode Instant Rationale Box */}
      {isPractice && isLocked && (
        <div className={`mt-6 p-4 sm:p-5 rounded-2xl border ${
          isCorrectInPractice
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm mb-2">
            {isCorrectInPractice ? (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Correct Answer! Great Job!
              </span>
            ) : (
              <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-5 h-5" /> Incorrect Response
              </span>
            )}
          </div>
          {!isCorrectInPractice && (
            <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Correct Answer: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{LETTERS[question.correctAnswer]}. {question.options[question.correctAnswer]}</span>
            </div>
          )}
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-200/70 dark:border-slate-800 pt-3 mt-2">
            <span className="font-bold text-purple-700 dark:text-purple-400 block mb-1">Clinical Rationale:</span>
            {question.explanation}
          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between gap-2 mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex-wrap">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2.5">
          {mode === 'mock' && isAnswered && (
            <button
              onClick={onClearResponse}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={onSaveAndNext}
            className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm shadow-purple-500/20 hover:shadow-purple-500/30 active:scale-95 transition-all"
          >
            <span>{currentIndex === totalQuestions - 1 ? 'Review Summary' : 'Save & Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
