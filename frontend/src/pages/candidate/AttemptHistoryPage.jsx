import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { History, ArrowRight, Eye } from 'lucide-react';

export default function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.get('/api/attempts/my');
        setAttempts(res.attempts || []);
      } catch (err) {
        console.error('Failed to load attempts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
          PrepNurse Record
        </span>
        <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">Attempt History</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your past NORCET test attempts, score efficiency, and detailed clinical question rationales.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <span className="text-xs font-medium text-slate-500">Loading your attempt logs...</span>
        </div>
      ) : attempts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-800">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Test Attempts Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You haven't completed any mock tests yet. Take your first test to evaluate your preparation against actual NORCET standards!
          </p>
          <Link
            to="/tests"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <span>Explore Mock Tests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
          {attempts.map((att) => (
            <div key={att.attemptId} className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex-wrap sm:flex-nowrap">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-base text-slate-900 dark:text-white">
                    {att.testTitle}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                    att.mode === 'mock'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      : 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                  }`}>
                    {att.mode === 'mock' ? 'Mock Exam' : 'Practice'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                  <span>{formatDate(att.submittedAt || att.startedAt)}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{att.correct || 0} Correct</span>
                  <span>•</span>
                  <span className="text-rose-600 font-medium">{att.wrong || 0} Wrong</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0">
                <div className="text-right">
                  <span className="font-bold text-lg text-purple-600 dark:text-purple-400 block">
                    {att.score} Marks
                  </span>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 block">
                    {att.accuracy}% Accuracy
                  </span>
                </div>

                <Link
                  to={`/results/${att.attemptId}`}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-400 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
