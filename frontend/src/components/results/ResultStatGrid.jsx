import React from 'react';
import { fmtTime } from '../../utils/formatters';
import { CheckCircle2, XCircle, MinusCircle, Target, Clock } from 'lucide-react';

export default function ResultStatGrid({ correct = 0, wrong = 0, unattempted = 0, accuracy = 0, timeTakenSec = 0 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
      <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 text-center shadow-xs">
        <div className="flex items-center justify-center text-emerald-500 mb-1.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <b className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block">{correct}</b>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Correct (+1)</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-4 text-center shadow-xs">
        <div className="flex items-center justify-center text-rose-500 mb-1.5">
          <XCircle className="w-5 h-5" />
        </div>
        <b className="text-2xl font-bold text-rose-600 dark:text-rose-400 block">{wrong}</b>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wrong (-0.33)</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center shadow-xs">
        <div className="flex items-center justify-center text-slate-400 mb-1.5">
          <MinusCircle className="w-5 h-5" />
        </div>
        <b className="text-2xl font-bold text-slate-700 dark:text-slate-300 block">{unattempted}</b>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skipped (0)</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/80 rounded-2xl p-4 text-center shadow-xs">
        <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1.5">
          <Target className="w-5 h-5" />
        </div>
        <b className="text-2xl font-bold text-purple-600 dark:text-purple-400 block">{accuracy}%</b>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accuracy</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center shadow-xs col-span-2 sm:col-span-1">
        <div className="flex items-center justify-center text-teal-600 dark:text-teal-400 mb-1.5">
          <Clock className="w-5 h-5" />
        </div>
        <b className="text-2xl font-bold text-slate-800 dark:text-slate-100 block">{fmtTime(timeTakenSec)}</b>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time Taken</span>
      </div>
    </div>
  );
}
