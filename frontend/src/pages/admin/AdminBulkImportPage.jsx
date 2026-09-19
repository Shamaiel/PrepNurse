import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Upload, FileText, CheckCircle2, XCircle, AlertTriangle, Download, ArrowLeft } from 'lucide-react';

export default function AdminBulkImportPage() {
  const [searchParams] = useSearchParams();
  const initialTestId = searchParams.get('testId') || '';

  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(initialTestId);
  const [replaceExisting, setReplaceExisting] = useState(false);

  // File & Validation state
  const [parsedData, setParsedData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTests() {
      try {
        const res = await api.get('/api/tests');
        setTests(res.tests || []);
        if (!initialTestId && res.tests?.length > 0) {
          setSelectedTestId(res.tests[0].testId);
        }
      } catch (err) {
        console.error('Failed to load tests:', err);
      }
    }
    loadTests();
  }, [initialTestId]);

  // Handle File Selection (JSON or CSV)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        let questionsArray = [];

        if (file.name.endsWith('.json')) {
          questionsArray = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          questionsArray = parseCSV(content);
        } else {
          throw new Error('Unsupported file format. Please upload .json or .csv.');
        }

        if (!Array.isArray(questionsArray)) {
          throw new Error('File content must resolve to an array of questions.');
        }

        setParsedData(questionsArray);
        await runValidation(questionsArray);
      } catch (err) {
        console.error('Parsing error:', err);
        setError(`Failed to read file: ${err.message}`);
        setParsedData(null);
        setValidationResult(null);
      }
    };

    reader.readAsText(file);
  };

  // Simple client-side CSV parser
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
      const matches = [];
      let match;
      while ((match = regex.exec(lines[i])) !== null) {
        let val = match[1];
        if (val === undefined) break;
        val = val.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
        matches.push(val);
        if (regex.lastIndex >= lines[i].length) break;
      }

      if (matches.length > 0) {
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = matches[idx] || '';
        });

        // Convert CSV row format to standard question format
        const qObj = {
          question: row.question || row.Question,
          options: [
            row.optionA || row.OptionA || row.option_a || row['Option A'] || '',
            row.optionB || row.OptionB || row.option_b || row['Option B'] || '',
            row.optionC || row.OptionC || row.option_c || row['Option C'] || '',
            row.optionD || row.OptionD || row.option_d || row['Option D'] || ''
          ],
          correctAnswer: row.correctAnswer || row.CorrectAnswer || row.correct_answer || row['Correct Answer'] || 'A',
          explanation: row.explanation || row.Explanation || row.Rationale || '',
          subject: row.subject || row.Subject || 'Medical Surgical Nursing',
          topic: row.topic || row.Topic || 'General',
          difficulty: row.difficulty || row.Difficulty || 'Medium'
        };
        rows.push(qObj);
      }
    }
    return rows;
  }

  // Validate questions with the server validation endpoint
  const runValidation = async (qArray) => {
    try {
      setValidating(true);
      const res = await api.post('/api/questions/validate', { questions: qArray });
      setValidationResult(res);
    } catch (err) {
      setError(err.message || 'Validation failed on server.');
    } finally {
      setValidating(false);
    }
  };

  // Submit confirmed batch import
  const handleConfirmImport = async () => {
    if (!selectedTestId) {
      alert('Please select a target test first.');
      return;
    }

    if (!parsedData || parsedData.length === 0) {
      alert('No parsed questions to import.');
      return;
    }

    try {
      setImporting(true);
      const res = await api.post('/api/questions/import', {
        testId: selectedTestId,
        questions: parsedData,
        replaceExisting
      });

      alert(`Success! ${res.importedCount} questions successfully added to test "${selectedTestId}".`);
      navigate(`/admin/questions?testId=${selectedTestId}`);
    } catch (err) {
      console.error('Import error:', err);
      alert('Failed to import questions: ' + (err.message || 'Unknown error.'));
    } finally {
      setImporting(false);
    }
  };

  // Template download helpers
  const handleDownloadSampleJSON = () => {
    const sample = [
      {
        question: "A client with acute pancreatitis develops signs of tetany. Which nursing assessment is most appropriate?",
        options: [
          "Check for Trousseau's and Chvostek's sign",
          "Auscultate for friction rub",
          "Assess for Kernig's sign",
          "Check for Babinski reflex"
        ],
        correctAnswer: "A",
        explanation: "Hypocalcemia occurs in acute pancreatitis due to saponification of fat by pancreatic lipase. Tetany, positive Trousseau's sign, and Chvostek's sign reflect low serum calcium.",
        subject: "Medical Surgical Nursing",
        topic: "Gastrointestinal System",
        difficulty: "Medium"
      }
    ];

    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prepnurse_sample_questions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent =
      `question,optionA,optionB,optionC,optionD,correctAnswer,explanation,subject,topic,difficulty\n` +
      `"A client with acute pancreatitis develops signs of tetany. Which assessment is most appropriate?","Check Trousseau's sign","Auscultate friction rub","Assess Kernig's sign","Check Babinski reflex","A","Hypocalcemia occurs in pancreatitis due to fat saponification.","Medical Surgical Nursing","Gastrointestinal","Medium"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prepnurse_sample_questions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/admin/questions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Question Bank</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-9 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            PrepNurse Ingestion
          </span>
          <h1 className="font-bold text-2xl text-slate-900 dark:text-white mt-1">Bulk Question Importer</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Upload 50 to 200+ NORCET MCQs instantly from JSON or CSV with automated schema validation.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Template Downloads */}
        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-purple-900 dark:text-purple-200">
              Need standard file templates?
            </h4>
            <p className="text-xs text-purple-700 dark:text-purple-400">
              Download pre-formatted sample files containing all required question schema fields.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadSampleJSON}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-purple-100 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample .JSON</span>
            </button>
            <button
              onClick={handleDownloadSampleCSV}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-purple-100 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample .CSV</span>
            </button>
          </div>
        </div>

        {/* Target Test Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Target Test Assignment *
            </label>
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {tests.map(t => (
                <option key={t.testId} value={t.testId}>
                  {t.title} ({t.totalQuestions || 0} existing)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-600"
              />
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                Replace existing questions in this test (Optional)
              </span>
            </label>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-3xl p-10 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-purple-50/30 transition-all space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-800">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {fileName ? `Selected File: ${fileName}` : 'Click to Browse or Drag & Drop File Here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports standard <b>.json</b> and <b>.csv</b> formats containing question, options, correctAnswer, and rationale
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Validation Live Preview */}
        {validating && (
          <div className="py-8 text-center text-xs text-slate-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
            Validating questions against PrepNurse clinical schema...
          </div>
        )}

        {validationResult && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Import Preview & Verification
            </h3>

            {/* Stats Summary Bar */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-2xl font-bold text-slate-900 dark:text-white block">{validationResult.totalCount}</span>
                <span className="text-[10.5px] uppercase font-semibold text-slate-400">Total In File</span>
              </div>

              <div className="bg-teal-50 dark:bg-teal-950/40 p-3 rounded-2xl border border-teal-200 dark:border-teal-800">
                <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 block">
                  {validationResult.validCount}
                </span>
                <span className="text-[10.5px] uppercase font-semibold text-teal-800 dark:text-teal-300">
                  ✓ Valid Schema
                </span>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-800">
                <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 block">
                  {validationResult.invalidCount}
                </span>
                <span className="text-[10.5px] uppercase font-semibold text-rose-800 dark:text-rose-300">
                  ✕ Malformed
                </span>
              </div>
            </div>

            {/* Error Listing (if any) */}
            {validationResult.invalidCount > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>The following questions failed validation and will be skipped:</span>
                </div>
                <ul className="text-xs text-rose-800 dark:text-rose-300 space-y-1 pl-6 list-disc max-h-40 overflow-y-auto">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confirmation CTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setParsedData(null);
                  setValidationResult(null);
                  setFileName('');
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Reset
              </button>

              <button
                type="button"
                disabled={importing || validationResult.validCount === 0}
                onClick={handleConfirmImport}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{importing ? 'Importing Questions...' : `Import ${validationResult.validCount} Valid Questions`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
