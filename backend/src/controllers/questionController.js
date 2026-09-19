const Question = require('../models/Question');
const Test = require('../models/Test');
const { validateQuestionsBatch, validateQuestion } = require('../services/validatorService');

exports.getAllQuestions = async (req, res) => {
  try {
    const { testId, subject, difficulty, search } = req.query;
    const query = {};
    if (testId) query.testId = testId;
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;

    let questions = await Question.find(query);

    if (search) {
      const term = search.toLowerCase();
      questions = questions.filter(q => 
        q.question.toLowerCase().includes(term) ||
        (q.explanation && q.explanation.toLowerCase().includes(term)) ||
        (q.topic && q.topic.toLowerCase().includes(term))
      );
    }

    res.json({ questions, total: questions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    res.json({ question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { testId, question, options, correctAnswer, explanation, subject, topic, difficulty, tags } = req.body;

    const validation = validateQuestion({
      question,
      options,
      correctAnswer,
      explanation,
      subject,
      topic,
      difficulty,
      tags
    });

    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    const test = await Test.findOne({ testId }) || await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: `Test with ID '${testId}' not found.` });
    }

    const newQuestion = await Question.create({
      ...validation.question,
      testId: test.testId
    });

    // Update test question count
    const totalQ = await Question.countDocuments({ testId: test.testId });
    await Test.findByIdAndUpdate(test._id || test.id, { totalQuestions: totalQ });

    res.status(201).json({ message: 'Question created successfully.', question: newQuestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    const updated = await Question.findByIdAndUpdate(q._id || q.id, req.body);
    res.json({ message: 'Question updated successfully.', question: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    await Question.findByIdAndDelete(q._id || q.id);

    // Update test count
    const totalQ = await Question.countDocuments({ testId: q.testId });
    const test = await Test.findOne({ testId: q.testId });
    if (test) {
      await Test.findByIdAndUpdate(test._id || test.id, { totalQuestions: totalQ });
    }

    res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Preview and validate bulk uploaded questions before saving
 */
exports.validateBatch = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Input must be a JSON array of question objects.' });
    }

    const result = validateQuestionsBatch(questions);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Commit bulk imported questions to a specific test
 */
exports.importBatch = async (req, res) => {
  try {
    const { testId, questions, replaceExisting } = req.body;

    if (!testId) {
      return res.status(400).json({ error: 'Target testId is required.' });
    }

    const test = await Test.findOne({ testId }) || await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: `Test '${testId}' not found.` });
    }

    const validation = validateQuestionsBatch(questions);
    if (validation.validCount === 0) {
      return res.status(400).json({
        error: 'No valid questions found to import.',
        errors: validation.errors
      });
    }

    if (replaceExisting) {
      await Question.deleteMany({ testId: test.testId });
    }

    const formattedForInsert = validation.validQuestions.map((q, idx) => ({
      ...q,
      testId: test.testId,
      questionId: `${test.testId}_q${String(idx + 1).padStart(3, '0')}`
    }));

    const inserted = await Question.insertMany(formattedForInsert);

    const totalQ = await Question.countDocuments({ testId: test.testId });
    await Test.findByIdAndUpdate(test._id || test.id, { totalQuestions: totalQ });

    res.status(201).json({
      message: `Successfully imported ${inserted.length} questions into ${test.title}.`,
      importedCount: inserted.length,
      invalidSkippedCount: validation.invalidCount,
      totalTestQuestions: totalQ
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
