const mongoose = require('mongoose');
const { initDb } = require('../data/jsonDb');

let dbMode = 'json';

async function connectDB() {
  initDb(); // Ensure local storage is initialized anyway

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('\n⚠️  No MONGODB_URI found in environment variables.');
    console.log('📂 Operating in LOCAL JSON FILE database mode.\n');
    dbMode = 'json';
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // fail fast if mongo isn't running
    });
    console.log('\n🟢 Connected to MongoDB database successfully.');
    dbMode = 'mongodb';
  } catch (error) {
    console.error('\n🔴 Failed to connect to MongoDB:', error.message);
    console.log('📂 Falling back to LOCAL JSON FILE database mode.\n');
    dbMode = 'json';
  }
}

function getDbMode() {
  return dbMode;
}

module.exports = {
  connectDB,
  getDbMode
};
