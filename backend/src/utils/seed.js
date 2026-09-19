const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Test = require('../models/Test');
const Question = require('../models/Question');

async function seedInitialData() {
  try {
    console.log('[Seed] Checking initial system data...');

    // 1. Seed Default Admin
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@norcet.in';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123', 10);
      await User.create({
        name: 'PrepNurse Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[Seed] Created default admin account: ${adminEmail}`);
    }

    // 2. Seed Default Candidate for quick testing
    const candidateEmail = 'candidate@norcet.in';
    const existingCandidate = await User.findOne({ email: candidateEmail });
    if (!existingCandidate) {
      const hashedPassword = await bcrypt.hash('Candidate@123', 10);
      await User.create({
        name: 'Dr. Priya Sharma (Aspirant)',
        email: candidateEmail,
        password: hashedPassword,
        role: 'candidate'
      });
      console.log(`[Seed] Created default candidate account: ${candidateEmail}`);
    }

    // 3. Seed NORCET Mains Test 1 from extracted JSON
    const seedFilePath = path.join(__dirname, '../../data/norcet-mains-test-1.json');
    if (fs.existsSync(seedFilePath)) {
      const fileData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));
      const existingTest = await Test.findOne({ testId: fileData.testId });

      if (!existingTest) {
        const createdTest = await Test.create({
          testId: fileData.testId,
          title: fileData.title,
          description: fileData.description,
          exam: fileData.exam,
          category: fileData.category,
          durationMinutes: fileData.durationMinutes,
          totalQuestions: fileData.questions.length,
          marksPerCorrect: fileData.marksPerCorrect,
          negativeMarks: fileData.negativeMarks,
          instructions: fileData.instructions,
          status: fileData.status || 'published',
          randomizeQuestions: false,
          randomizeOptions: false,
          createdBy: 'system'
        });

        // Seed all 160 questions
        const questionsToInsert = fileData.questions.map((q, idx) => ({
          questionId: q.questionId || `norcet-m1-q${String(idx + 1).padStart(3, '0')}`,
          testId: fileData.testId,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          tags: q.tags || ['NORCET', 'Mains']
        }));

        await Question.insertMany(questionsToInsert);
        console.log(`[Seed] Successfully seeded '${fileData.title}' with ${questionsToInsert.length} questions!`);
      } else {
        const qCount = await Question.countDocuments({ testId: fileData.testId });
        console.log(`[Seed] '${fileData.title}' already exists with ${qCount} questions.`);
      }
    } else {
      console.warn('[Seed] norcet-mains-test-1.json not found in data directory.');
    }

    console.log('[Seed] Database initialization complete.');
  } catch (err) {
    console.error('[Seed] Error seeding data:', err);
  }
}

if (require.main === module) {
  seedInitialData().then(() => {
    console.log('[Seed] Done.');
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = {
  seedInitialData
};
