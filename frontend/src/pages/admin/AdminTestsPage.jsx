import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { PlusCircle, Copy, Trash2, Edit3, Eye, Upload, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  async function loadTests() {
    try {
      setLoading(true);
      const res = await api.get('/api/tests');
      setTests(res.tests || []);
    } catch (err) {
      console.error('Error fetching admin tests:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTests();
  }, []);

  const handleTogglePublish = async (test) => {
    const nextStatus = test.status === 'published' ? 'draft' : 'published';
    try {
      setActionLoading(test.testId);
      await api.put(`/api/tests/${test._id || test.id || test.testId}`, { status: nextStatus });
      await loadTests();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (testId) => {
    try {
      setActionLoading(testId);
      await api.post(`/api/tests/${testId}/duplicate`);
      alert('Test duplicated successfully! You can now configure it or upload new questions.');
      await loadTests();
    } catch (err) {
      alert('Failed to duplicate test: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (testId, title) => {
    if (!confirm(`Are you sure you want to delete "${title}" and all its questions? This action cannot be undone.`)) {
      return;
    }
    try {
      setActionLoading(testId);
      await api.delete(`/api/tests/${testId}`);
      await loadTests();
    } catch (err) {
      alert('Failed to delete test: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            PrepNurse Catalog
          </span>
          <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">Manage Mock Tests</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create new examinations, duplicate templates, toggle publication status, and edit test parameters.
          </p>
        </div>

        <Link
          to="/admin/tests/create"
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-purple-500/20 transition-all flex items-center gap-2 self-start active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Test</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          Loading tests list...
        </div>
      ) : tests.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No mock tests found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Test Title</th>
                  <th className="py-3.5 px-4">Exam / Category</th>
                  <th className="py-3.5 px-4">Duration & Marking</th>
                  <th className="py-3.5 px-4">Questions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tests.map((t) => (
                  <tr key={t.testId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <div>{t.title}</div>
                      <span className="text-[11px] font-mono font-normal text-slate-400">{t.testId}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {t.exam} • {t.category}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {t.durationMinutes}m (+{t.marksPerCorrect}/-{t.negativeMarks})
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {t.totalQuestions || 0}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(t)}
                        disabled={actionLoading === t.testId}
                        className={`px-3 py-1 rounded-full text-[10.5px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                          t.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                        }`}
                        title="Toggle Published / Draft"
                      >
                        {t.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{t.status}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/test/${t.testId}/instructions?mode=mock&preview=true`}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Candidate Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/questions/import?testId=${t.testId}`}
                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Upload Questions into this test"
                        >
                          <Upload className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/tests/edit/${t.testId}`}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Edit Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(t.testId)}
                          disabled={actionLoading === t.testId}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Duplicate Test"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.testId, t.title)}
                          disabled={actionLoading === t.testId}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Delete Test"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
