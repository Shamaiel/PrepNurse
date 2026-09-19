const assert = require('assert');
const { validateQuestion, validateQuestionsBatch, normalizeCorrectAnswer } = require('../src/services/validatorService');

console.log('--- RUNNING QUESTION VALIDATOR UNIT TESTS ---');

// Test Case 1: Letter normalization (A->0, B->1, C->2, D->3)
{
  assert.strictEqual(normalizeCorrectAnswer('A'), 0);
  assert.strictEqual(normalizeCorrectAnswer('b'), 1);
  assert.strictEqual(normalizeCorrectAnswer('C'), 2);
  assert.strictEqual(normalizeCorrectAnswer('3'), 3);
  assert.strictEqual(normalizeCorrectAnswer('E'), null);
  assert.strictEqual(normalizeCorrectAnswer(4), null);
  console.log('✓ Test 1 Passed: Letter normalization');
}

// Test Case 2: Valid Question
{
  const validItem = {
    question: 'What is the standard adult CPR compression-to-ventilation ratio for single rescuers?',
    options: ['15:2', '30:2', '5:1', '50:2'],
    correctAnswer: 'B',
    explanation: 'AHA guidelines specify 30:2 for adult cardiac arrest.',
    subject: 'Nursing Foundations'
  };

  const res = validateQuestion(validItem, 0);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.question.correctAnswer, 1);
  assert.strictEqual(res.question.options.length, 4);
  console.log('✓ Test 2 Passed: Single Valid Question');
}

// Test Case 3: Malformed questions detection
{
  const malformedBatch = [
    // Missing question text
    { question: '', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'Exp' },
    // Only 3 options
    { question: 'Valid text', options: ['A', 'B', 'C'], correctAnswer: 0, explanation: 'Exp' },
    // Invalid correct answer
    { question: 'Valid text', options: ['A', 'B', 'C', 'D'], correctAnswer: 'Z', explanation: 'Exp' },
    // Missing explanation
    { question: 'Valid text', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: '' },
    // Valid item
    { question: 'Valid question', options: ['A', 'B', 'C', 'D'], correctAnswer: 2, explanation: 'Valid exp' }
  ];

  const batchRes = validateQuestionsBatch(malformedBatch);
  assert.strictEqual(batchRes.validCount, 1, 'Should find exactly 1 valid question');
  assert.strictEqual(batchRes.invalidCount, 4, 'Should find exactly 4 invalid questions');
  assert.strictEqual(batchRes.errors.length >= 4, true, 'Should report errors for each invalid question');
  console.log('✓ Test 3 Passed: Malformed Batch Detection');
}

console.log('ALL VALIDATOR TESTS PASSED SUCCESSFULLY!\n');
