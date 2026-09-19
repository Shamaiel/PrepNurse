import React from 'react';
import Modal from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

export default function SecurityWarningModal({ isOpen, onClose, tabSwitches = 1 }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Security Notice" maxWidth="max-w-md">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Window Switch Detected</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You navigated away from the active exam window. To replicate actual NORCET exam conditions, please keep this test screen focused.
          </p>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-semibold text-amber-800 dark:text-amber-300">
          Focus Loss Counter: <span className="text-base font-bold text-rose-600 dark:text-rose-400">{tabSwitches}</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-purple-500/20 transition-all"
        >
          Return to Exam Screen
        </button>
      </div>
    </Modal>
  );
}
