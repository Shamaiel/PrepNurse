const assert = require('assert');
const { calculateScore } = require('../src/services/scoringService');

console.log('--- RUNNING SCORING SERVICE UNIT TESTS ---');

// Test Case 1: Standard NORCET Scoring (+1, -0.33)
// 70 Correct, 20 Wrong, 10 Unattempted (Total 100 questions)
{
  const mockQuestions = Array.from({ length: 100 }, (_, i) => ({
    questionId: 'q' + i,
    question: 'Sample Question ' + i,
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'Rationale ' + i,
    subject: i < 50 ? 'Medical Surgical Nursing' : 'Child Health Nursing'
  }));

  const mockAnswers = {};
  // 70 correct
  for (let i = 0; i < 70; i++) mockAnswers[i] = 0;
  // 20 wrong (chose option 1 when correct is 0)
  for (let i = 70; i < 90; i++) mockAnswers[i] = 1;
  // 10 unattempted (indices 90-99 not set)

  const result = calculateScore({
    questions: mockQuestions,
    answers: mockAnswers,
    marksPerCorrect: 1,
    negativeMarks: 0.33
  });

  assert.strictEqual(result.correct, 70, 'Correct count should be 70');
  assert.strictEqual(result.wrong, 20, 'Wrong count should be 20');
  assert.strictEqual(result.unattempted, 10, 'Unattempted count should be 10');
  assert.strictEqual(result.attempted, 90, 'Attempted count should be 90');
  // 70*1 - 20*0.33 = 70 - 6.6 = 63.4
  assert.strictEqual(result.score, 63.4, `Score should be 63.4, got ${result.score}`);
  // Accuracy = 70/90 = 77.8%
  assert.strictEqual(result.accuracy, 77.8, `Accuracy should be 77.8, got ${result.accuracy}`);
  console.log('✓ Test 1 Passed: Standard NORCET Scoring (+1, -0.33)');
}

// Test Case 2: Negative Marks Avoid -0
{
  const mockQuestions = [
    { questionId: 'q0', question: 'Q0', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'R0' }
  ];
  const mockAnswers = {}; // Unattempted

  const result = calculateScore({
    questions: mockQuestions,
    answers: mockAnswers,
    marksPerCorrect: 1,
    negativeMarks: 0.33
  });

  assert.strictEqual(result.score, 0, 'Score for unattempted should be 0');
  assert.strictEqual(result.correct, 0);
  assert.strictEqual(result.wrong, 0);
  assert.strictEqual(result.unattempted, 1);
  console.log('✓ Test 2 Passed: Unattempted Zero Score');
}

// Test Case 3: Custom Marking Scheme (+2, -0.5)
{
  const mockQuestions = [
    { questionId: 'q1', question: 'Q1', options: ['A', 'B', 'C', 'D'], correctAnswer: 1, explanation: 'R1' },
    { questionId: 'q2', question: 'Q2', options: ['A', 'B', 'C', 'D'], correctAnswer: 2, explanation: 'R2' }
  ];
  const mockAnswers = { 0: 1, 1: 0 }; // 1 correct, 1 wrong

  const result = calculateScore({
    questions: mockQuestions,
    answers: mockAnswers,
    marksPerCorrect: 2,
    negativeMarks: 0.5
  });

  // 1*2 - 1*0.5 = 1.5
  assert.strictEqual(result.score, 1.5, `Score should be 1.5, got ${result.score}`);
  assert.strictEqual(result.accuracy, 50, 'Accuracy should be 50%');
  console.log('✓ Test 3 Passed: Custom Marking (+2, -0.5)');
}

console.log('ALL SCORING TESTS PASSED SUCCESSFULLY!\n');
