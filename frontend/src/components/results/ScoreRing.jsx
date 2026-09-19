import React from 'react';

export default function ScoreRing({ score, totalMarks }) {
  const safeTotal = totalMarks || 1;
  const percentage = Math.max(0, Math.min(100, Math.round((score / safeTotal) * 100)));

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div
        className="w-48 h-48 rounded-full flex items-center justify-center p-3 shadow-lg shadow-purple-500/10 transition-all duration-700 relative"
        style={{
          background: `conic-gradient(#6D4AFF 0%, #14B8A6 ${percentage}%, rgba(226, 232, 240, 0.4) ${percentage}% 100%)`
        }}
      >
        <div className="w-36 h-36 rounded-full bg-white dark:bg-slate-900 shadow-inner flex flex-col items-center justify-center text-center p-3 border border-slate-100 dark:border-slate-800">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {score}
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
            out of {totalMarks}
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-4 py-1.5 rounded-full border border-purple-200 dark:border-purple-800 shadow-xs">
          {percentage}% Score Efficiency
        </span>
      </div>
    </div>
  );
}
