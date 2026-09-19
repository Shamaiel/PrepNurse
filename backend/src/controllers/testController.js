const Test = require('../models/Test');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

exports.getAllTests = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const query = isAdmin ? {} : { status: 'published' };

    const tests = await Test.find(query);
    
    // Add question count and attempt count
    const enriched = await Promise.all(tests.map(async (t) => {
      const qCount = await Question.countDocuments({ testId: t.testId });
      const attCount = await Attempt.countDocuments({ testId: t.testId, status: 'completed' });
      const testObj = t.toObject ? t.toObject() : { ...t };
      return {
        ...testObj,
        totalQuestions: qCount || testObj.totalQuestions || 0,
        attemptsCount: attCount
      };
    }));

    res.json({ tests: enriched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id) || await Test.findOne({ testId: req.params.id });
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const qCount = await Question.countDocuments({ testId: test.testId });
    const testObj = test.toObject ? test.toObject() : { ...test };
    testObj.totalQuestions = qCount || testObj.totalQuestions || 0;

    res.json({ test: testObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Returns questions for active exam session.
 * CRITICAL SECURITY: If mode is 'mock', correctAnswer and explanation are omitted.
 */
exports.getTestSession = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id) || await Test.findOne({ testId: req.params.id });
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const mode = req.query.mode || 'mock'; // 'mock' or 'practice'
    const isAdminPreview = req.query.preview === 'true' && req.user && req.user.role === 'admin';

    let questions = await Question.find({ testId: test.testId });

    if (test.randomizeQuestions && mode === 'mock') {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }

    // Sanitize questions based on mode
    const sanitizedQuestions = questions.map((q, idx) => {
      const qObj = q.toObject ? q.toObject() : { ...q };
      
      if (mode === 'mock' && !isAdminPreview) {
        // Hide answers during mock test to prevent inspection
        const { correctAnswer, explanation, ...safeQ } = qObj;
        return {
          ...safeQ,
          index: idx
        };
      } else {
        // Practice mode or admin preview gets answers for immediate feedback
        return {
          ...qObj,
          index: idx
        };
      }
    });

    res.json({
      test: {
        id: test._id || test.id,
        testId: test.testId,
        title: test.title,
        description: test.description,
        exam: test.exam,
        category: test.category,
        durationMinutes: test.durationMinutes,
        marksPerCorrect: test.marksPerCorrect,
        negativeMarks: test.negativeMarks,
        instructions: test.instructions,
        mode
      },
      questions: sanitizedQuestions,
      totalQuestions: sanitizedQuestions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      exam,
      category,
      durationMinutes,
      marksPerCorrect,
      negativeMarks,
      instructions,
      status,
      randomizeQuestions,
      randomizeOptions
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Test title is required.' });
    }

    const testId = 'test_' + Date.now();
    const newTest = await Test.create({
      testId,
      title: title.trim(),
      description: (description || '').trim(),
      exam: exam || 'NORCET',
      category: category || 'Mains',
      durationMinutes: Number(durationMinutes) || 180,
      marksPerCorrect: Number(marksPerCorrect) !== undefined ? Number(marksPerCorrect) : 1,
      negativeMarks: Number(negativeMarks) !== undefined ? Number(negativeMarks) : 0.33,
      instructions: instructions || 'Standard NORCET mock test instructions.',
      status: status || 'draft',
      randomizeQuestions: Boolean(randomizeQuestions),
      randomizeOptions: Boolean(randomizeOptions),
      createdBy: req.user ? req.user.id : 'admin'
    });

    res.status(201).json({ message: 'Test created successfully.', test: newTest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id) || await Test.findOne({ testId: req.params.id });
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const updated = await Test.findByIdAndUpdate(test._id || test.id, req.body);
    res.json({ message: 'Test updated successfully.', test: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id) || await Test.findOne({ testId: req.params.id });
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    await Test.findByIdAndDelete(test._id || test.id);
    await Question.deleteMany({ testId: test.testId });

    res.json({ message: 'Test and associated questions deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.duplicateTest = async (req, res) => {
  try {
    const sourceTest = await Test.findById(req.params.id) || await Test.findOne({ testId: req.params.id });
    if (!sourceTest) {
      return res.status(404).json({ error: 'Source test not found.' });
    }

    const newTestId = 'test_' + Date.now();
    const duplicatedTest = await Test.create({
      testId: newTestId,
      title: `${sourceTest.title} (Copy)`,
      description: sourceTest.description,
      exam: sourceTest.exam,
      category: sourceTest.category,
      durationMinutes: sourceTest.durationMinutes,
      marksPerCorrect: sourceTest.marksPerCorrect,
      negativeMarks: sourceTest.negativeMarks,
      instructions: sourceTest.instructions,
      status: 'draft',
      randomizeQuestions: sourceTest.randomizeQuestions,
      randomizeOptions: sourceTest.randomizeOptions,
      createdBy: req.user ? req.user.id : 'admin'
    });

    // Duplicate questions
    const sourceQuestions = await Question.find({ testId: sourceTest.testId });
    if (sourceQuestions.length > 0) {
      const clonedQuestions = sourceQuestions.map((q, idx) => {
        const qObj = q.toObject ? q.toObject() : { ...q };
        return {
          questionId: `${newTestId}_q${String(idx + 1).padStart(3, '0')}`,
          testId: newTestId,
          question: qObj.question,
          options: [...qObj.options],
          correctAnswer: qObj.correctAnswer,
          explanation: qObj.explanation,
          subject: qObj.subject,
          topic: qObj.topic,
          difficulty: qObj.difficulty,
          tags: qObj.tags ? [...qObj.tags] : []
        };
      });
      await Question.insertMany(clonedQuestions);
    }

    res.status(201).json({
      message: 'Test duplicated successfully.',
      test: duplicatedTest,
      questionsDuplicated: sourceQuestions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
