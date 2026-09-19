import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Clock, BookOpen, CheckCircle2, Play, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function TestInstructionsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'mock';
  const [mode, setMode] = useState(initialMode);

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTest() {
      try {
        const res = await api.get(`/api/tests/${id}`);
        setTest(res.test);
      } catch (err) {
        setError(err.message || 'Failed to load test details.');
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [id]);

  const handleStartExam = () => {
    navigate(`/exam/${test.testId || id}?mode=${mode}`);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
        <span className="text-xs font-medium text-slate-500">Preparing examination instructions...</span>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-rose-600 font-semibold">{error || 'Test not found.'}</p>
        <Link to="/tests" className="inline-flex items-center gap-1.5 text-sm text-purple-600 dark:text-purple-400 font-semibold underline">
          <ArrowLeft className="w-4 h-4" /> Back to Tests
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Back link */}
      <Link to="/tests" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tests</span>
      </Link>

      {/* Main Instructions Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
              {test.exam || 'NORCET'} • {test.category || 'Mains'}
            </span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
            {test.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {test.description}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setMode('mock')}
            className={`py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'mock'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Mock Exam (Timed)</span>
          </button>

          <button
            onClick={() => setMode('practice')}
            className={`py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'practice'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Practice Mode (Untimed)</span>
          </button>
        </div>

        {/* Marking & Rules Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-700 text-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white block">{test.totalQuestions || 160}</span>
            <span className="text-[10.5px] text-slate-500 uppercase font-semibold">Total MCQs</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-700 text-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white block">{mode === 'mock' ? `${test.durationMinutes || 180} Mins` : 'Unlimited'}</span>
            <span className="text-[10.5px] text-slate-500 uppercase font-semibold">Duration</span>
          </div>
          <div className="bg-teal-50 dark:bg-teal-950/30 p-3.5 rounded-2xl border border-teal-200 dark:border-teal-800 text-center">
            <span className="text-xl font-bold text-teal-600 dark:text-teal-400 block">+{test.marksPerCorrect}</span>
            <span className="text-[10.5px] text-teal-800 dark:text-teal-300 uppercase font-semibold">Correct Answer</span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/30 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-800 text-center">
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400 block">-{test.negativeMarks}</span>
            <span className="text-[10.5px] text-rose-800 dark:text-rose-300 uppercase font-semibold">Negative Mark</span>
          </div>
        </div>

        {/* Important Guidelines List */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Examination Guidelines & PrepNurse Protocol:
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>
                <b>Epoch Timer Resilience:</b> The countdown timer syncs with real-world time. Even if you accidentally refresh or close the tab, your remaining time is tracked accurately.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>
                <b>Continuous State Persistence:</b> Your selected choices, visited states, and marked-for-review tags are saved immediately.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>
                <b>Question Palette:</b> Use the quick palette to review your unattempted count and jump across subjects without friction.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>
                <b>Exam Security:</b> Minimize switching between browser tabs during active mock test mode to ensure an accurate simulation of computer-based tests.
              </span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleStartExam}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-base shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>I Understand — Begin {mode === 'mock' ? 'Mock Examination' : 'Practice Session'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
