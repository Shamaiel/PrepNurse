import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Layers,
  FileQuestion,
  Users,
  CheckCircle,
  PlusCircle,
  Upload,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        const res = await api.get('/api/analytics/admin');
        setAnalytics(res);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminStats();
  }, []);

  const {
    totalTests = 0,
    publishedTests = 0,
    totalQuestions = 0,
    totalCandidates = 0,
    totalAttempts = 0,
    averageScore = 0,
    testStats = []
  } = analytics || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              PrepNurse Admin
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-bold tracking-wider">
              PORTAL
            </span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
            Exam Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure mock examinations, manage question banks, import JSON tests, and review aspirant metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/tests/create"
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Test</span>
          </Link>
          <Link
            to="/admin/questions/import"
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
          <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1.5" />
          <b className="text-2xl font-bold text-slate-900 dark:text-white block">{totalTests}</b>
          <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Tests</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
          <CheckCircle className="w-5 h-5 text-teal-500 mx-auto mb-1.5" />
          <b className="text-2xl font-bold text-teal-600 dark:text-teal-400 block">{publishedTests}</b>
          <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Published</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
          <FileQuestion className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
          <b className="text-2xl font-bold text-slate-900 dark:text-white block">{totalQuestions}</b>
          <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Questions</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
          <Users className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
          <b className="text-2xl font-bold text-slate-900 dark:text-white block">{totalCandidates}</b>
          <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Candidates</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
          <Award className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
          <b className="text-2xl font-bold text-slate-900 dark:text-white block">{totalAttempts}</b>
          <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Attempts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-center">
          <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
          <b className="text-2xl font-bold text-purple-600 dark:text-purple-400 block">{averageScore}</b>
          <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Score</span>
        </div>
      </div>

      {/* Fast Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/tests"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Manage Tests
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure parameters, toggle publication, or archive tests
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/questions"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Question Bank
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Filter by subject, edit options, update clinical explanations
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/questions/import"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Bulk Import Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Import 160+ question sets via JSON/CSV with live validation
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Tests Table Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Active Tests Summary</h2>
          <Link to="/admin/tests" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
            View All Tests
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Test Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Questions</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {testStats.map((t) => (
                <tr key={t.testId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{t.title}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase ${
                      t.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{t.totalQuestions}</td>
                  <td className="py-3.5 px-4 text-slate-500">{t.attemptsCount}</td>
                  <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">{t.averageScore}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/admin/tests/edit/${t.testId}`}
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/test/${t.testId}/instructions?mode=mock`}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Preview
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
