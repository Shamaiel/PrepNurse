import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { lsGet, lsSet, lsRemove } from '../../utils/storage';
import ExamHeader from '../../components/exam/ExamHeader';
import QuestionCard from '../../components/exam/QuestionCard';
import QuestionPalette from '../../components/exam/QuestionPalette';
import SubmitModal from '../../components/exam/SubmitModal';
import SecurityWarningModal from '../../components/exam/SecurityWarningModal';
import { LayoutGrid, AlertCircle } from 'lucide-react';

export default function ExamPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'mock';
  const navigate = useNavigate();

  // Test & Questions State
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Exam Interaction State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [visited, setVisited] = useState({ 0: true });

  // Timer & Resilience
  const [remainingSeconds, setRemainingSeconds] = useState(180 * 60);
  const timerDeadlineRef = useRef(null);

  // Modals & UI
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isPaletteMobileOpen, setIsPaletteMobileOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const localKey = `prepnurse_exam_${id}_${mode}`;

  // 1. Initialize Test Session & Attempt
  useEffect(() => {
    async function initExam() {
      try {
        setLoading(true);
        setError('');

        // Fetch questions from backend session endpoint
        const sessionRes = await api.get(`/api/tests/${id}/session?mode=${mode}`);
        const testData = sessionRes.test;
        const qList = sessionRes.questions || [];

        setTest(testData);
        setQuestions(qList);

        // Start or resume attempt in backend
        const attemptRes = await api.post('/api/attempts/start', {
          testId: testData.testId || id,
          mode
        });

        const activeAttempt = attemptRes.attempt;
        setAttemptId(activeAttempt.attemptId || activeAttempt._id);

        // Check local backup or backend attempt state
        const localBackup = lsGet(localKey);
        const initialAnswers = localBackup?.answers || activeAttempt.answers || {};
        const initialMarked = localBackup?.marked || activeAttempt.markedQuestions || {};
        const initialVisited = localBackup?.visited || activeAttempt.visited || { 0: true };
        const initialIndex = localBackup?.currentIndex || 0;

        setAnswers(initialAnswers);
        setMarked(initialMarked);
        setVisited(initialVisited);
        setCurrentIndex(initialIndex);

        // Setup timer deadline
        const totalDurationSec = (testData.durationMinutes || 180) * 60;
        if (mode === 'mock') {
          let deadline;
          if (localBackup?.deadline && localBackup.deadline > Date.now()) {
            deadline = localBackup.deadline;
          } else {
            deadline = Date.now() + (totalDurationSec * 1000);
            lsSet(localKey, {
              ...localBackup,
              deadline,
              startedAt: Date.now()
            });
          }
          timerDeadlineRef.current = deadline;
          const calculatedRemaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
          setRemainingSeconds(calculatedRemaining);
        }
      } catch (err) {
        console.error('Failed to init exam:', err);
        setError(err.message || 'Unable to load this PrepNurse examination session.');
      } finally {
        setLoading(false);
      }
    }

    initExam();
  }, [id, mode]);

  // 2. Auto-save local backup & periodic backend sync
  const saveStateLocally = useCallback((newAnswers, newMarked, newVisited, newIndex) => {
    const backup = {
      answers: newAnswers,
      marked: newMarked,
      visited: newVisited,
      currentIndex: newIndex,
      deadline: timerDeadlineRef.current,
      tabSwitches
    };
    lsSet(localKey, backup);
  }, [localKey, tabSwitches]);

  // Sync with backend every 15 seconds
  useEffect(() => {
    if (!attemptId || loading || !test) return;

    const interval = setInterval(() => {
      const timeTakenSec = mode === 'mock' && timerDeadlineRef.current
        ? Math.max(0, Math.floor(((test.durationMinutes || 180) * 60) - remainingSeconds))
        : 0;

      api.put(`/api/attempts/${attemptId}/sync`, {
        answers,
        markedQuestions: marked,
        visited,
        tabSwitches,
        timeTakenSec
      }).catch(err => console.warn('Background sync failed (will retry):', err.message));
    }, 15000);

    return () => clearInterval(interval);
  }, [attemptId, answers, marked, visited, tabSwitches, remainingSeconds, test, mode, loading]);

  // 3. Tab switch & visibility monitoring
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden && mode === 'mock' && !isSubmitModalOpen) {
        setTabSwitches(prev => {
          const next = prev + 1;
          setIsSecurityModalOpen(true);
          return next;
        });
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [mode, isSubmitModalOpen]);

  // 4. Beforeunload prompt to prevent accidental browser close
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (questions.length > 0 && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [questions.length, isSubmitting]);

  // Option selection
  const handleSelectOption = (optIndex) => {
    const nextAnswers = { ...answers, [currentIndex]: optIndex };
    const nextVisited = { ...visited, [currentIndex]: true };
    setAnswers(nextAnswers);
    setVisited(nextVisited);
    saveStateLocally(nextAnswers, marked, nextVisited, currentIndex);
  };

  // Clear Response
  const handleClearResponse = () => {
    const nextAnswers = { ...answers };
    delete nextAnswers[currentIndex];
    setAnswers(nextAnswers);
    saveStateLocally(nextAnswers, marked, visited, currentIndex);
  };

  // Toggle Mark for review
  const handleToggleMark = () => {
    const nextMarked = { ...marked };
    if (nextMarked[currentIndex]) {
      delete nextMarked[currentIndex];
    } else {
      nextMarked[currentIndex] = true;
    }
    setMarked(nextMarked);
    saveStateLocally(answers, nextMarked, visited, currentIndex);
  };

  // Navigation
  const handleGoTo = (index) => {
    if (index < 0 || index >= questions.length) return;
    const nextVisited = { ...visited, [index]: true };
    setCurrentIndex(index);
    setVisited(nextVisited);
    saveStateLocally(answers, marked, nextVisited, index);
  };

  // Submit test
  const handleSubmitConfirm = async (isAuto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const totalDurationSec = (test?.durationMinutes || 180) * 60;
      const timeTakenSec = mode === 'mock'
        ? Math.max(0, Math.min(totalDurationSec, totalDurationSec - remainingSeconds))
        : 0;

      const res = await api.post(`/api/attempts/${attemptId}/submit`, {
        answers,
        markedQuestions: marked,
        autoSubmitted: isAuto,
        timeTakenSec,
        tabSwitches
      });

      // Clear local backup
      lsRemove(localKey);

      // Navigate to Results page with attempt data
      navigate(`/results/${attemptId}`, {
        state: {
          result: res.attempt
        },
        replace: true
      });
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission error: ' + (err.message || 'Please try again.'));
      setIsSubmitting(false);
    }
  };

  // Timer Tick
  const handleTimerTick = (newRemaining) => {
    setRemainingSeconds(newRemaining);
  };

  // Timer Expire
  const handleTimerExpire = () => {
    handleSubmitConfirm(true);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Summary counts for submit modal
  const answeredCount = Object.keys(answers).length;
  const unattemptedCount = Math.max(0, questions.length - answeredCount);
  const markedCount = Object.keys(marked).length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Preparing your PrepNurse exam session...</p>
        <span className="text-xs text-slate-500">Loading high-yield clinical MCQs</span>
      </div>
    );
  }

  if (error || !test || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Failed to start exam</h2>
        <p className="text-xs text-slate-500">{error || 'No questions found for this test.'}</p>
        <button
          onClick={() => navigate('/tests')}
          className="py-2.5 px-5 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-sm"
        >
          Return to Tests
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Exam Header */}
      <ExamHeader
        testTitle={test.title}
        mode={mode}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        remainingSeconds={remainingSeconds}
        onExpire={handleTimerExpire}
        onTick={handleTimerTick}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onLeaveClick={() => {
          if (confirm('Leave this exam? Your progress is saved automatically and you can resume anytime.')) {
            navigate('/');
          }
        }}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Main Exam Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Question Panel */}
        <div className="flex-1 w-full min-w-0">
          <QuestionCard
            question={currentQ}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentIndex]}
            isMarked={Boolean(marked[currentIndex])}
            mode={mode}
            onSelectOption={handleSelectOption}
            onClearResponse={handleClearResponse}
            onToggleMark={handleToggleMark}
            onPrev={() => handleGoTo(currentIndex - 1)}
            onNext={() => handleGoTo(currentIndex + 1)}
            onSaveAndNext={() => {
              if (currentIndex < questions.length - 1) {
                handleGoTo(currentIndex + 1);
              } else {
                setIsSubmitModalOpen(true);
              }
            }}
          />
        </div>

        {/* Question Palette Sidebar (Desktop) & Mobile Drawer */}
        <QuestionPalette
          totalQuestions={questions.length}
          currentIndex={currentIndex}
          answers={answers}
          marked={marked}
          visited={visited}
          questions={questions}
          mode={mode}
          onSelectQuestion={handleGoTo}
          isOpenMobile={isPaletteMobileOpen}
          onCloseMobile={() => setIsPaletteMobileOpen(false)}
        />
      </main>

      {/* Mobile Floating Action Button (FAB) for Question Palette */}
      <button
        onClick={() => setIsPaletteMobileOpen(true)}
        className="md:hidden fixed left-4 bottom-5 z-30 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-2xl p-3 shadow-xl shadow-purple-500/30 flex items-center gap-2 border border-white/20 active:scale-95 transition-transform"
        aria-label="Open Question Palette"
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-xs font-bold font-mono">
          {currentIndex + 1}/{questions.length}
        </span>
      </button>

      {/* Submit Confirmation Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitConfirm={() => handleSubmitConfirm(false)}
        summary={{
          total: questions.length,
          answered: answeredCount,
          unattempted: unattemptedCount,
          marked: markedCount
        }}
        isSubmitting={isSubmitting}
        mode={mode}
      />

      {/* Anti-Cheating / Security Notice Modal */}
      <SecurityWarningModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        tabSwitches={tabSwitches}
      />
    </div>
  );
}
