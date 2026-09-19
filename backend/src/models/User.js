const mongoose = require('mongoose');
const { isMongoConnected, getLocalStore } = require('../config/db');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'admin'], default: 'candidate' },
  createdAt: { type: Date, default: Date.now }
});

const MongoUserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// Hybrid Data Access Layer
const User = {
  async findOne(query) {
    if (isMongoConnected()) {
      return await MongoUserModel.findOne(query);
    }
    const store = getLocalStore();
    return store.data.users.find(u => {
      for (const key in query) {
        if (query[key] && u[key] !== query[key]) {
          if (key === 'email' && u.email.toLowerCase() === query.email.toLowerCase()) continue;
          return false;
        }
      }
      return true;
    }) || null;
  },

  async findById(id) {
    if (isMongoConnected()) {
      return await MongoUserModel.findById(id).select('-password');
    }
    const store = getLocalStore();
    const u = store.data.users.find(item => item._id === id || item.id === id);
    if (!u) return null;
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  },

  async find(query = {}) {
    if (isMongoConnected()) {
      return await MongoUserModel.find(query).select('-password').sort({ createdAt: -1 });
    }
    const store = getLocalStore();
    let res = store.data.users;
    if (query.role) res = res.filter(u => u.role === query.role);
    return res.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
  },

  async create(data) {
    if (isMongoConnected()) {
      return await MongoUserModel.create(data);
    }
    const store = getLocalStore();
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      createdAt: new Date().toISOString()
    };
    store.data.users.push(newUser);
    store.save();
    return newUser;
  },

  async countDocuments(query = {}) {
    if (isMongoConnected()) {
      return await MongoUserModel.countDocuments(query);
    }
    const store = getLocalStore();
    if (!query.role) return store.data.users.length;
    return store.data.users.filter(u => u.role === query.role).length;
  }
};

module.exports = User;
