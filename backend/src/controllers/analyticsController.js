const Attempt = require('../models/Attempt');
const Test = require('../models/Test');
const Question = require('../models/Question');
const User = require('../models/User');

exports.getCandidateAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await Attempt.find({ userId, status: 'completed' });

    if (attempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        subjectPerformance: {},
        recentScores: []
      });
    }

    let totalScore = 0;
    let maxScore = 0;
    let totalAccuracy = 0;
    const subjectStats = {};

    attempts.forEach(att => {
      totalScore += att.score || 0;
      if ((att.score || 0) > maxScore) maxScore = att.score || 0;
      totalAccuracy += att.accuracy || 0;

      if (Array.isArray(att.detailedReview)) {
        att.detailedReview.forEach(q => {
          const s = q.subject || 'General Nursing';
          if (!subjectStats[s]) subjectStats[s] = { total: 0, correct: 0 };
          subjectStats[s].total++;
          if (q.isCorrect) subjectStats[s].correct++;
        });
      }
    });

    const subjectPerformance = Object.keys(subjectStats).map(name => {
      const { total, correct } = subjectStats[name];
      return {
        subject: name,
        totalQuestions: total,
        correctQuestions: correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
      };
    });

    const recentScores = attempts.slice(0, 10).map(att => ({
      attemptId: att.attemptId,
      testTitle: att.testTitle,
      score: att.score,
      accuracy: att.accuracy,
      date: att.submittedAt || att.startedAt
    }));

    res.json({
      totalAttempts: attempts.length,
      averageScore: Number((totalScore / attempts.length).toFixed(2)),
      bestScore: Number(maxScore.toFixed(2)),
      averageAccuracy: Number((totalAccuracy / attempts.length).toFixed(1)),
      subjectPerformance,
      recentScores
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalTests = await Test.countDocuments();
    const publishedTests = await Test.countDocuments({ status: 'published' });
    const draftTests = await Test.countDocuments({ status: 'draft' });
    const totalQuestions = await Question.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const allAttempts = await Attempt.find({ status: 'completed' });

    let totalScore = 0;
    let totalAccuracy = 0;
    allAttempts.forEach(att => {
      totalScore += att.score || 0;
      totalAccuracy += att.accuracy || 0;
    });

    const averageScore = allAttempts.length > 0 ? Number((totalScore / allAttempts.length).toFixed(2)) : 0;
    const averageAccuracy = allAttempts.length > 0 ? Number((totalAccuracy / allAttempts.length).toFixed(1)) : 0;

    // Test-wise statistics
    const tests = await Test.find();
    const testStats = tests.map(t => {
      const testAttempts = allAttempts.filter(a => a.testId === t.testId);
      const avg = testAttempts.length > 0
        ? Number((testAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / testAttempts.length).toFixed(2))
        : 0;

      return {
        testId: t.testId,
        title: t.title,
        status: t.status,
        totalQuestions: t.totalQuestions,
        attemptsCount: testAttempts.length,
        averageScore: avg
      };
    });

    res.json({
      totalTests,
      publishedTests,
      draftTests,
      totalQuestions,
      totalCandidates,
      totalAttempts: allAttempts.length,
      averageScore,
      averageAccuracy,
      testStats,
      recentAttempts: allAttempts.slice(0, 10).map(att => ({
        attemptId: att.attemptId,
        userName: att.userName || 'Candidate',
        userEmail: att.userEmail || '-',
        testTitle: att.testTitle,
        score: att.score,
        accuracy: att.accuracy,
        submittedAt: att.submittedAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
