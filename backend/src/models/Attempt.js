const mongoose = require('mongoose');
const { isMongoConnected, getLocalStore } = require('../config/db');

const AttemptSchema = new mongoose.Schema({
  attemptId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  userName: { type: String },
  userEmail: { type: String },
  testId: { type: String, required: true, index: true },
  testTitle: { type: String },
  mode: { type: String, enum: ['mock', 'practice'], default: 'mock' },
  answers: { type: Object, default: {} },
  markedQuestions: { type: Object, default: {} },
  visited: { type: Object, default: {} },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  unattempted: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  timeTakenSec: { type: Number, default: 0 },
  autoSubmitted: { type: Boolean, default: false },
  tabSwitches: { type: Number, default: 0 },
  detailedReview: [{ type: Object }],
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

const MongoAttemptModel = mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);

const Attempt = {
  async find(query = {}) {
    if (isMongoConnected()) {
      return await MongoAttemptModel.find(query).sort({ submittedAt: -1, startedAt: -1 });
    }
    const store = getLocalStore();
    return store.data.attempts.filter(a => {
      if (query.userId && a.userId !== query.userId) return false;
      if (query.testId && a.testId !== query.testId) return false;
      if (query.status && a.status !== query.status) return false;
      return true;
    }).sort((a, b) => new Date(b.submittedAt || b.startedAt) - new Date(a.submittedAt || a.startedAt));
  },

  async findById(id) {
    if (isMongoConnected()) {
      return await MongoAttemptModel.findById(id);
    }
    const store = getLocalStore();
    return store.data.attempts.find(a => a._id === id || a.id === id || a.attemptId === id) || null;
  },

  async findOne(query) {
    if (isMongoConnected()) {
      return await MongoAttemptModel.findOne(query);
    }
    const store = getLocalStore();
    return store.data.attempts.find(a => {
      for (const key in query) {
        if (a[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  },

  async create(data) {
    if (isMongoConnected()) {
      return await MongoAttemptModel.create(data);
    }
    const store = getLocalStore();
    const newAttempt = {
      _id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      attemptId: data.attemptId || ('att_' + Date.now()),
      ...data,
      startedAt: data.startedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.data.attempts.push(newAttempt);
    store.save();
    return newAttempt;
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoAttemptModel.findByIdAndUpdate(id, { ...updates, updatedAt: Date.now() }, { new: true });
    }
    const store = getLocalStore();
    const idx = store.data.attempts.findIndex(a => a._id === id || a.id === id || a.attemptId === id);
    if (idx === -1) return null;
    store.data.attempts[idx] = {
      ...store.data.attempts[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    store.save();
    return store.data.attempts[idx];
  },

  async countDocuments(query = {}) {
    if (isMongoConnected()) {
      return await MongoAttemptModel.countDocuments(query);
    }
    const store = getLocalStore();
    return store.data.attempts.filter(a => {
      if (query.userId && a.userId !== query.userId) return false;
      if (query.status && a.status !== query.status) return false;
      return true;
    }).length;
  }
};

module.exports = Attempt;
