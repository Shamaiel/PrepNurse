import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Play, BookOpen, Clock, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Award } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import PrepNurseLogo from '../../components/common/PrepNurseLogo';

export default function HomePage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/api/tests');
        setTests(res.tests || []);

        if (user) {
          const attRes = await api.get('/api/attempts/my').catch(() => ({ attempts: [] }));
          setRecentAttempts(attRes.attempts || []);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const featuredTest = tests.find(t => t.testId === 'norcet-mains-001') || tests[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>NORCET 11 Mains • All India Mock Series</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Master NORCET with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent">
            PrepNurse
          </span> Practice Platform
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          High-yield AIIMS simulation curated for nursing officers. Experience authentic 180-minute exam pressure, clinical rationales, and deep performance analytics.
        </p>

        {/* Feature Badges Line */}
        <div className="flex justify-center gap-2.5 flex-wrap pt-2">
          <span className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>AIIMS Single-Digit Rank Curated</span>
          </span>
          <span className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>180-Minute Countdown</span>
          </span>
          <span className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>+1 / -0.33 Negative Marking</span>
          </span>
        </div>
      </div>

      {/* Featured Test Hero Card */}
      {featuredTest && (
        <div className="bg-gradient-to-br from-navy-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-purple-500/20">
          {/* Subtle decorative glow circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-teal-400 text-white px-3 py-1 rounded-full shadow-xs">
                Featured Exam
              </span>
              <span className="text-xs text-purple-200">160 Clinical MCQs • Complete Syllabus</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
              {featuredTest.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {featuredTest.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-md border border-white/10">
                <b className="text-lg sm:text-2xl block font-bold">{featuredTest.totalQuestions || 160}</b>
                <span className="text-[11px] text-slate-300 uppercase tracking-wider">Questions</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-md border border-white/10">
                <b className="text-lg sm:text-2xl block font-bold">{featuredTest.durationMinutes || 180}</b>
                <span className="text-[11px] text-slate-300 uppercase tracking-wider">Minutes</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-md border border-white/10">
                <b className="text-lg sm:text-2xl block font-bold">+{featuredTest.marksPerCorrect} / -{featuredTest.negativeMarks}</b>
                <span className="text-[11px] text-slate-300 uppercase tracking-wider">Marking Scheme</span>
              </div>
            </div>

            {/* Quick Action CTA */}
            <div className="flex items-center gap-3.5 pt-3 flex-wrap">
              <Link
                to={`/test/${featuredTest.testId}/instructions?mode=mock`}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-purple-900/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Mock Test</span>
              </Link>
              <Link
                to={`/test/${featuredTest.testId}/instructions?mode=practice`}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-all border border-white/20 flex items-center gap-2 backdrop-blur-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Practice Mode (Untimed)</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dual Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mock Exam Mode */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
          <div className="space-y-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
              Mock Test Simulation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Simulate actual AIIMS NORCET conditions with a strictly timed 180-minute countdown, real negative marking (+1 / -0.33), question palette status tracking, and auto-submission.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Countdown timer with background epoch persistence</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Question palette with Mark for Review & Clear Response</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Full score ring and percentile insights on submit</span>
              </li>
            </ul>
          </div>
          {featuredTest && (
            <Link
              to={`/test/${featuredTest.testId}/instructions?mode=mock`}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm text-center block transition-all shadow-sm shadow-purple-500/20"
            >
              Enter Mock Test
            </Link>
          )}
        </div>

        {/* Practice Mode */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 hover:border-teal-300 dark:hover:border-teal-700 transition-all">
          <div className="space-y-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
              Practice & Study Mode
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Untimed question-by-question revision mode. Receive instant correct/incorrect visual feedback and thorough clinical rationales immediately after clicking an option.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Instant green/red answer highlighting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Comprehensive clinical explanations per MCQ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Stress-free self-paced learning without timer limits</span>
              </li>
            </ul>
          </div>
          {featuredTest && (
            <Link
              to={`/test/${featuredTest.testId}/instructions?mode=practice`}
              className="w-full py-3 px-4 rounded-xl border border-teal-500 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 font-semibold text-sm text-center block transition-all"
            >
              Enter Practice Mode
            </Link>
          )}
        </div>
      </div>

      {/* Recent Attempts (if any) */}
      {recentAttempts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Your Recent Attempts</h3>
            <Link to="/attempts" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
              <span>View All Attempts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentAttempts.slice(0, 4).map((att) => (
              <div key={att.attemptId} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{att.testTitle}</span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="capitalize">{att.mode === 'mock' ? 'Mock Test' : 'Practice'}</span> • {formatDate(att.submittedAt || att.startedAt)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">{att.score} Marks</span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{att.accuracy}% Accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
