/**
 * Question Validation Service for Bulk Upload & Form Submission
 */

const LETTER_TO_INDEX = {
  A: 0, B: 1, C: 2, D: 3,
  a: 0, b: 1, c: 2, d: 3,
  '0': 0, '1': 1, '2': 2, '3': 3,
  0: 0, 1: 1, 2: 2, 3: 3
};

function normalizeCorrectAnswer(val) {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number' && val >= 0 && val <= 3) return val;
  const str = String(val).trim();
  if (LETTER_TO_INDEX[str] !== undefined) return LETTER_TO_INDEX[str];
  return null;
}

function validateQuestion(q, index = 0) {
  const errors = [];
  const qNum = index + 1;

  // 1. Question Text
  if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
    errors.push(`Q${qNum}: Question text is required.`);
  }

  // 2. Options
  let options = q.options;
  if (!Array.isArray(options)) {
    // Check if CSV columns optionA, optionB, optionC, optionD exist
    if (q.optionA && q.optionB && q.optionC && q.optionD) {
      options = [q.optionA, q.optionB, q.optionC, q.optionD];
    } else {
      errors.push(`Q${qNum}: Options must be an array of 4 choices.`);
    }
  }

  if (Array.isArray(options)) {
    if (options.length !== 4) {
      errors.push(`Q${qNum}: Exactly 4 options (A, B, C, D) are required, got ${options.length}.`);
    } else {
      options = options.map((opt, i) => {
        if (!opt || String(opt).trim() === '') {
          errors.push(`Q${qNum}: Option ${String.fromCharCode(65 + i)} cannot be empty.`);
        }
        return String(opt).trim();
      });
    }
  }

  // 3. Correct Answer
  const rawAns = q.correctAnswer !== undefined ? q.correctAnswer : (q.answer !== undefined ? q.answer : q.c);
  const normalizedAns = normalizeCorrectAnswer(rawAns);
  if (normalizedAns === null) {
    errors.push(`Q${qNum}: Invalid correctAnswer '${rawAns}'. Must be A, B, C, D or 0, 1, 2, 3.`);
  }

  // 4. Explanation / Rationale
  const explanation = (q.explanation || q.rationale || q.r || '').trim();
  if (!explanation) {
    errors.push(`Q${qNum}: Explanation/Rationale is required.`);
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      raw: q
    };
  }

  return {
    isValid: true,
    question: {
      questionId: q.questionId || q.id || `q_${Date.now()}_${qNum}`,
      question: q.question.trim(),
      options,
      correctAnswer: normalizedAns,
      explanation,
      subject: (q.subject || 'Medical Surgical Nursing').trim(),
      topic: (q.topic || 'General').trim(),
      difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium',
      tags: Array.isArray(q.tags) ? q.tags : (q.tags ? String(q.tags).split(',').map(t => t.trim()) : [])
    }
  };
}

function validateQuestionsBatch(questionsArray) {
  if (!Array.isArray(questionsArray)) {
    return {
      validCount: 0,
      invalidCount: 0,
      validQuestions: [],
      invalidQuestions: [],
      errors: ['Input must be a JSON array of question objects.']
    };
  }

  const validQuestions = [];
  const invalidQuestions = [];
  const allErrors = [];

  questionsArray.forEach((item, idx) => {
    const res = validateQuestion(item, idx);
    if (res.isValid) {
      validQuestions.push(res.question);
    } else {
      invalidQuestions.push({ index: idx + 1, item, errors: res.errors });
      allErrors.push(...res.errors);
    }
  });

  return {
    validCount: validQuestions.length,
    invalidCount: invalidQuestions.length,
    totalCount: questionsArray.length,
    validQuestions,
    invalidQuestions,
    errors: allErrors
  };
}

module.exports = {
  validateQuestion,
  validateQuestionsBatch,
  normalizeCorrectAnswer
};
