/**
 * Scoring Service for NORCET Mock Test Platform
 * Accurate calculation for +1, -1/3 (or custom test markings) with floating-point precision.
 */

function calculateScore({ questions, answers, marksPerCorrect = 1, negativeMarks = 0.33, markedQuestions = {} }) {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  let markedCount = 0;

  const detailedReview = questions.map((q, idx) => {
    const isMarked = Boolean(markedQuestions[idx] || (q.questionId && markedQuestions[q.questionId]));
    if (isMarked) markedCount++;

    // User's answer index (0, 1, 2, 3) or undefined
    const selected = answers[idx] !== undefined ? answers[idx] : (q.questionId ? answers[q.questionId] : undefined);
    const hasAnswered = selected !== undefined && selected !== null;

    let status = 'unattempted';
    let isCorrect = false;

    if (!hasAnswered) {
      unattempted++;
      status = 'unattempted';
    } else if (Number(selected) === Number(q.correctAnswer)) {
      correct++;
      isCorrect = true;
      status = 'correct';
    } else {
      wrong++;
      isCorrect = false;
      status = 'wrong';
    }

    return {
      index: idx,
      questionId: q.questionId || q.id || ('q_' + idx),
      question: q.question,
      options: q.options,
      userAnswer: hasAnswered ? Number(selected) : null,
      correctAnswer: Number(q.correctAnswer),
      isCorrect,
      status,
      isMarked,
      explanation: q.explanation,
      subject: q.subject || 'Medical Surgical Nursing',
      topic: q.topic || 'General',
      difficulty: q.difficulty || 'Medium'
    };
  });

  const rawScore = (correct * Number(marksPerCorrect)) - (wrong * Number(negativeMarks));
  // Round to 2 decimal places, but avoid displaying -0
  let score = Number(rawScore.toFixed(2));
  if (Object.is(score, -0)) score = 0;

  const attempted = correct + wrong;
  const totalQuestions = questions.length;
  const accuracy = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(1)) : 0;
  const percentage = totalQuestions > 0 ? Number(((score / (totalQuestions * Number(marksPerCorrect))) * 100).toFixed(1)) : 0;

  // Subject-wise analysis
  const subjectStats = {};
  detailedReview.forEach(item => {
    const subj = item.subject || 'Other';
    if (!subjectStats[subj]) {
      subjectStats[subj] = { total: 0, correct: 0, wrong: 0, unattempted: 0 };
    }
    subjectStats[subj].total++;
    if (item.status === 'correct') subjectStats[subj].correct++;
    else if (item.status === 'wrong') subjectStats[subj].wrong++;
    else subjectStats[subj].unattempted++;
  });

  for (const subj in subjectStats) {
    const s = subjectStats[subj];
    const sAttempted = s.correct + s.wrong;
    s.accuracy = sAttempted > 0 ? Number(((s.correct / sAttempted) * 100).toFixed(1)) : 0;
  }

  return {
    correct,
    wrong,
    unattempted,
    marked: markedCount,
    attempted,
    totalQuestions,
    score,
    accuracy,
    percentage,
    subjectStats,
    detailedReview
  };
}

module.exports = {
  calculateScore
};
