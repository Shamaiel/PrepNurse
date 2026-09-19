const mongoose = require('mongoose');
const { isMongoConnected, getLocalStore } = require('../config/db');

const TestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  exam: { type: String, default: 'NORCET' },
  category: { type: String, default: 'Mains' },
  durationMinutes: { type: Number, default: 180 },
  totalQuestions: { type: Number, default: 0 },
  marksPerCorrect: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0.33 },
  instructions: { type: String },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  randomizeQuestions: { type: Boolean, default: false },
  randomizeOptions: { type: Boolean, default: false },
  enableLeaderboard: { type: Boolean, default: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongoTestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);

const Test = {
  async find(query = {}) {
    if (isMongoConnected()) {
      return await MongoTestModel.find(query).sort({ createdAt: -1 });
    }
    const store = getLocalStore();
    return store.data.tests.filter(t => {
      if (query.status && t.status !== query.status) return false;
      if (query.exam && t.exam !== query.exam) return false;
      if (query.category && t.category !== query.category) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    if (isMongoConnected()) {
      return await MongoTestModel.findById(id);
    }
    const store = getLocalStore();
    return store.data.tests.find(t => t._id === id || t.id === id || t.testId === id) || null;
  },

  async findOne(query) {
    if (isMongoConnected()) {
      return await MongoTestModel.findOne(query);
    }
    const store = getLocalStore();
    return store.data.tests.find(t => {
      for (const key in query) {
        if (t[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  },

  async create(data) {
    if (isMongoConnected()) {
      return await MongoTestModel.create(data);
    }
    const store = getLocalStore();
    const newTest = {
      _id: 'tst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      testId: data.testId || ('test_' + Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.data.tests.push(newTest);
    store.save();
    return newTest;
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoTestModel.findByIdAndUpdate(id, { ...updates, updatedAt: Date.now() }, { new: true });
    }
    const store = getLocalStore();
    const idx = store.data.tests.findIndex(t => t._id === id || t.id === id || t.testId === id);
    if (idx === -1) return null;
    store.data.tests[idx] = {
      ...store.data.tests[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    store.save();
    return store.data.tests[idx];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoTestModel.findByIdAndDelete(id);
    }
    const store = getLocalStore();
    const idx = store.data.tests.findIndex(t => t._id === id || t.id === id || t.testId === id);
    if (idx === -1) return null;
    const removed = store.data.tests.splice(idx, 1)[0];
    store.save();
    return removed;
  },

  async countDocuments(query = {}) {
    if (isMongoConnected()) {
      return await MongoTestModel.countDocuments(query);
    }
    const store = getLocalStore();
    if (query.status) {
      return store.data.tests.filter(t => t.status === query.status).length;
    }
    return store.data.tests.length;
  }
};

module.exports = Test;
