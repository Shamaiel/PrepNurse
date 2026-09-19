import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LETTERS } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import { PlusCircle, Search, Edit3, Trash2, Eye, AlertCircle, Save } from 'lucide-react';

export default function AdminQuestionBankPage() {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Modal State for Manual Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewQ, setPreviewQ] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    testId: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    subject: 'Medical Surgical Nursing',
    topic: 'General',
    difficulty: 'Medium'
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadQuestions() {
    try {
      setLoading(true);
      const qRes = await api.get('/api/questions');
      setQuestions(qRes.questions || []);

      const tRes = await api.get('/api/tests');
      setTests(tRes.tests || []);
      if (tRes.tests?.length > 0 && !formData.testId) {
        setFormData(prev => ({ ...prev, testId: tRes.tests[0].testId }));
      }
    } catch (err) {
      console.error('Error loading question bank:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = !search || q.question.toLowerCase().includes(search.toLowerCase()) ||
      (q.explanation && q.explanation.toLowerCase().includes(search.toLowerCase())) ||
      (q.topic && q.topic.toLowerCase().includes(search.toLowerCase()));
    const matchesTest = !selectedTestId || q.testId === selectedTestId;
    const matchesSubject = !selectedSubject || q.subject === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesTest && matchesSubject && matchesDifficulty;
  });

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormData({
      testId: selectedTestId || tests[0]?.testId || '',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
      subject: 'Medical Surgical Nursing',
      topic: 'General',
      difficulty: 'Medium'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setFormData({
      testId: q.testId,
      question: q.question,
      optionA: q.options?.[0] || '',
      optionB: q.options?.[1] || '',
      optionC: q.options?.[2] || '',
      optionD: q.options?.[3] || '',
      correctAnswer: typeof q.correctAnswer === 'number' ? LETTERS[q.correctAnswer] : (q.correctAnswer || 'A'),
      explanation: q.explanation || '',
      subject: q.subject || 'Medical Surgical Nursing',
      topic: q.topic || 'General',
      difficulty: q.difficulty || 'Medium'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        testId: formData.testId,
        question: formData.question,
        options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation,
        subject: formData.subject,
        topic: formData.topic,
        difficulty: formData.difficulty
      };

      if (editingQuestion) {
        await api.put(`/api/questions/${editingQuestion._id || editingQuestion.id || editingQuestion.questionId}`, payload);
      } else {
        await api.post('/api/questions', payload);
      }

      setIsModalOpen(false);
      await loadQuestions();
    } catch (err) {
      setFormError(err.message || 'Failed to save question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/api/questions/${qId}`);
      await loadQuestions();
    } catch (err) {
      alert('Failed to delete question: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            PrepNurse Central Repository
          </span>
          <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">Question Bank</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Search, edit, preview, and manually author clinical nursing questions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-purple-500/20 transition-all flex items-center gap-2 self-start active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Test Filter */}
          <div>
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
            >
              <option value="">All Tests</option>
              {tests.map(t => (
                <option key={t.testId} value={t.testId}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
            >
              <option value="">All Subjects</option>
              <option value="Medical Surgical Nursing">Medical Surgical Nursing</option>
              <option value="Obstetrics & Gynaecological Nursing">Obstetrics & Gynaecological Nursing</option>
              <option value="Child Health Nursing (Pediatrics)">Child Health Nursing (Pediatrics)</option>
              <option value="Mental Health Nursing (Psychiatry)">Mental Health Nursing (Psychiatry)</option>
              <option value="Community Health Nursing">Community Health Nursing</option>
              <option value="Nursing Foundations">Nursing Foundations</option>
              <option value="Pharmacology in Nursing">Pharmacology in Nursing</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 pt-1 flex items-center justify-between">
          <span>Showing <b>{filteredQuestions.length}</b> of <b>{questions.length}</b> total questions</span>
          {(search || selectedTestId || selectedSubject || selectedDifficulty) && (
            <button
              onClick={() => { setSearch(''); setSelectedTestId(''); setSelectedSubject(''); setSelectedDifficulty(''); }}
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="py-24 text-center text-xs text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          Loading questions...
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs text-xs text-slate-500">
          No questions match your filter criteria.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12">#</th>
                  <th className="py-3.5 px-4">Question Text</th>
                  <th className="py-3.5 px-4">Subject / Topic</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Correct</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQuestions.map((q, idx) => (
                  <tr key={q.questionId || q._id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-slate-400 text-xs">{idx + 1}</td>
                    <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs sm:max-w-md">
                      <div className="line-clamp-2">{q.question}</div>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{q.subject}</div>
                      <div className="text-[11px] text-slate-400">{q.topic || 'General'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        q.difficulty === 'Hard'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}>
                        {q.difficulty || 'Medium'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-teal-600 dark:text-teal-400">
                      {LETTERS[q.correctAnswer]}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => { setPreviewQ(q); setIsPreviewOpen(true); }}
                          className="p-2 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="p-2 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id || q.id || q.questionId)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete"
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

      {/* Manual Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs sm:text-sm">
          {formError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-400 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Target Test Assignment *
            </label>
            <select
              value={formData.testId}
              onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              {tests.map(t => (
                <option key={t.testId} value={t.testId}>{t.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Question Text *
            </label>
            <textarea
              rows={3}
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Options (A, B, C, D) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey, idx) => (
                <div key={optKey} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300">
                    {LETTERS[idx]}
                  </span>
                  <input
                    type="text"
                    required
                    value={formData[optKey]}
                    onChange={(e) => setFormData({ ...formData, [optKey]: e.target.value })}
                    placeholder={`Option ${LETTERS[idx]}`}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Correct Answer *
              </label>
              <select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-teal-600 font-bold"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Medical Surgical Nursing">Medical Surgical Nursing</option>
                <option value="Obstetrics & Gynaecological Nursing">Obstetrics & Gynaecological Nursing</option>
                <option value="Child Health Nursing (Pediatrics)">Child Health Nursing (Pediatrics)</option>
                <option value="Mental Health Nursing (Psychiatry)">Mental Health Nursing (Psychiatry)</option>
                <option value="Community Health Nursing">Community Health Nursing</option>
                <option value="Nursing Foundations">Nursing Foundations</option>
                <option value="Pharmacology in Nursing">Pharmacology in Nursing</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Clinical Explanation / Rationale *
            </label>
            <textarea
              rows={3}
              required
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Detailed clinical rationale explaining why the correct choice is valid..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Save Question'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewQ && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Question Preview"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-semibold">{previewQ.subject}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">{previewQ.difficulty}</span>
            </div>

            <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">{previewQ.question}</p>

            <div className="space-y-2">
              {previewQ.options?.map((opt, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                    i === previewQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs">
                    {LETTERS[i]}
                  </span>
                  <span>{opt}</span>
                  {i === previewQ.correctAnswer && <span className="ml-auto text-xs text-emerald-600 font-bold uppercase">✓ CORRECT</span>}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 leading-relaxed">
              <span className="text-purple-600 dark:text-purple-400 font-bold block mb-1">Clinical Rationale:</span>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{previewQ.explanation}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
