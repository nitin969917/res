const mongoose = require('mongoose');
const { readData, writeData } = require('../data/jsonDb');
const { getDbMode } = require('../config/db');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  displayName: { type: String },
  email: { type: String, unique: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.model('User', UserSchema);

const UserModel = {
  findOne: async (query) => {
    if (getDbMode() === 'mongodb') {
      return await MongoUser.findOne(query);
    } else {
      const users = readData('users');
      return users.find(u => {
        return Object.entries(query).every(([key, value]) => u[key] === value);
      }) || null;
    }
  },

  findById: async (id) => {
    if (getDbMode() === 'mongodb') {
      return await MongoUser.findById(id);
    } else {
      const users = readData('users');
      return users.find(u => u._id === id.toString()) || null;
    }
  },

  create: async (data) => {
    if (getDbMode() === 'mongodb') {
      const newUser = new MongoUser(data);
      return await newUser.save();
    } else {
      const users = readData('users');
      const newUser = {
        _id: data._id || Math.random().toString(36).substr(2, 9),
        googleId: data.googleId || null,
        displayName: data.displayName || 'Admin',
        email: data.email || 'admin@example.com',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      writeData('users', users);
      return newUser;
    }
  }
};

module.exports = { UserModel, MongoUser };
