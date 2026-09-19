import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function AdminEditTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.put(`/api/tests/${test._id || test.id || test.testId}`, test);
      alert('Test updated successfully!');
      navigate('/admin/tests');
    } catch (err) {
      setError(err.message || 'Failed to update test.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
        Loading test details...
      </div>
    );
  }

  if (!test) {
    return <div className="py-20 text-center text-xs text-rose-600">Test not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        to="/admin/tests"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tests</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            PrepNurse Config
          </span>
          <h1 className="font-bold text-2xl text-slate-900 dark:text-white mt-1">Edit Mock Test</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Update test metadata, duration, or publishing status
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Test Title *
            </label>
            <input
              type="text"
              required
              value={test.title || ''}
              onChange={(e) => setTest({ ...test, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={test.description || ''}
              onChange={(e) => setTest({ ...test, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Exam
              </label>
              <input
                type="text"
                value={test.exam || ''}
                onChange={(e) => setTest({ ...test, exam: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={test.category || 'Mains'}
                onChange={(e) => setTest({ ...test, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Mains">Mains</option>
                <option value="Prelims">Prelims</option>
                <option value="Topic-wise">Topic-wise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={test.durationMinutes || 180}
                onChange={(e) => setTest({ ...test, durationMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Marks Per Correct
              </label>
              <input
                type="number"
                step="0.5"
                value={test.marksPerCorrect || 1}
                onChange={(e) => setTest({ ...test, marksPerCorrect: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Negative Marking
              </label>
              <input
                type="number"
                step="0.01"
                value={test.negativeMarks || 0.33}
                onChange={(e) => setTest({ ...test, negativeMarks: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Instructions
            </label>
            <textarea
              rows={3}
              value={test.instructions || ''}
              onChange={(e) => setTest({ ...test, instructions: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={test.status || 'draft'}
                onChange={(e) => setTest({ ...test, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Visible)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(test.randomizeQuestions)}
                  onChange={(e) => setTest({ ...test, randomizeQuestions: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-600"
                />
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">Randomize Questions Order</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-sm shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
