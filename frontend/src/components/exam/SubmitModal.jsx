import React from 'react';
import Modal from '../common/Modal';

export default function SubmitModal({
  isOpen,
  onClose,
  onSubmitConfirm,
  summary = {},
  isSubmitting = false,
  mode = 'mock'
}) {
  const { total = 0, answered = 0, unattempted = 0, marked = 0 } = summary;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit ${mode === 'mock' ? 'Mock Examination' : 'Practice Session'}?`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Review your attempt summary before final submission. Once submitted, your score and detailed clinical rationales will be generated.
        </p>

        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 block">{answered}</span>
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">Answered</span>
          </div>

          <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 block">{unattempted}</span>
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">Unanswered</span>
          </div>

          <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 block">{marked}</span>
            <span className="text-xs font-semibold text-purple-800 dark:text-purple-300">Marked Review</span>
          </div>

          <div className="bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 block">{total}</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Questions</span>
          </div>
        </div>

        {unattempted > 0 && mode === 'mock' && (
          <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 leading-relaxed">
            ⚠️ You have <b>{unattempted} unattempted questions</b>. NORCET marking scheme: <b>+1</b> for correct, <b>-0.33</b> for incorrect, and <b>0</b> for unattempted.
          </div>
        )}

        <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Keep Testing
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmitConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-rose-500/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Evaluating...' : 'Yes, Submit Test'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
