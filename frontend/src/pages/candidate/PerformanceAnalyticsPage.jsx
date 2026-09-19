import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BarChart2, Award, Target, TrendingUp } from 'lucide-react';

export default function PerformanceAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.get('/api/analytics/candidate');
        setData(res);
      } catch (err) {
        console.error('Failed to load candidate analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
        <span className="text-xs font-medium text-slate-500">Analyzing your clinical test metrics...</span>
      </div>
    );
  }

  const {
    totalAttempts = 0,
    averageScore = 0,
    bestScore = 0,
    averageAccuracy = 0,
    subjectPerformance = []
  } = data || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
          PrepNurse Insights
        </span>
        <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">Performance Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics of your nursing subject accuracy, average score, and preparation trends.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-center">
          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <b className="text-2xl font-bold text-purple-600 dark:text-purple-400 block">{bestScore}</b>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Best Score</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-center">
          <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
          <b className="text-2xl font-bold text-slate-900 dark:text-white block">{averageScore}</b>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Score</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-center">
          <Target className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
          <b className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block">{averageAccuracy}%</b>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Accuracy</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-center">
          <BarChart2 className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
          <b className="text-2xl font-bold text-slate-900 dark:text-white block">{totalAttempts}</b>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tests Taken</span>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            Subject-Wise Clinical Mastery
          </h2>
          <span className="text-xs text-slate-400">Based on submitted attempts</span>
        </div>

        {subjectPerformance.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            No subject data available yet. Complete a full mock test to generate comprehensive subject analytics!
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {subjectPerformance.map((subj) => {
              const accuracy = subj.accuracy || 0;
              let barColor = 'bg-rose-500';
              if (accuracy >= 75) barColor = 'bg-gradient-to-r from-teal-500 to-emerald-500';
              else if (accuracy >= 50) barColor = 'bg-gradient-to-r from-purple-500 to-indigo-500';

              return (
                <div key={subj.subject} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{subj.subject}</span>
                    <span className="font-bold font-mono text-purple-600 dark:text-purple-400">
                      {accuracy}% ({subj.correctQuestions}/{subj.totalQuestions})
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
