import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function AdminCreateTestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exam, setExam] = useState('NORCET');
  const [category, setCategory] = useState('Mains');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [marksPerCorrect, setMarksPerCorrect] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.33);
  const [instructions, setInstructions] = useState('1. Total 180 minutes duration.\n2. +1 for correct answer, -0.33 for wrong.\n3. Epoch countdown auto-submits on expiration.');
  const [status, setStatus] = useState('draft');
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/api/tests', {
        title,
        description,
        exam,
        category,
        durationMinutes: Number(durationMinutes),
        marksPerCorrect: Number(marksPerCorrect),
        negativeMarks: Number(negativeMarks),
        instructions,
        status,
        randomizeQuestions
      });

      alert(`Test "${res.test.title}" created successfully! Now you can upload or add questions.`);
      navigate(`/admin/questions/import?testId=${res.test.testId}`);
    } catch (err) {
      setError(err.message || 'Failed to create test.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="font-bold text-2xl text-slate-900 dark:text-white mt-1">Create New Mock Test</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure examination rules, timing, and marking scheme.
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NORCET 11 Mains Mock Test 2"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the test content and target syllabus..."
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
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                placeholder="NORCET"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                min={5}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
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
                value={marksPerCorrect}
                onChange={(e) => setMarksPerCorrect(e.target.value)}
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
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(e.target.value)}
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
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="draft">Draft (Hidden from candidates)</option>
                <option value="published">Published (Live for candidates)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={randomizeQuestions}
                  onChange={(e) => setRandomizeQuestions(e.target.checked)}
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
              <span>{submitting ? 'Creating...' : 'Save & Proceed to Questions'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
