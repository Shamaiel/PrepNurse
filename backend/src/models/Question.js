const mongoose = require('mongoose');
const { isMongoConnected, getLocalStore } = require('../config/db');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  testId: { type: String, required: true, index: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true },
  subject: { type: String, default: 'Medical Surgical Nursing' },
  topic: { type: String, default: 'General Nursing' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  tags: [{ type: String }],
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongoQuestionModel = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const Question = {
  async find(query = {}) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.find(query).sort({ createdAt: 1 });
    }
    const store = getLocalStore();
    return store.data.questions.filter(q => {
      if (query.testId && q.testId !== query.testId) return false;
      if (query.subject && q.subject !== query.subject) return false;
      if (query.difficulty && q.difficulty !== query.difficulty) return false;
      return true;
    });
  },

  async findById(id) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.findById(id);
    }
    const store = getLocalStore();
    return store.data.questions.find(q => q._id === id || q.id === id || q.questionId === id) || null;
  },

  async findOne(query) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.findOne(query);
    }
    const store = getLocalStore();
    return store.data.questions.find(q => {
      for (const key in query) {
        if (q[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  },

  async create(data) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.create(data);
    }
    const store = getLocalStore();
    const newQ = {
      _id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      questionId: data.questionId || ('q_' + (store.data.questions.length + 1)),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.data.questions.push(newQ);
    store.save();
    return newQ;
  },

  async insertMany(items) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.insertMany(items);
    }
    const store = getLocalStore();
    const inserted = items.map((item, idx) => ({
      _id: 'q_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substring(2, 6),
      questionId: item.questionId || ('q_' + (store.data.questions.length + idx + 1)),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    store.data.questions.push(...inserted);
    store.save();
    return inserted;
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.findByIdAndUpdate(id, { ...updates, updatedAt: Date.now() }, { new: true });
    }
    const store = getLocalStore();
    const idx = store.data.questions.findIndex(q => q._id === id || q.id === id || q.questionId === id);
    if (idx === -1) return null;
    store.data.questions[idx] = {
      ...store.data.questions[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    store.save();
    return store.data.questions[idx];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.findByIdAndDelete(id);
    }
    const store = getLocalStore();
    const idx = store.data.questions.findIndex(q => q._id === id || q.id === id || q.questionId === id);
    if (idx === -1) return null;
    const removed = store.data.questions.splice(idx, 1)[0];
    store.save();
    return removed;
  },

  async deleteMany(query = {}) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.deleteMany(query);
    }
    const store = getLocalStore();
    if (query.testId) {
      store.data.questions = store.data.questions.filter(q => q.testId !== query.testId);
      store.save();
    }
    return { acknowledged: true };
  },

  async countDocuments(query = {}) {
    if (isMongoConnected()) {
      return await MongoQuestionModel.countDocuments(query);
    }
    const store = getLocalStore();
    if (query.testId) {
      return store.data.questions.filter(q => q.testId === query.testId).length;
    }
    return store.data.questions.length;
  }
};

module.exports = Question;
