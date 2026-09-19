import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import ScoreRing from '../../components/results/ScoreRing';
import ResultStatGrid from '../../components/results/ResultStatGrid';
import QuestionReviewCard from '../../components/results/QuestionReviewCard';
import { RotateCcw, BookOpen, Home, BarChart2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ResultsPage() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!attempt);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (attempt) return;

    async function loadAttempt() {
      try {
        setLoading(true);
        const res = await api.get(`/api/attempts/${attemptId}`);
        setAttempt(res.attempt);
      } catch (err) {
        setError(err.message || 'Failed to load test results.');
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [attemptId, attempt]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Evaluating your responses...</p>
        <span className="text-xs text-slate-500">Calculating NORCET negative marking & subject accuracy</span>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Results Not Available</h2>
        <p className="text-xs text-slate-500">{error || 'Could not find attempt details.'}</p>
        <Link to="/" className="py-2.5 px-5 rounded-xl bg-purple-600 text-white font-semibold text-xs inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  const reviewList = attempt.detailedReview || [];

  const filteredQuestions = reviewList.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'marked') return item.isMarked;
    return item.status === filter;
  });

  const filterButtons = [
    { key: 'all', label: `All (${reviewList.length})` },
    { key: 'wrong', label: `Incorrect (${attempt.wrong || 0})` },
    { key: 'correct', label: `Correct (${attempt.correct || 0})` },
    { key: 'unattempted', label: `Skipped (${attempt.unattempted || 0})` },
    { key: 'marked', label: `Marked (${reviewList.filter(q => q.isMarked).length})` }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Test Title & Status Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-200 dark:border-teal-800 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{attempt.mode === 'mock' ? 'Mock Test Completed' : 'Practice Session Finished'}</span>
        </div>
        <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          {attempt.testTitle || 'NORCET Mock Test'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {attempt.autoSubmitted ? 'Auto-submitted upon timer expiration' : 'Exam completed and evaluated successfully'}
        </p>
      </div>

      {/* Score Ring Display */}
      <ScoreRing
        score={attempt.score || 0}
        totalMarks={attempt.totalQuestions || reviewList.length}
      />

      {/* Result Stat Grid */}
      <ResultStatGrid
        correct={attempt.correct}
        wrong={attempt.wrong}
        unattempted={attempt.unattempted}
        accuracy={attempt.accuracy}
        timeTakenSec={attempt.timeTakenSec}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => navigate(`/test/${attempt.testId || 'norcet-mains-001'}/instructions?mode=mock`)}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-sm shadow-sm shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Mock Test</span>
        </button>

        {attempt.mode === 'mock' && (
          <button
            onClick={() => navigate(`/test/${attempt.testId || 'norcet-mains-001'}/instructions?mode=practice`)}
            className="flex-1 py-3 px-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Try Practice Mode</span>
          </button>
        )}

        <button
          onClick={() => navigate('/performance')}
          className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics Insights</span>
        </button>
      </div>

      {/* Question-Wise Review Section */}
      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-xl text-slate-900 dark:text-white">
            Question-by-Question Analysis
          </h2>
          <span className="text-xs text-slate-500">Click any card to expand full clinical explanation</span>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterButtons.map(fb => (
            <button
              key={fb.key}
              onClick={() => setFilter(fb.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                filter === fb.key
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              {fb.label}
            </button>
          ))}
        </div>

        {/* Question Cards List */}
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-sm">
            No questions match this filter.
          </div>
        ) : (
          <div>
            {filteredQuestions.map((q, idx) => (
              <QuestionReviewCard key={q.questionId || idx} item={q} index={q.index !== undefined ? q.index : idx} />
            ))}
          </div>
        )}
      </div>

      {/* Return to Home footer link */}
      <div className="text-center pt-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <Home className="w-4 h-4" />
          <span>Back to Home Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
