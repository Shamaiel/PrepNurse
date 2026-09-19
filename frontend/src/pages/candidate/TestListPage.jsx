import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { BookOpen, Clock, Award, Play, Search, Sparkles } from 'lucide-react';

export default function TestListPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await api.get('/api/tests');
        setTests(res.tests || []);
      } catch (err) {
        console.error('Error fetching tests:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || t.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            PrepNurse Exam Library
          </span>
        </div>
        <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">Available NORCET Mock Tests</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select any mock test to simulate high-stakes AIIMS exam conditions or practice question-by-question with instant rationales.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams, topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm shadow-xs transition-all"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Mains', 'Prelims', 'Topic-wise'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Test Cards List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <span className="text-xs font-medium">Loading PrepNurse test library...</span>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No mock tests match your criteria</p>
          <p className="text-xs text-slate-500">Try adjusting your search query or switching category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTests.map((test) => (
            <div
              key={test.testId}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {test.exam || 'NORCET'} • {test.category || 'Mains'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {test.attemptsCount || 0} Attempts
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {test.description || 'Comprehensive clinical nursing mock examination.'}
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-700">
                    <b className="text-sm font-bold text-slate-900 dark:text-white block">
                      {test.totalQuestions || 0}
                    </b>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Questions</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-700">
                    <b className="text-sm font-bold text-slate-900 dark:text-white block">
                      {test.durationMinutes || 180}m
                    </b>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Duration</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-700">
                    <b className="text-sm font-bold text-slate-900 dark:text-white block">
                      +{test.marksPerCorrect} / -{test.negativeMarks}
                    </b>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Marking</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <Link
                  to={`/test/${test.testId}/instructions?mode=mock`}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm rounded-xl text-center transition-all shadow-sm shadow-purple-500/20 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mock Exam</span>
                </Link>
                <Link
                  to={`/test/${test.testId}/instructions?mode=practice`}
                  className="flex-1 py-2.5 px-3 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-semibold text-xs sm:text-sm rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Practice</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
