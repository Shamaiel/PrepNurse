const Attempt = require('../models/Attempt');
const Test = require('../models/Test');
const Question = require('../models/Question');
const { calculateScore } = require('../services/scoringService');

exports.startAttempt = async (req, res) => {
  try {
    const { testId, mode = 'mock' } = req.body;
    const userId = req.user ? req.user.id : 'guest_' + Date.now();
    const userName = req.user ? req.user.name : 'Guest Candidate';
    const userEmail = req.user ? req.user.email : 'guest@example.com';

    const test = await Test.findOne({ testId }) || await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    // Check if there is already an in-progress attempt to resume
    const existing = await Attempt.findOne({
      userId,
      testId: test.testId,
      status: 'in_progress',
      mode
    });

    if (existing) {
      return res.json({
        message: 'Resuming existing attempt.',
        isResume: true,
        attempt: existing,
        test: {
          title: test.title,
          durationMinutes: test.durationMinutes,
          marksPerCorrect: test.marksPerCorrect,
          negativeMarks: test.negativeMarks
        }
      });
    }

    // Create fresh attempt
    const attemptId = 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newAttempt = await Attempt.create({
      attemptId,
      userId,
      userName,
      userEmail,
      testId: test.testId,
      testTitle: test.title,
      mode,
      answers: {},
      markedQuestions: {},
      visited: { 0: true },
      status: 'in_progress',
      startedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'New attempt started.',
      isResume: false,
      attempt: newAttempt,
      test: {
        title: test.title,
        durationMinutes: test.durationMinutes,
        marksPerCorrect: test.marksPerCorrect,
        negativeMarks: test.negativeMarks
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.syncAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, markedQuestions, visited, tabSwitches, timeTakenSec } = req.body;

    const attempt = await Attempt.findById(id) || await Attempt.findOne({ attemptId: id });
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({ error: 'This attempt has already been submitted.' });
    }

    const updates = {};
    if (answers !== undefined) updates.answers = answers;
    if (markedQuestions !== undefined) updates.markedQuestions = markedQuestions;
    if (visited !== undefined) updates.visited = visited;
    if (tabSwitches !== undefined) updates.tabSwitches = tabSwitches;
    if (timeTakenSec !== undefined) updates.timeTakenSec = timeTakenSec;

    const updated = await Attempt.findByIdAndUpdate(attempt._id || attempt.id, updates);
    res.json({ message: 'Progress saved.', attempt: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, markedQuestions, autoSubmitted, timeTakenSec, tabSwitches } = req.body;

    const attempt = await Attempt.findById(id) || await Attempt.findOne({ attemptId: id });
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    const test = await Test.findOne({ testId: attempt.testId });
    if (!test) {
      return res.status(404).json({ error: 'Associated test not found.' });
    }

    // Retrieve all questions for this test to score on the server
    const questions = await Question.find({ testId: test.testId });
    
    // Merge answers from submission payload with any previously synced answers
    const finalAnswers = answers || attempt.answers || {};
    const finalMarked = markedQuestions || attempt.markedQuestions || {};

    const evaluation = calculateScore({
      questions,
      answers: finalAnswers,
      marksPerCorrect: test.marksPerCorrect,
      negativeMarks: test.negativeMarks,
      markedQuestions: finalMarked
    });

    const finalTimeTaken = timeTakenSec !== undefined ? Number(timeTakenSec) : (attempt.timeTakenSec || 0);

    const completionUpdates = {
      answers: finalAnswers,
      markedQuestions: finalMarked,
      status: 'completed',
      correct: evaluation.correct,
      wrong: evaluation.wrong,
      unattempted: evaluation.unattempted,
      score: evaluation.score,
      accuracy: evaluation.accuracy,
      timeTakenSec: finalTimeTaken,
      autoSubmitted: Boolean(autoSubmitted),
      tabSwitches: tabSwitches !== undefined ? Number(tabSwitches) : (attempt.tabSwitches || 0),
      detailedReview: evaluation.detailedReview,
      submittedAt: new Date().toISOString()
    };

    const completedAttempt = await Attempt.findByIdAndUpdate(attempt._id || attempt.id, completionUpdates);

    res.json({
      message: 'Test submitted and evaluated successfully.',
      attempt: {
        attemptId: completedAttempt.attemptId,
        testTitle: attempt.testTitle,
        mode: attempt.mode,
        score: evaluation.score,
        totalQuestions: evaluation.totalQuestions,
        correct: evaluation.correct,
        wrong: evaluation.wrong,
        unattempted: evaluation.unattempted,
        accuracy: evaluation.accuracy,
        timeTakenSec: finalTimeTaken,
        autoSubmitted: Boolean(autoSubmitted),
        subjectStats: evaluation.subjectStats,
        detailedReview: evaluation.detailedReview,
        submittedAt: completionUpdates.submittedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id) || await Attempt.findOne({ attemptId: req.params.id });
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    res.json({ attempt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await Attempt.find({ userId });
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find();
    res.json({ attempts, total: attempts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
