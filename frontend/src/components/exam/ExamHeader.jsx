import React from 'react';
import ExamTimer from './ExamTimer';
import PrepNurseIcon from '../common/PrepNurseIcon';
import { Maximize, Minimize, Home } from 'lucide-react';

export default function ExamHeader({
  testTitle,
  mode,
  currentIndex,
  totalQuestions,
  remainingSeconds,
  onExpire,
  onTick,
  onSubmitClick,
  onLeaveClick,
  isFullscreen,
  toggleFullscreen
}) {
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Info & Leave */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onLeaveClick}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Exit Exam / Return Home"
          >
            <Home className="w-4 h-4" />
          </button>
          
          <div className="hidden sm:block">
            <PrepNurseIcon size={30} className="w-7 h-7" />
          </div>

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-xs md:max-w-md">
              {testTitle}
            </h2>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
                mode === 'mock' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' 
                  : 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
              }`}>
                {mode === 'mock' ? 'MOCK EXAM' : 'PRACTICE MODE'}
              </span>
              <span>•</span>
              <span className="font-medium">Q {currentIndex + 1} of {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Right: Timer & Submit Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {mode === 'mock' && (
            <ExamTimer
              remainingSeconds={remainingSeconds}
              onExpire={onExpire}
              onTick={onTick}
            />
          )}

          {/* Fullscreen Button */}
          {toggleFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Exam Mode'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onSubmitClick}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm ${
              mode === 'mock'
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
            }`}
          >
            {mode === 'mock' ? 'Submit Test' : 'Finish Session'}
          </button>
        </div>
      </div>

      {/* Dynamic Purple-to-Teal Progress Bar */}
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-teal-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
